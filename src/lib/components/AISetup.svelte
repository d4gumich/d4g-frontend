<script>
    import { onMount } from 'svelte';
    import { base } from '$app/paths';
    import Button from './button.svelte';
    import { aiStatus, aiActions, HOST_URL } from '$lib/aiSetupStore.js';
    import { csrfHeaders, rememberCsrf } from '$lib/byokSession.js';
    import {
        messageForStatus,
        referenceFromBody,
        supportReference,
        userFacingError,
        withReference,
    } from '$lib/userError.js';

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

    const keyGuides = {
        google: {
            title: "Get a Gemini key",
            href: "https://aistudio.google.com/apikey",
            link: "Open Google AI Studio",
            steps: [
                "Sign in at Google AI Studio.",
                "Accept the Gemini API terms if this is your first key.",
                "Press Create API key. New keys are auth keys.",
                "Copy the key, paste it below, then press Verify and Save.",
            ],
        },
        openai: {
            title: "Get an OpenAI key",
            href: "https://platform.openai.com/api-keys",
            link: "Open OpenAI API keys",
            steps: [
                "Sign in at the OpenAI platform.",
                "Open API keys and press Create new secret key.",
                "Copy the key immediately. OpenAI shows it once.",
                "Paste it below, then press Verify and Save.",
            ],
        },
        anthropic: {
            title: "Get an Anthropic key",
            href: "https://platform.claude.com/settings/keys",
            link: "Open the Claude Console",
            steps: [
                "Sign in at the Claude Console.",
                "Open Settings, then API keys.",
                "Press Create key and copy it. The console shows it once.",
                "Paste it below, then press Verify and Save.",
            ],
        },
    };

    let guide = $derived(keyGuides[provider] || keyGuides.google);
    const idleWindowMs = 30 * 60 * 1000;
    const absoluteWindowMs = 12 * 60 * 60 * 1000;
    let openedAt = $state(Date.now());

    function formatWhen(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        return new Intl.DateTimeFormat(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short",
        }).format(date);
    }

    let savedSession = $derived($aiStatus.status === "active" && $aiStatus.expires_at && $aiStatus.absolute_expires_at);
    let idleExpiry = $derived(savedSession ? $aiStatus.expires_at : openedAt + idleWindowMs);
    let hardExpiry = $derived(savedSession ? $aiStatus.absolute_expires_at : openedAt + absoluteWindowMs);
    let idleText = $derived(formatWhen(idleExpiry));
    let hardText = $derived(formatWhen(hardExpiry));
    let expiryLead = $derived(
        savedSession
            ? `This session expires at ${idleText} if left idle, and at ${hardText} even if you keep using it.`
            : `If you save now, this session expires at ${idleText} if left idle, and at ${hardText} even if you keep using it.`,
    );

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

    async function postWithCsrf(url, body) {
        await aiActions.prepareCsrf();
        const send = () => fetch(url, {
            method: "POST",
            headers: csrfHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify(body),
            credentials: "include",
        });
        let response = await send();
        if (response.status !== 403) return response;
        const data = await response.clone().json().catch(() => ({}));
        if (!String(data.detail || "").toLowerCase().includes("csrf")) return response;
        await aiActions.prepareCsrf();
        return send();
    }

    async function readJson(response) {
        try {
            return await response.json();
        } catch {
            return null;
        }
    }

    function failureError(response, data) {
        const detail = typeof data?.detail === "string" ? data.detail : data?.message;
        const reference = supportReference(response) || referenceFromBody(data?.request_id);
        return new Error(withReference(messageForStatus(response.status, detail), reference));
    }

    async function handleVerify() {
        if (!apiKey.trim()) {
            error = "Please provide your API key to verify.";
            return;
        }

        verifying = true;
        error = "";

        try {
            const response = await postWithCsrf(`${HOST_URL}api/v1/auth/models`, {
                provider: provider,
                api_key: apiKey
            });

            const data = await readJson(response);
            if (!response.ok || !data) throw failureError(response, data);

            dynamicModels = data.models || [];
            isVerified = true;

            // Auto-select first model if none selected
            if (dynamicModels.length > 0 && !model) {
                model = dynamicModels[0].id;
            }
        } catch (err) {
            error = userFacingError(err);
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

            const response = await postWithCsrf(`${HOST_URL}api/v1/auth/session`, body);

            const data = await readJson(response);
            if (!response.ok || !data) throw failureError(response, data);
            rememberCsrf("session", data.csrf_token);
            apiKey = "";

            // Update store
            await aiActions.fetchStatus();
            onComplete();
        } catch (err) {
            error = userFacingError(err);
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

        <div class="key-guide">
            <p class="key-guide-title">{guide.title}</p>
            <ol>
                {#each guide.steps as step, index}
                    <li><span>{index + 1}</span>{step}</li>
                {/each}
            </ol>
            <a href={guide.href} target="_blank" rel="noopener noreferrer">{guide.link}</a>
            {#if productName === "Lighthouse"}
                <p class="key-note">Lighthouse analysis uses a Gemini key. OpenAI and Anthropic keys work on the other products.</p>
            {/if}
            <p class="key-expiry">{expiryLead} Paste the key again after that. If the provider rejects it, repeat the steps above and paste a new key.</p>
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
                <strong>Key expires</strong> at {idleText} if left idle, and at {hardText} at the latest. Paste it again, or repeat the steps above if you need a new one.
            </div>
            <p class="privacy-link"><a href={`${base}/privacy`}>How keys and resumes are handled</a></p>
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
        max-height: 90vh;
        overflow: auto;
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

    .key-guide {
        margin: -0.25rem 0 1.25rem;
        padding: 0.85rem 0.95rem;
        border-radius: 0.6rem;
        background: #f4f7fb;
        color: #1b3350;
    }

    .key-guide-title {
        margin: 0 0 0.5rem;
        font-weight: 700;
    }

    .key-guide ol {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 0.45rem;
    }

    .key-guide li {
        display: flex;
        gap: 0.55rem;
        align-items: flex-start;
        font-size: 0.88rem;
        line-height: 1.4;
    }

    .key-guide li span {
        flex: 0 0 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 999px;
        background: #1b3350;
        color: #fff;
        font-size: 0.72rem;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .key-guide a {
        display: inline-block;
        margin-top: 0.7rem;
        font-weight: 700;
        color: #1a4a86;
    }

    .key-note {
        margin: 0.55rem 0 0;
        font-size: 0.82rem;
        line-height: 1.4;
    }

    .key-expiry {
        margin: 0.75rem 0 0;
        padding: 0.55rem 0.65rem;
        border-radius: 0.45rem;
        background: #fff4e5;
        color: #6a3d09;
        font-size: 0.82rem;
        font-weight: 600;
        line-height: 1.4;
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

    select {
        appearance: none;
        padding-right: 2.4rem;
        background-color: #fff;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%231b3350' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' d='M3.5 6.2 8 10.2l4.5-4'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.85rem center;
        background-size: 0.9rem;
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

    .privacy-link {
        margin: 0.45rem 0 0;
        font-size: 0.8rem;
    }

    .privacy-link a {
        color: var(--blue-color-main);
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
