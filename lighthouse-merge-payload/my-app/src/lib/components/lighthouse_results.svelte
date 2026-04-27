<script>
    import { lighthouseResults, lighthouseActions, lighthouseStatus, lighthouseSettings } from '../lighthouseStore.js';
    import { fade, slide } from 'svelte/transition';

    let activeTab = $state('preview'); // 'preview', 'analysis'

    let currentDoc = $derived($lighthouseResults.history.find(d => d.id === $lighthouseResults.currentId));
    let results = $derived(currentDoc?.analysis);
    let sections = $derived(currentDoc?.sections || []);
    let isSanitized = $derived(currentDoc?.isSanitized);
    let isEngineRunning = $derived($lighthouseStatus.stage === 'RUNNING' || $lighthouseSettings.useMockData);

    let selectedText = $derived(
        sections
            .filter(s => s.selected)
            .map(s => s.content)
            .join('\n\n')
    );

    async function triggerAnalysis() {
        if (selectedText) {
            await lighthouseActions.analyzeText(selectedText);
            activeTab = 'analysis';
        }
    }

    function highlightRedacted(content) {
        if (!content) return "";
        let escaped = content
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        
        const placeholders = /\[(NAME|LOCATION|EMAIL|PHONE|POSTAL_CODE|IP_ADDRESS|URL|SOCIAL_LINK|PERSON|GPE|LOC|FAC)\]/g;
        return escaped.replace(placeholders, '<span class="pii-highlight">$&</span>');
    }

    const sectionColors = [
        '#e3b878', '#1b3350', '#afb6a6', '#388e3c', '#f57c00', '#d32f2f'
    ];

    function getSectionBorder(index) {
        return sectionColors[index % sectionColors.length];
    }
</script>

<div class="results-layout">
    {#if $lighthouseResults.loading}
        <div class="loading-overlay" in:fade>
            <div class="spinner"></div>
            <p>Lighthouse is scanning your profile...</p>
        </div>
    {/if}

    {#if currentDoc}
        <div class="doc-header">
            <div class="doc-info">
                <h2>{currentDoc.name}</h2>
                <span class="timestamp">{new Date(currentDoc.timestamp).toLocaleString()}</span>
            </div>
            <div class="tab-switcher">
                <button 
                    class:active={activeTab === 'preview'} 
                    onclick={() => activeTab = 'preview'}
                >
                    Document Preview
                </button>
                <button 
                    class:active={activeTab === 'analysis'} 
                    disabled={!results}
                    onclick={() => activeTab = 'analysis'}
                >
                    AI Analysis
                </button>
            </div>
        </div>

        {#if activeTab === 'preview'}
            <div class="tab-content" in:fade>
                <div class="preview-controls">
                    <div class="selection-summary">
                        <strong>{sections.filter(s => s.selected).length}</strong> of {sections.length} sections selected
                    </div>
                    
                    <div class="action-group">
                        {#if !isEngineRunning}
                            <span class="warning-tag">Engine Offline</span>
                        {/if}
                        <button 
                            class="btn-primary btn-sm" 
                            onclick={triggerAnalysis}
                            disabled={!isEngineRunning || $lighthouseResults.loading || selectedText.length === 0}
                        >
                            {results ? 'Re-Run Analysis' : 'Run AI Analysis'}
                        </button>
                    </div>
                </div>

                <div class="sections-container">
                    {#each sections as section, i}
                        <div 
                            class="section-block" 
                            class:unselected={!section.selected}
                            style="border-left: 4px solid {getSectionBorder(i)}"
                        >
                            <div class="section-header">
                                <label class="checkbox-container">
                                    <input 
                                        type="checkbox" 
                                        checked={section.selected} 
                                        onchange={() => lighthouseActions.toggleSection(i)}
                                    />
                                    <span class="section-title">{section.title}</span>
                                </label>
                            </div>
                            <div class="section-content">
                                {@html highlightRedacted(section.content)}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {:else if activeTab === 'analysis' && results}
            <div class="tab-content analysis-tab" in:fade>
                <div class="analysis-grid">
                    <div class="analysis-column">
                        <div class="card compact-card">
                            <h3>Extracted Skills</h3>
                            <div class="skills-list">
                                {#each results.extracted_skills as skill}
                                    <span class="skill-tag">{skill}</span>
                                {/each}
                            </div>
                        </div>

                        <div class="card compact-card">
                            <h3>Top Job Matches</h3>
                            <div class="jobs-list">
                                {#each results.top_jobs as job}
                                    <div class="job-item">
                                        <strong>{job.title}</strong>
                                        <span class="score">{Math.round(job.score * 100)}%</span>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>

                    <div class="analysis-column main-col">
                        <div class="card recommendations-card">
                            <h3>AI Recommendations</h3>
                            <div class="scroll-box">
                                <ul class="recommendations">
                                    {#each results.recommendations as rec}
                                        <li>{@html rec}</li>
                                    {/each}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    {:else}
        <div class="empty-state">
            <div class="empty-icon">📄</div>
            <h3>No Document Selected</h3>
            <p>Upload a resume or select one from your history to begin.</p>
        </div>
    {/if}
</div>

<style>
    .results-layout {
        position: relative;
        min-height: 400px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
    }

    .doc-header {
        padding: 1.5rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fafafa;
        border-radius: 8px 8px 0 0;
    }

    .doc-info h2 { margin: 0; font-size: 1.25rem; color: var(--blue-color-main); }
    .doc-info .timestamp { font-size: 0.75rem; color: #888; }

    .tab-switcher {
        display: flex;
        background: #eee;
        padding: 0.25rem;
        border-radius: 6px;
        gap: 0.25rem;
    }

    .tab-switcher button {
        background: transparent;
        color: #666;
        padding: 0.4rem 1rem;
        font-size: 0.85rem;
        border-radius: 4px;
        text-transform: none;
    }

    .tab-switcher button.active {
        background: white;
        color: var(--blue-color-main);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .tab-content {
        padding: 1.5rem;
        flex: 1;
        overflow-y: auto;
        max-height: calc(100vh - 250px);
    }

    .preview-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px dashed #ddd;
    }

    .selection-summary { font-size: 0.9rem; color: #555; }
    
    .action-group {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .warning-tag {
        font-size: 0.7rem;
        color: var(--error-color);
        font-weight: 700;
        text-transform: uppercase;
    }

    .btn-sm { padding: 0.4rem 1rem; font-size: 0.8rem; }

    .sections-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .section-block {
        background: #fdfdfd;
        padding: 1rem;
        border-radius: 0 4px 4px 0;
        border: 1px solid #eee;
        border-left-width: 4px;
    }

    .section-block.unselected { opacity: 0.4; }

    .section-title { font-weight: 700; font-size: 0.85rem; color: var(--blue-color-main); }
    .section-content { font-size: 0.85rem; color: #555; white-space: pre-wrap; margin-top: 0.5rem; }

    .analysis-grid {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 1.5rem;
        align-items: start;
    }

    .analysis-column { display: flex; flex-direction: column; gap: 1.5rem; }

    .compact-card { padding: 1rem; margin-bottom: 0; border: 1px solid #eee; }
    .compact-card h3 { font-size: 0.9rem; margin-top: 0; margin-bottom: 0.8rem; border-bottom: 1px solid #eee; padding-bottom: 0.4rem; }

    .skills-list { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .skill-tag { background: var(--button-color-green); font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px; }

    .job-item { display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.3rem 0; border-bottom: 1px solid #f5f5f5; }
    .score { color: var(--success-color); font-weight: 700; }

    .recommendations-card { height: 100%; display: flex; flex-direction: column; }
    .scroll-box { max-height: 500px; overflow-y: auto; padding-right: 0.5rem; }

    .recommendations { padding-left: 1.2rem; }
    .recommendations li { margin-bottom: 0.8rem; font-size: 0.9rem; line-height: 1.5; color: #444; }

    .empty-state {
        padding: 5rem 2rem;
        text-align: center;
        color: #888;
    }

    .empty-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.3; }

    .loading-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(255,255,243,0.9);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 100;
        border-radius: 8px;
    }

    .spinner {
        width: 40px; height: 40px;
        border: 4px solid #eee;
        border-top: 4px solid var(--blue-color-main);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes spin { 100% { transform: rotate(360deg); } }

    :global(.pii-highlight) {
        background-color: var(--button-color);
        padding: 0 2px;
        border-radius: 2px;
        font-weight: 600;
    }

    .checkbox-container { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }

    @media (max-width: 1000px) {
        .analysis-grid { grid-template-columns: 1fr; }
    }
</style>
