<script>
    import { onMount } from 'svelte';
    import { PUBLIC_BACKEND_URL } from '$env/static/public';
    import Button from './button.svelte';

    let { 
        onComplete, 
        onCancel = null, 
        onLogout = null, 
        initialProvider = "google", 
        initialModel = "gemini-3.1-pro-preview",
        sessionActive = false
    } = $props();

    let provider = $state(initialProvider);
    let model = $state(initialModel);
    let apiKey = $state("");
    let loading = $state(false);
    let error = $state("");

    const host_url = PUBLIC_BACKEND_URL || 'https://d4gumsi.pythonanywhere.com/';

    const models = {
        google: [
            { id: "gemini-3.1-thinking-preview", name: "Gemini 3.1 Thinking (Highest Reasoning)" },
            { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro (Standard Reasoning)" },
            { id: "gemini-3.1-flash-preview", name: "Gemini 3.1 Flash (Fast/Lite)" },
            { id: "gemini-2.5-pro-preview", name: "Gemini 2.5 Pro (Standard Reasoning)" },
            { id: "gemini-2.5-flash-preview", name: "Gemini 2.5 Flash (Fast/Lite)" },
            { id: "gemini-2.0-pro-preview", name: "Gemini 2.0 Pro" },
            { id: "gemini-2.0-flash-preview", name: "Gemini 2.0 Flash" },
            { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
            { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" }
        ],
        openai: [
            { id: "gpt-5-reasoning", name: "GPT-5 Reasoning (Ultra)" },
            { id: "gpt-5", name: "GPT-5 (Standard)" },
            { id: "gpt-5-mini", name: "GPT-5 Mini (Fast)" },
            { id: "o3-mini", name: "o3-mini (Thinking)" },
            { id: "o1", name: "o1 (High Reasoning)" },
            { id: "gpt-4o", name: "GPT-4o (Omni)" },
            { id: "gpt-4o-mini", name: "GPT-4o Mini" },
            { id: "gpt-4-turbo", name: "GPT-4 Turbo" }
        ],
        anthropic: [
            { id: "claude-4-opus", name: "Claude 4 Opus (Deep Thinking)" },
            { id: "claude-4-sonnet", name: "Claude 4 Sonnet (Reasoning)" },
            { id: "claude-4-haiku", name: "Claude 4 Haiku (Fast)" },
            { id: "claude-3-7-sonnet-latest", name: "Claude 3.7 Sonnet" },
            { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet" },
            { id: "claude-3-5-haiku-latest", name: "Claude 3.5 Haiku" },
            { id: "claude-3-opus-latest", name: "Claude 3 Opus" }
        ]
    };

    function handleProviderChange() {
        model = models[provider][0].id;
    }

    async function handleSubmit() {
        if (!sessionActive && !apiKey.trim()) {
            error = "Please provide your API key.";
            return;
        }

        loading = true;
        error = "";

        try {
            const body = {
                provider: provider,
                model: model
            };
            if (apiKey.trim()) {
                body.api_key = apiKey;
            }

            const response = await fetch(`${host_url}api/v1/auth/session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Failed to initialize session.");
            }

            const data = await response.json();
            // Session cookie is set automatically by the browser (HttpOnly)
            onComplete();
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    }
</script>

<div class="modal-overlay">
    <div class="modal-content">
        <h2>🛠️ Socrates Setup</h2>
        <p>This prototype requires your own AI Agent API key to function. We never store your key persistently.</p>

        <div class="form-group">
            <label for="provider">AI Provider</label>
            <select id="provider" bind:value={provider} onchange={handleProviderChange}>
                <option value="google">Google Gemini</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic Claude</option>
            </select>
        </div>

        <div class="form-group">
            <label for="model">Model Variant</label>
            <select id="model" bind:value={model}>
                {#each models[provider] as m}
                    <option value={m.id}>{m.name}</option>
                {/each}
            </select>
        </div>

        <div class="form-group">
            <label for="api-key">API Key</label>
            <input 
                type="password" 
                id="api-key" 
                bind:value={apiKey} 
                placeholder={sessionActive ? "Keep current key or enter new one..." : "Paste your API key here..."} 
            />
            <div class="security-warning">
                <strong>ATTENTION:</strong> Your key is encrypted in-memory and expires after 30 mins of inactivity.
            </div>
        </div>

        {#if error}
            <div class="error-msg">❌ {error}</div>
        {/if}

        <div class="actions">
            {#if onCancel}
                <button class="btn-cancel" onclick={onCancel} disabled={loading}>Cancel</button>
            {/if}
            
            {#if onLogout}
                <button class="btn-cancel btn-danger-text" onclick={onLogout} disabled={loading}>Logout / Clear Session</button>
            {/if}

            <Button 
                text={loading ? "Validating Key..." : (onCancel ? "Update Settings" : "Configure Agent")} 
                click={handleSubmit}
                disabled={loading || !apiKey.trim()}
            />
        </div>
    </div>
</div>

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        backdrop-filter: blur(5px);
    }

    .modal-content {
        background: white;
        padding: 2.5rem;
        border-radius: 1rem;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }

    h2 {
        margin-top: 0;
        color: var(--blue-color-main);
        font-family: "Outfit", sans-serif;
    }

    p {
        color: #666;
        margin-bottom: 2rem;
        line-height: 1.5;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--text-color-main);
    }

    select, input {
        width: 100%;
        padding: 0.8rem;
        border: 2px solid #eee;
        border-radius: 0.5rem;
        font-family: inherit;
        font-size: 1rem;
    }

    select:focus, input:focus {
        outline: none;
        border-color: var(--button-color);
    }

    .security-warning {
        display: block;
        margin-top: 0.75rem;
        color: #ff0000;
        font-size: 0.85rem;
        font-weight: 800;
        line-height: 1.4;
        animation: pulse-red 2s infinite;
    }

    @keyframes pulse-red {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.02); }
        100% { opacity: 1; transform: scale(1); }
    }

    .error-msg {
        background: #fff0f0;
        color: #d32f2f;
        padding: 0.75rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
    }

    .actions {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
    }

    .btn-cancel {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        font-size: 0.9rem;
        text-decoration: underline;
    }

    .btn-cancel:hover {
        color: var(--text-color-main);
    }

    .btn-danger-text {
        color: #d32f2f;
    }

    .btn-danger-text:hover {
        color: #ff0000;
    }
</style>
