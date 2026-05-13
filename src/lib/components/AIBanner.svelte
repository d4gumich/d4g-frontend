<script>
    import { aiStatus, aiActions, HOST_URL } from '$lib/aiSetupStore.js';
    import AISetup from './AISetup.svelte';
    import Cog from 'svelte-material-icons/Cog.svelte';
    import AccountKey from 'svelte-material-icons/AccountKey.svelte';
    import ShieldCheck from 'svelte-material-icons/ShieldCheck.svelte';
    import { browser } from '$app/environment';

    let showSetup = $state(false);

    const models = {
        google: [
            { id: "gemini-2.0-flash-preview", name: "Gemini 2.0 Flash" },
            { id: "gemini-2.0-pro-preview", name: "Gemini 2.0 Pro" },
            { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
            { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" }
        ],
        openai: [
            { id: "gpt-4o", name: "GPT-4o" },
            { id: "gpt-4o-mini", name: "GPT-4o Mini" },
            { id: "o1-mini", name: "o1-mini" }
        ],
        anthropic: [
            { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet" },
            { id: "claude-3-5-haiku-latest", name: "Claude 3.5 Haiku" },
            { id: "claude-3-opus-latest", name: "Claude 3 Opus" }
        ]
    };

    let selectedProvider = $state($aiStatus.provider || "google");
    let selectedModel = $state($aiStatus.model || "gemini-1.5-flash");

    $effect(() => {
        if ($aiStatus.provider) selectedProvider = $aiStatus.provider;
        if ($aiStatus.model) selectedModel = $aiStatus.model;
    });

    async function handleQuickUpdate() {
        // If they just change the provider/model while session is active, we update it
        if ($aiStatus.status === 'active') {
            try {
                const response = await fetch(`${HOST_URL}api/v1/auth/session`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        provider: selectedProvider,
                        model: selectedModel
                    }),
                    credentials: 'include'
                });
                if (response.ok) {
                    await aiActions.fetchStatus();
                }
            } catch (err) {
                console.error("Failed to update AI settings:", err);
            }
        } else {
            // If inactive, opening setup is required to provide key
            showSetup = true;
        }
    }

    function onProviderChange() {
        selectedModel = models[selectedProvider][0].id;
        handleQuickUpdate();
    }
</script>

<div class="ai-status-banner" class:byok={$aiStatus.status === 'active'}>
    <div class="banner-container">
        <div class="status-left">
            {#if $aiStatus.status === 'active'}
                <div class="badge byok-badge">
                    <AccountKey size={16} />
                    <span>Personal Key</span>
                </div>
            {:else}
                <div class="badge team-badge">
                    <ShieldCheck size={16} />
                    <span>Team Key</span>
                </div>
            {/if}
        </div>

        <div class="controls-center">
            <div class="control-item">
                <label for="banner-provider">Provider:</label>
                <select id="banner-provider" bind:value={selectedProvider} onchange={onProviderChange}>
                    <option value="google">Gemini</option>
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Claude</option>
                </select>
            </div>

            <div class="control-item">
                <label for="banner-model">Model:</label>
                <select id="banner-model" bind:value={selectedModel} onchange={handleQuickUpdate}>
                    {#each models[selectedProvider] as m}
                        <option value={m.id}>{m.name}</option>
                    {/each}
                </select>
            </div>
        </div>

        <div class="actions-right">
            <button class="setup-trigger" onclick={() => showSetup = true}>
                <Cog size={18} />
                <span>{$aiStatus.status === 'active' ? 'Update Key' : 'Connect Key'}</span>
            </button>
        </div>
    </div>
</div>

{#if showSetup}
    <AISetup 
        onComplete={() => { showSetup = false; }} 
        onCancel={() => showSetup = false} 
    />
{/if}

<style>
    .ai-status-banner {
        width: 100%;
        background: #f0f4f8;
        border-bottom: 2px solid #d1d9e0;
        padding: 0.4rem 0;
        font-family: "Outfit", sans-serif;
        font-size: 0.85rem;
        z-index: 800;
        position: relative;
    }

    .ai-status-banner.byok {
        background: #c8e6c9;
        border-bottom: 2px solid #81c784;
    }

    .banner-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
        gap: 2rem;
    }

    .status-left {
        display: flex;
        align-items: center;
        min-width: 120px;
    }

    .badge {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.2rem 0.6rem;
        border-radius: 4px;
        font-weight: 800;
        text-transform: uppercase;
        font-size: 0.65rem;
        letter-spacing: 0.05em;
    }

    .byok-badge {
        background: #2e7d32;
        color: white;
    }

    .team-badge {
        background: #1b3350;
        color: white;
    }

    .controls-center {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        flex: 1;
    }

    .control-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .control-item label {
        font-weight: 600;
        color: #666;
        white-space: nowrap;
    }

    select {
        padding: 0.2rem 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: white;
        font-family: inherit;
        font-size: 0.85rem;
        cursor: pointer;
    }

    select:focus {
        outline: none;
        border-color: var(--blue-color-main);
    }

    .actions-right {
        display: flex;
        align-items: center;
    }

    .setup-trigger {
        background: white;
        border: 1px solid #ccc;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        cursor: pointer;
        color: #444;
        transition: all 0.2s;
        font-weight: 600;
        white-space: nowrap;
    }

    .setup-trigger:hover {
        border-color: var(--blue-color-main);
        color: var(--blue-color-main);
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    @media (max-width: 800px) {
        .banner-container {
            flex-direction: column;
            gap: 1rem;
            padding: 0.5rem;
        }
        .controls-center {
            width: 100%;
            justify-content: center;
        }
    }
</style>
