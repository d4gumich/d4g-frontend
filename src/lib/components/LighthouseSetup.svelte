<script>
    import { onMount } from 'svelte';
    import { HOST_URL } from '$lib/aiSetupStore.js';
    import Button from './button.svelte';
    import Eye from 'svelte-material-icons/Eye.svelte';
    import EyeOff from 'svelte-material-icons/EyeOff.svelte';

    let { onComplete, onCancel = null } = $props();

    let apiKey = $state("");
    let showKey = $state(false);
    let loading = $state(false);
    let error = $state("");

    async function handleSubmit() {
        if (!apiKey.trim()) {
            error = "Please provide the experimental access key.";
            return;
        }

        loading = true;
        error = "";

        try {
            const response = await fetch(`${HOST_URL}api/v1/auth/lighthouse-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    provider: "hf",
                    model: "lighthouse",
                    api_key: apiKey
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Failed to initialize session.");
            }

            onComplete();
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    }
</script>

<div 
    class="modal-overlay" 
    onclick={onCancel} 
    onkeydown={(e) => (e.key === 'Escape') && onCancel && onCancel()} 
    role="button" 
    tabindex="0" 
    aria-label="Close modal"
>
    <div class="modal-content" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Lighthouse Unlock" tabindex="-1">
        <h2>🔒 Lighthouse Unlock</h2>
        <p>This product is in development. A team security key is required to access the live engine and manage Hugging Face resources.</p>

        <div class="form-group">
            <label for="api-key">Experimental Access Key</label>
            <div class="input-wrapper">
                <input 
                    type={showKey ? "text" : "password"} 
                    id="api-key" 
                    bind:value={apiKey} 
                    placeholder="Enter team access key..." 
                />
                <button class="eye-toggle" onclick={() => showKey = !showKey} type="button" title={showKey ? "Hide key" : "Show key"}>
                    {#if showKey}
                        <EyeOff size={20} />
                    {:else}
                        <Eye size={20} />
                    {/if}
                </button>
            </div>
            <div class="security-warning">
                <strong>BILLING GUARD:</strong> Sessions expire after 59 minutes to prevent accidental Hugging Face overages.
            </div>
        </div>

        {#if error}
            <div class="error-msg">❌ {error}</div>
        {/if}

        <div class="actions">
            {#if onCancel}
                <button class="btn-cancel" onclick={onCancel} disabled={loading}>Cancel</button>
            {/if}
            <Button 
                text={loading ? "Verifying..." : "Unlock"} 
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
        max-width: 450px;
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

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    input {
        width: 100%;
        padding: 0.8rem;
        padding-right: 3rem;
        border: 2px solid #eee;
        border-radius: 0.5rem;
        font-family: inherit;
        font-size: 1rem;
    }

    input:focus {
        outline: none;
        border-color: var(--button-color);
    }

    .eye-toggle {
        position: absolute;
        right: 0.75rem;
        background: none;
        border: none;
        color: #888;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
    }

    .eye-toggle:hover {
        color: var(--blue-color-main);
    }

    .security-warning {
        display: block;
        margin-top: 0.75rem;
        color: #d32f2f;
        font-size: 0.8rem;
        font-weight: 600;
        line-height: 1.4;
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
</style>
