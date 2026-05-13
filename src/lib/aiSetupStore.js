import { writable } from 'svelte/store';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const HOST_URL = PUBLIC_BACKEND_URL || 'https://d4gumsi.pythonanywhere.com/';

export const aiStatus = writable({
    status: 'inactive',
    provider: null,
    model: null,
    loading: true
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
                aiStatus.set({ ...data, loading: false });
                return data;
            }
        } catch (err) {
            console.error("Failed to fetch AI session status:", err);
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
            aiStatus.set({ status: 'inactive', provider: null, model: null, loading: false });
        } catch (err) {
            console.error("Logout failed:", err);
        }
    }
};
