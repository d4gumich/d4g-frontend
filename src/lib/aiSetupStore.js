import { writable, get } from "svelte/store";
import { HOST_URL } from "$lib/config.js";
import {
  clearCsrf,
  csrfHeaders,
  rememberCsrf,
  rememberSessionStatuses,
} from "$lib/byokSession.js";

export { HOST_URL };

export const aiStatus = writable({
  status: "inactive",
  provider: "google",
  model: "gemini-2.5-flash-lite",
  loading: true,
  forceTeamKey: false,
  hasError: false,
  errorMessage: "",
  key_source: "none",
  availableModels: [],
  connected: false,
  expires_at: null,
  absolute_expires_at: null,
});

export const aiActions = {
  async prepareCsrf() {
    const [sessionResponse, lighthouseResponse] = await Promise.all([
      fetch(`${HOST_URL}api/v1/auth/status`, { credentials: "include" }),
      fetch(`${HOST_URL}api/v1/auth/lighthouse-status`, {
        credentials: "include",
      }),
    ]);
    if (!sessionResponse.ok) {
      throw new Error("Backend offline");
    }
    const sessionData = await sessionResponse.json();
    const lighthouseData = lighthouseResponse.ok
      ? await lighthouseResponse.json()
      : null;
    rememberSessionStatuses(sessionData, lighthouseData);
    return sessionData;
  },

  async fetchStatus() {
    aiStatus.update((s) => ({ ...s, loading: true }));
    try {
      const data = await this.prepareCsrf();
      aiStatus.update((s) => ({
        ...s,
        ...data,
        key_source: data.key_source || "none",
        expires_at: data.status === "active" ? data.expires_at || null : null,
        absolute_expires_at:
          data.status === "active" ? data.absolute_expires_at || null : null,
        loading: false,
        connected: true,
        hasError: s.errorMessage === "Backend offline" ? false : s.hasError,
        errorMessage:
          s.errorMessage === "Backend offline" ? "" : s.errorMessage,
      }));

      const provider = data.provider || "google";
      await this.fetchModels(provider);
      return data;
    } catch {
      aiStatus.update((s) => ({
        ...s,
        connected: false,
        hasError: true,
        errorMessage: "Backend offline",
      }));
    } finally {
      aiStatus.update((s) => ({ ...s, loading: false }));
    }
  },

  async fetchModels(provider = null, apiKey = null) {
    const currentStatus = get(aiStatus);
    const activeProvider = provider || currentStatus.provider || "google";

    try {
      const body = { provider: activeProvider };
      if (apiKey) body.api_key = apiKey;

      const response = await fetch(`${HOST_URL}api/v1/auth/models`, {
        method: "POST",
        headers: csrfHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(body),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        aiStatus.update((s) => ({ ...s, availableModels: data.models }));
        return data.models;
      }
    } catch {
      /* A model refresh can fail quietly. The form still accepts a saved key. */
    }
    return [];
  },

  async setModel(modelId) {
    const currentStatus = get(aiStatus);

    // Update local state immediately
    aiStatus.update((s) => ({ ...s, model: modelId }));

    try {
      // Always update session on backend
      // If status is inactive, this creates a 'Team Key' session
      const sessionResponse = await fetch(`${HOST_URL}api/v1/auth/session`, {
        method: "POST",
        headers: csrfHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          provider: currentStatus.provider || "google",
          model: modelId,
        }),
        credentials: "include",
      });
      if (sessionResponse.ok) {
        const sessionBody = await sessionResponse.json();
        rememberCsrf("session", sessionBody.csrf_token);
      }

      // Re-fetch status to confirm session is now 'active'
      if (currentStatus.status !== "active") {
        await this.fetchStatus();
      }
    } catch {
      /* The menu already shows the selected model if the session sync fails. */
    }
  },

  async logout() {
    try {
      await fetch(`${HOST_URL}api/v1/auth/logout`, {
        method: "POST",
        headers: csrfHeaders(),
        credentials: "include",
      });
      clearCsrf("session");
      aiStatus.update((s) => ({
        ...s,
        status: "inactive",
        provider: "google",
        model: null,
        loading: false,
        forceTeamKey: false,
        key_source: "none",
        availableModels: [],
        expires_at: null,
        absolute_expires_at: null,
      }));
      // Refresh team models
      await this.fetchModels("google");
    } catch {
      /* The page clears the signed-in state again when status is next read. */
    }
  },

  setForceTeamKey(value) {
    aiStatus.update((s) => ({ ...s, forceTeamKey: value }));
    // Refresh models when switching back to team key
    if (value) {
      this.fetchModels("google");
    }
  },

  setError(hasError, message = "") {
    aiStatus.update((s) => ({ ...s, hasError, errorMessage: message }));
  },
};
