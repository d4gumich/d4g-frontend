import { writable, get } from 'svelte/store';

const HOST_URL = 'http://127.0.0.1:8000';
const BASE_PATH = '/api/v1/products/lighthouse';

// Mock Data for Development
const MOCK_ANALYSIS = {
    extracted_skills: ["Python", "PostGIS", "Machine Learning", "BigQuery GIS", "Scikit-learn", "Spatial Statistics", "Remote Sensing", "GeoPandas", "PyTorch"],
    top_jobs: [
        { title: "Senior Geospatial Data Scientist", score: 0.95 },
        { title: "Spatial Analyst", score: 0.82 },
        { title: "Remote Sensing Engineer", score: 0.78 }
    ],
    recommendations: [
        "<strong>Strengthen Cloud Experience:</strong> Highlight specific AWS SageMaker projects more prominently.",
        "<strong>Certification:</strong> Consider adding a GCP Professional Data Engineer certification to match your BigQuery expertise.",
        "<strong>Portfolio:</strong> Link your 'Satellite-Based Wildfire Risk Assessment' project directly to a GitHub repo if possible.",
        "Your background in <em>Geospatial Statistics</em> is a major differentiator; ensure this is in your 'Professional Summary' header."
    ],
    status: "success"
};

// State Store
export const lighthouseStatus = writable({
    stage: 'OFFLINE',
    hardware: 'None',
    message: '',
    loading: false,
    isRefreshing: false,
    requestedHardware: null,
    error: null
});

// Settings Store (initialized from Environment Variable)
const isMockRequested = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const lighthouseSettings = writable({
    useMockData: isMockRequested
});

export const lighthouseResults = writable({
    currentId: null,
    history: [], // Array of { id, name, timestamp, extractedText, sections, analysis, isSanitized }
    loading: false,
    error: null
});

// Persistence
if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('lighthouse_history');
    if (saved) {
        try {
            const history = JSON.parse(saved);
            lighthouseResults.update(r => ({ ...r, history }));
        } catch (e) {
            console.error("Failed to load history from cache");
        }
    }
}

function saveHistory(history) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('lighthouse_history', JSON.stringify(history.slice(0, 10))); // Keep last 10
    }
}

function formatError(err) {
    const message = err.message || String(err);
    const isHFError = message.includes('MaxRetryError') || 
                     message.includes('502') || 
                     message.includes('Bad Gateway') || 
                     message.includes('HTTPSConnectionPool') ||
                     message.includes('ProxyError');
    
    if (isHFError) {
        return `Hugging Face Service Error: The engine is currently unreachable (Bad Gateway/Max Retries). This usually happens during a cold start or high load. Please wait 1-2 minutes and try again. Original error: ${message}`;
    }
    return message;
}

async function apiRequest(path, options = {}) {
    try {
        const response = await fetch(`${HOST_URL}${BASE_PATH}${path}`, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
            throw new Error(errorData.detail || `Server error: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.error(`API Request failed: ${path}`, err);
        throw err;
    }
}

export const lighthouseActions = {
    async fetchStatus(isSilent = false) {
        if (isSilent) {
            lighthouseStatus.update(s => ({ ...s, isRefreshing: true }));
        } else {
            lighthouseStatus.update(s => ({ ...s, loading: true }));
        }
        
        try {
            const status = await apiRequest('/status');
            lighthouseStatus.update(s => {
                const isHardwareReady = status.hardware && 
                                      status.hardware !== 'UNKNOWN' && 
                                      status.hardware !== 'NULL' && 
                                      status.hardware !== 'None';
                
                return {
                    ...status,
                    loading: false,
                    isRefreshing: false,
                    requestedHardware: isHardwareReady ? null : s.requestedHardware,
                    error: null
                };
            });
            return status;
        } catch (err) {
            lighthouseStatus.update(s => ({ 
                ...s, 
                loading: false, 
                isRefreshing: false, 
                error: formatError(err)
            }));
        }
    },

    async wakeup() {
        lighthouseStatus.update(s => ({ ...s, loading: true, requestedHardware: 'T4 Small' }));
        try {
            const status = await apiRequest('/wakeup', { method: 'POST' });
            lighthouseStatus.update(s => ({ 
                ...status, 
                loading: false, 
                requestedHardware: s.requestedHardware 
            }));
            return status;
        } catch (err) {
            lighthouseStatus.update(s => ({ ...s, loading: false, error: formatError(err), requestedHardware: null }));
        }
    },

    async uploadPdf(file, sanitize = false) {
        lighthouseResults.update(r => ({ ...r, loading: true, error: null }));
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sanitize', sanitize);

        try {
            const result = await apiRequest('/parse-pdf', {
                method: 'POST',
                body: formData
            });
            
            const rawText = result.extracted_text;
            const sections = this.splitIntoSections(rawText);
            const docId = Date.now().toString();

            const newDoc = {
                id: docId,
                name: file.name,
                timestamp: new Date().toISOString(),
                extractedText: rawText,
                sections: sections,
                isSanitized: sanitize,
                analysis: null
            };

            lighthouseResults.update(r => {
                const history = [newDoc, ...r.history];
                saveHistory(history);
                return { ...r, currentId: docId, history, loading: false };
            });

            return result;
        } catch (err) {
            lighthouseResults.update(r => ({ ...r, loading: false, error: formatError(err) }));
            throw err;
        }
    },

    splitIntoSections(text) {
        if (!text) return [];
        const headerPattern = /^([A-Z][A-Z\s]{2,20}|Professional Summary|Work Experience|Employment History|Technical Skills|Academic Background|Core Competencies|Education|Skills|Projects|Certifications|Awards|Summary|Experience):?\s*$/gm;
        const sections = [];
        let match;
        const matches = [];
        headerPattern.lastIndex = 0;
        while ((match = headerPattern.exec(text)) !== null) {
            matches.push({ index: match.index, title: match[1].trim(), length: match[0].length });
        }
        if (matches.length === 0) return [{ title: 'Main Content', content: text, selected: true }];
        if (matches[0].index > 0) {
            sections.push({ title: 'Header / Contact', content: text.substring(0, matches[0].index).trim(), selected: true });
        }
        for (let i = 0; i < matches.length; i++) {
            const start = matches[i].index + matches[i].length;
            const end = i < matches.length - 1 ? matches[i + 1].index : text.length;
            sections.push({ title: matches[i].title, content: text.substring(start, end).trim(), selected: true });
        }
        return sections.filter(s => s.content.length > 0);
    },

    toggleSection(index) {
        lighthouseResults.update(r => {
            const history = [...r.history];
            const docIndex = history.findIndex(d => d.id === r.currentId);
            if (docIndex !== -1) {
                const doc = { ...history[docIndex] };
                const newSections = [...doc.sections];
                newSections[index] = { ...newSections[index], selected: !newSections[index].selected };
                doc.sections = newSections;
                history[docIndex] = doc;
                saveHistory(history);
            }
            return { ...r, history };
        });
    },

    async analyzeText(text, sanitize = false) {
        const settings = get(lighthouseSettings);
        lighthouseResults.update(r => ({ ...r, loading: true, error: null }));
        
        try {
            let result;
            if (settings.useMockData) {
                // Simulate latency
                await new Promise(resolve => setTimeout(resolve, 1500));
                result = JSON.parse(JSON.stringify(MOCK_ANALYSIS));
            } else {
                result = await apiRequest('/analyze-text', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ resume_text: text, sanitize })
                });
            }

            const ensureArray = (input) => {
                if (!input) return [];
                if (Array.isArray(input)) return input.map(item => typeof item === 'object' ? JSON.stringify(item) : String(item));
                if (typeof input === 'string') {
                    try {
                        const parsed = JSON.parse(input);
                        if (Array.isArray(parsed)) return parsed.map(String);
                    } catch (e) {
                        if (input.includes('\n')) return input.split('\n').map(s => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean);
                        if (input.includes(',')) return input.split(',').map(s => s.trim()).filter(Boolean);
                        return [input];
                    }
                }
                return [String(input)];
            };

            const ensureJobArray = (input) => {
                if (!input) return [];
                if (Array.isArray(input)) return input.map(item => {
                    if (typeof item === 'object' && item.title) return item;
                    return { title: String(item), score: 0 };
                });
                if (typeof input === 'string') {
                    try {
                        const parsed = JSON.parse(input);
                        if (Array.isArray(parsed)) return ensureJobArray(parsed);
                    } catch (e) {
                        return [{ title: input, score: 0 }];
                    }
                }
                return [];
            };

            const cleanedResult = {
                ...result,
                extracted_skills: ensureArray(result.extracted_skills),
                recommendations: ensureArray(result.recommendations),
                top_jobs: ensureJobArray(result.top_jobs)
            };

            lighthouseResults.update(r => {
                const history = [...r.history];
                const docIndex = history.findIndex(d => d.id === r.currentId);
                if (docIndex !== -1) {
                    history[docIndex] = { ...history[docIndex], analysis: cleanedResult };
                    saveHistory(history);
                }
                return { ...r, history, loading: false };
            });

            return cleanedResult;
        } catch (err) {
            lighthouseResults.update(r => ({ ...r, loading: false, error: formatError(err) }));
            throw err;
        }
    },

    selectDocument(id) {
        lighthouseResults.update(r => ({ ...r, currentId: id }));
    },

    deleteDocument(id) {
        lighthouseResults.update(r => {
            const history = r.history.filter(doc => doc.id !== id);
            saveHistory(history);
            const currentId = r.currentId === id ? (history[0]?.id || null) : r.currentId;
            return { ...r, history, currentId };
        });
    }
};
