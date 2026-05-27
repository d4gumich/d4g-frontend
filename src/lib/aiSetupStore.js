import { writable } from 'svelte/store';
import { env } from '$env/dynamic/public';

export const HOST_URL = env.PUBLIC_BACKEND_URL || 'https://d4gumsi.pythonanywhere.com/';

export const aiStatus = writable({
    status: 'inactive',
    provider: null,
    model: null,
    loading: true,
    forceTeamKey: false,
    hasError: false,
    errorMessage: ""
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
                    loading: false,
                    // If we successfully get status, clear general connection errors
                    // but keep the specific session status
                }));
                return data;
            }
        } catch (err) {
            console.error("Failed to fetch AI session status:", err);
            aiStatus.update(s => ({ ...s, hasError: true, errorMessage: "Backend Connection Failed" }));
        } finally {
            aiStatus.update(s => ({ ...s, loading: false }));
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
                provider: null, 
                model: null, 
                loading: false,
                forceTeamKey: false
            }));
        } catch (err) {
            console.error("Logout failed:", err);
        }
    },

    setForceTeamKey(value) {
        aiStatus.update(s => ({ ...s, forceTeamKey: value }));
    },

    setError(hasError, message = "") {
        aiStatus.update(s => ({ ...s, hasError, errorMessage: message }));
    }
};
