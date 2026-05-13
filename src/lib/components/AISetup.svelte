<script>
    import { onMount } from 'svelte';
    import { PUBLIC_BACKEND_URL } from '$env/static/public';
    import Button from './button.svelte';
    import { aiStatus, aiActions, HOST_URL } from '$lib/aiSetupStore.js';

    let { onComplete, onCancel = null, productName = "AI Product" } = $props();

    let provider = $state($aiStatus.provider || "google");
    let model = $state($aiStatus.model || "gemini-1.5-flash");
    let apiKey = $state("");

    let loading = $state(false);
    let error = $state("");

    const models = {
        google: [
            { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (High Quality)" },
            { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (Fast)" },
            { id: "gemini-1.5-flash-8b", name: "Gemini 1.5 Flash-8B (Lightweight)" }
        ],
        openai: [
            { id: "gpt-4o", name: "GPT-4o (High Quality)" },
            { id: "gpt-4o-mini", name: "GPT-4o Mini (Fast)" },
            { id: "o1-mini", name: "o1-mini (Reasoning)" }
        ],
        anthropic: [
            { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet (Balanced)" },
            { id: "claude-3-5-haiku-latest", name: "Claude 3.5 Haiku (Fast)" },
            { id: "claude-3-opus-latest", name: "Claude 3 Opus (Reasoning)" }
        ]
    };

    function handleProviderChange() {
        model = models[provider][0].id;
    }

    async function handleSubmit() {
        if ($aiStatus.status !== 'active' && !apiKey.trim()) {
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

            const response = await fetch(`${HOST_URL}api/v1/auth/session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Failed to initialize session.");
            }

            // Update store
            await aiActions.fetchStatus();
            onComplete();
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    }

    async function handleLogout() {
        await aiActions.logout();
        onCancel && onCancel();
    }
</script>

<div class="modal-overlay" onclick={onCancel} onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && onCancel && onCancel()} role="button" tabindex="0">
    <div class="modal-content" onclick={(e) => e.stopPropagation()} role="none">
        <h2>🛠️ {productName} Setup</h2>
        <p>This product requires your own AI API key to function securely. We never store your key persistently.</p>

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
                {:else}
                    <option value="">No models available</option>
                {/each}
            </select>
        </div>

        <div class="form-group">
            <label for="api-key">API Key</label>
            <input 
                type="password" 
                id="api-key" 
                bind:value={apiKey} 
                placeholder={$aiStatus.status === 'active' ? "Keep current key or enter new one..." : "Paste your API key here..."} 
            />
            <div class="security-warning">
                <strong>SECURE SESSION:</strong> Your key is used for this session only and expires after 30 mins of inactivity.
            </div>
        </div>

        {#if error}
            <div class="error-msg">❌ {error}</div>
        {/if}

        <div class="actions">
            {#if onCancel}
                <button class="btn-cancel" onclick={onCancel} disabled={loading}>Cancel</button>
            {/if}
            
            {#if $aiStatus.status === 'active'}
                <button class="btn-cancel btn-danger-text" onclick={handleLogout} disabled={loading}>Clear Session</button>
            {/if}

            <Button 
                text={loading ? "..." : ($aiStatus.status === 'active' ? "Update" : "Save")} 
                click={handleSubmit}
                disabled={loading || ($aiStatus.status !== 'active' && !apiKey.trim())}
                styleAdjustment="width: auto; min-width: 6rem; padding: 0.5rem 1rem;"
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
        font-size: 0.95rem;
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
        color: var(--blue-color-main);
        font-size: 0.8rem;
        font-weight: 600;
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
        gap: 1.5rem;
        margin-top: 1rem;
    }

    .btn-cancel {
        background: none;
        border: none;
        color: #888;
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
</style>
