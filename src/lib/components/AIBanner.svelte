<script>
    import { aiStatus, aiActions, HOST_URL } from '$lib/aiSetupStore.js';
    import AISetup from './AISetup.svelte';
    import Cog from 'svelte-material-icons/Cog.svelte';
    import AccountKey from 'svelte-material-icons/AccountKey.svelte';
    import ShieldCheck from 'svelte-material-icons/ShieldCheck.svelte';
    import Alert from 'svelte-material-icons/Alert.svelte';
    import { browser } from '$app/environment';

    let showSetup = $state(false);

    function toggleKeyType() {
        if ($aiStatus.status === 'active') {
            aiActions.setForceTeamKey(!$aiStatus.forceTeamKey);
        } else if ($aiStatus.forceTeamKey) {
            aiActions.setForceTeamKey(false);
        }
    }
</script>

<div 
    class="ai-status-banner" 
    class:byok={$aiStatus.status === 'active' && !$aiStatus.forceTeamKey}
    class:has-error={$aiStatus.hasError}
>
    <div class="banner-container">
        <div class="status-left">
            <button class="mode-toggle" onclick={toggleKeyType} title="Click to toggle between Team and Personal key">
                {#if $aiStatus.status === 'active' && !$aiStatus.forceTeamKey}
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
            </button>
            
            {#if $aiStatus.status === 'active' && !$aiStatus.forceTeamKey}
                <div class="active-info">
                    <strong>{$aiStatus.model}</strong>
                </div>
            {/if}
        </div>

        <div class="controls-center">
            {#if $aiStatus.hasError}
                <button class="error-pill" onclick={() => aiActions.setError(false)} title="Click to clear error">
                    <Alert size={16} />
                    <span>{$aiStatus.errorMessage || 'Engine Error'}</span>
                </button>
            {/if}
        </div>

        <div class="actions-right">
            <button class="setup-trigger" onclick={() => showSetup = true}>
                <Cog size={18} />
                <span>{$aiStatus.status === 'active' ? 'Manage Keys' : 'Connect Key'}</span>
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
        background: #b0c4de; /* Darker grey-blue for team */
        border-bottom: 2px solid #778899;
        padding: 0.4rem 0;
        font-family: "Outfit", sans-serif;
        font-size: 0.85rem;
        z-index: 800;
        position: relative;
        transition: all 0.3s ease;
    }

    .ai-status-banner.byok {
        background: #93c47d; /* Darker green for personal */
        border-bottom: 2px solid #6aa84f;
    }

    .ai-status-banner.has-error {
        background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 15px,
            rgba(211, 47, 47, 0.2) 15px,
            rgba(211, 47, 47, 0.2) 30px
        );
        border-bottom: 2px solid #d32f2f;
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
        gap: 1.5rem;
        min-width: 140px;
    }

    .active-info {
        font-size: 0.8rem;
        color: #1b3350;
        font-weight: 600;
    }

    .mode-toggle {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        transition: transform 0.1s;
    }

    .mode-toggle:hover {
        transform: scale(1.05);
    }

    .badge {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.25rem 0.75rem;
        border-radius: 2rem;
        font-weight: 800;
        text-transform: uppercase;
        font-size: 0.65rem;
        letter-spacing: 0.05em;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
        justify-content: center;
        flex: 1;
    }

    .error-pill {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        background: #d32f2f;
        color: white;
        padding: 0.2rem 0.6rem;
        border-radius: 4px;
        font-weight: 700;
        font-size: 0.75rem;
        animation: pulse 2s infinite;
        border: none;
        cursor: pointer;
    }

    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.8; }
        100% { opacity: 1; }
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
    }
</style>
