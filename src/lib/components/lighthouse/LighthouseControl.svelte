<script>
    import { onMount, onDestroy } from 'svelte';
    import { lighthouseStatus, lighthouseActions } from '$lib/lighthouseStore.js';

    let interval;

    onMount(() => {
        lighthouseActions.fetchStatus(true);
    });

    onDestroy(() => {
        // No interval to clear
    });

    let isRunning = $derived($lighthouseStatus.stage === 'RUNNING');
    let isLoading = $derived($lighthouseStatus.stage.includes('BUILDING') || $lighthouseStatus.stage.includes('STARTING') || $lighthouseStatus.loading);
</script>

<div class="card">
    <div class="control-header">
        <div class="title-group">
            <h3>Lighthouse Engine</h3>
            <p class="status-text">Status: <span class="badge {getStatusClass($lighthouseStatus.stage)}">{$lighthouseStatus.stage}</span></p>
        </div>
    </div>
    
    <div class="status-details">
        <p>
            <strong>Hardware:</strong> 
            {#if $lighthouseStatus.requestedHardware}
                <span class="requesting-text">Requesting {$lighthouseStatus.requestedHardware}</span>
            {:else}
                {$lighthouseStatus.hardware}
            {/if}
        </p>
        
        {#if isLoading}
            <div class="boot-container">
                <div class="progress-track">
                    <div class="progress-fill"></div>
                </div>
                <p class="estimate">⏱ Est: 3-5 mins to boot</p>
            </div>
        {/if}

        {#if $lighthouseStatus.message && !isLoading}
            <p class="message">{$lighthouseStatus.message}</p>
        {/if}
    </div>

    <div class="control-actions">
        <!-- Main Toggle Button -->
        {#if isRunning}
            <button 
                class="btn-main btn-pause" 
                onclick={lighthouseActions.pause}
                disabled={isLoading}
            >
                Pause Engine
            </button>
        {:else}
            <button 
                class="btn-main btn-start" 
                onclick={lighthouseActions.wakeup}
                disabled={isLoading}
            >
                {isLoading ? 'Booting...' : 'Start Engine'}
            </button>
        {/if}

        <!-- Secondary Utility Buttons -->
        <div class="secondary-actions">
            <button 
                class="btn-sub" 
                onclick={lighthouseActions.wakeup}
                disabled={isLoading}
                title="Force Restart"
            >
                Restart
            </button>
            <button 
                class="btn-sub btn-danger-text" 
                onclick={lighthouseActions.stop}
                disabled={isLoading || $lighthouseStatus.stage === 'OFFLINE'}
                title="Release GPU and Stop"
            >
                Shutdown
            </button>
        </div>
    </div>
</div>

<style>
    .title-group h3 { margin: 0; font-size: 1.1rem; }
    .status-text { margin: 0.2rem 0 0 0; font-size: 0.8rem; color: #666; }
    
    .badge {
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
    }

    .status-details {
        font-size: 0.85rem;
        margin: 1rem 0;
        min-height: 60px;
    }

    .boot-container { margin-top: 0.5rem; }
    
    .progress-track {
        width: 100%;
        height: 6px;
        background: #eee;
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 0.4rem;
    }

    .progress-fill {
        width: 40%;
        height: 100%;
        background: var(--blue-color-main);
        animation: progress-slide 2s infinite ease-in-out;
    }

    @keyframes progress-slide {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(250%); }
    }

    .control-actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .btn-main {
        width: 100%;
        padding: 0.8rem;
        border: none;
        border-radius: 8px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-start {
        background-color: var(--blue-color-main);
        color: white;
    }

    .btn-pause {
        background-color: var(--button-color);
        color: var(--text-color-main);
    }

    .btn-main:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .btn-main:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        transform: none;
    }

    .secondary-actions {
        display: flex;
        justify-content: space-between;
        padding: 0 0.5rem;
    }

    .btn-sub {
        background: none;
        border: none;
        font-size: 0.75rem;
        font-weight: 600;
        color: #888;
        cursor: pointer;
        text-decoration: underline;
        padding: 4px;
    }

    .btn-sub:hover:not(:disabled) {
        color: var(--text-color-main);
    }

    .btn-danger-text { color: #d32f2f; }
    .btn-danger-text:hover:not(:disabled) { color: #ff0000; }

    .requesting-text {
        color: #e65100;
        font-weight: 700;
        animation: pulse 2s infinite;
    }

    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }

    .estimate { font-size: 0.75rem; color: #666; font-style: italic; margin: 0; }
    .message { color: #666; font-style: italic; font-size: 0.8rem; margin: 0; }

    .status-active { background-color: #e8f5e9; color: #2e7d32; }
    .status-inactive { background-color: #f5f5f5; color: #757575; }
    .status-loading { background-color: #fff3e0; color: #e65100; }
</style>
