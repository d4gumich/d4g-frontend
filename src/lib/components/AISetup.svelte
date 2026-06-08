<script>
    import { onMount } from 'svelte';
    import Button from './button.svelte';
    import { aiStatus, aiActions, HOST_URL } from '$lib/aiSetupStore.js';

    let { onComplete, onCancel = null, productName = "AI Product" } = $props();

    let provider = $state($aiStatus.provider || "google");
    let model = $state($aiStatus.model || "");
    let apiKey = $state("");

    let loading = $state(false);
    let verifying = $state(false);
    let error = $state("");
    let isVerified = $state($aiStatus.status === 'active');
    let dynamicModels = $state($aiStatus.availableModels || []);

    onMount(async () => {
        if ($aiStatus.status === 'active' && dynamicModels.length === 0) {
            const models = await aiActions.fetchModels(provider);
            dynamicModels = models || [];
        }
    });

    const staticModels = {
        google: [
            { id: "gemini-3.1-flash-preview", name: "Gemini 3.1 Flash" },
            { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro" }
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
        isVerified = false;
        dynamicModels = [];
        model = "";
    }

    async function handleVerify() {
        if (!apiKey.trim()) {
            error = "Please provide your API key to verify.";
            return;
        }

        verifying = true;
        error = "";

        try {
            const response = await fetch(`${HOST_URL}api/v1/auth/models`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    provider: provider,
                    api_key: apiKey
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Failed to verify key.");
            }

            dynamicModels = data.models || [];
            isVerified = true;
            
            // Auto-select first model if none selected
            if (dynamicModels.length > 0 && !model) {
                model = dynamicModels[0].id;
            }
        } catch (err) {
            error = err.message;
            isVerified = false;
        } finally {
            verifying = false;
        }
    }

    async function handleSubmit() {
        if (!isVerified && !apiKey.trim()) {
            error = "Please verify your API key first.";
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
        isVerified = false;
        dynamicModels = [];
        apiKey = "";
        onCancel && onCancel();
    }
</script>

<div class="modal-overlay" onclick={onCancel} onkeydown={(e) => (e.key === 'Escape') && onCancel && onCancel()} role="button" tabindex="0" aria-label="Close modal">
    <div class="modal-content" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="{productName} Setup" tabindex="-1">
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
            <label for="api-key">API Key</label>
            <div class="input-with-button">
                <input 
                    type="password" 
                    id="api-key" 
                    bind:value={apiKey} 
                    oninput={() => { isVerified = false; error = ""; }}
                    placeholder={$aiStatus.status === 'active' ? "Keep current key or enter new one..." : "Paste your API key here..."} 
                />
                <button 
                    class="btn-verify" 
                    onclick={handleVerify} 
                    disabled={verifying || !apiKey.trim()}
                >
                    {verifying ? "..." : "Verify"}
                </button>
            </div>
            {#if isVerified}
                <div class="success-msg">✓ Key Verified</div>
            {/if}
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
                disabled={loading || (!isVerified && $aiStatus.status !== 'active')}
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

    select:disabled {
        background: #f9f9f9;
        cursor: not-allowed;
    }

    .input-with-button {
        display: flex;
        gap: 0.5rem;
    }

    .btn-verify {
        background: var(--button-color);
        color: white;
        border: none;
        padding: 0 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 600;
    }

    .btn-verify:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .success-msg {
        color: #2e7d32;
        font-size: 0.8rem;
        font-weight: 600;
        margin-top: 0.5rem;
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
