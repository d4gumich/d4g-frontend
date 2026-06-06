import { writable, get } from 'svelte/store';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const HOST_URL = PUBLIC_BACKEND_URL || 'https://d4gumsi.pythonanywhere.com/';

export const aiStatus = writable({
    status: 'inactive',
    provider: 'google',
    model: 'gemini-2.5-flash-lite',
    loading: true,
    forceTeamKey: false,
    hasError: false,
    errorMessage: "",
    availableModels: []
});

export const aiActions = {
    async fetchStatus() {
        aiStatus.update(s => ({ ...s, loading: true }));
        try {
            const response = await fetch(`${HOST_URL}api/v1/auth/status`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                aiStatus.update(s => ({ 
                    ...s, 
                    ...data, 
                    loading: false
                }));

                // Auto-fetch models
                const provider = data.provider || 'google';
                await this.fetchModels(provider);
                
                return data;
            }
        } catch (err) {
            console.error("Failed to fetch AI session status:", err);
            aiStatus.update(s => ({ ...s, hasError: true, errorMessage: "Backend Connection Failed" }));
        } finally {
            aiStatus.update(s => ({ ...s, loading: false }));
        }
    },

    async fetchModels(provider = null, apiKey = null) {
        const currentStatus = get(aiStatus);
        const activeProvider = provider || currentStatus.provider || 'google';
        
        try {
            const body = { provider: activeProvider };
            if (apiKey) body.api_key = apiKey;

            const response = await fetch(`${HOST_URL}api/v1/auth/models`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                aiStatus.update(s => ({ ...s, availableModels: data.models }));
                return data.models;
            }
        } catch (err) {
            console.error("Failed to fetch available models:", err);
        }
        return [];
    },

    async setModel(modelId) {
        const currentStatus = get(aiStatus);
        
        // Update local state immediately
        aiStatus.update(s => ({ ...s, model: modelId }));

        try {
            // Always update session on backend
            // If status is inactive, this creates a 'Team Key' session
            await fetch(`${HOST_URL}api/v1/auth/session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider: currentStatus.provider || 'google',
                    model: modelId
                }),
                credentials: 'include'
            });
            
            // Re-fetch status to confirm session is now 'active'
            if (currentStatus.status !== 'active') {
                await this.fetchStatus();
            }
        } catch (err) {
            console.error("Failed to sync model session:", err);
        }
    },

    async logout() {
        try {
            await fetch(`${HOST_URL}api/v1/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            aiStatus.update(s => ({ 
                ...s,
                status: 'inactive', 
                provider: 'google', 
                model: null, 
                loading: false,
                forceTeamKey: false,
                availableModels: []
            }));
            // Refresh team models
            await this.fetchModels('google');
        } catch (err) {
            console.error("Logout failed:", err);
        }
    },

    setForceTeamKey(value) {
        aiStatus.update(s => ({ ...s, forceTeamKey: value }));
        // Refresh models when switching back to team key
        if (value) {
            this.fetchModels('google');
        }
    },

    setError(hasError, message = "") {
        aiStatus.update(s => ({ ...s, hasError, errorMessage: message }));
    }
};
