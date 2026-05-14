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

    let hasStartedThisSession = $state(false);

    // Automatically set started state if the engine is already running on load
    $effect(() => {
        if (isRunning) {
            hasStartedThisSession = true;
        }
    });

    async function handleStart() {
        hasStartedThisSession = true;
        await lighthouseActions.wakeup();
    }

    async function handleTerminate() {
        await lighthouseActions.stop();
        hasStartedThisSession = false;
    }

    function getStatusClass(stage) {
        const s = stage?.toUpperCase() || '';
        if (s === 'RUNNING') return 'status-active';
        if (s === 'STOPPED' || s === 'PAUSED' || s === 'SLEEPING' || s === 'OFFLINE') return 'status-inactive';
        if (s.includes('BUILDING') || s.includes('STARTING') || s.includes('INITIALIZING')) return 'status-loading';
        return 'status-inactive';
    }
</script>

<div class="card">
    <div class="control-header">
        <div class="title-group">
            <h3>Lighthouse Engine</h3>
            <p class="status-text">Status: <span class="badge {getStatusClass($lighthouseStatus.stage)}">{$lighthouseStatus.stage}</span></p>
            {#if $lighthouseStatus.sessionActive && $lighthouseStatus.sessionRemaining !== null}
                <p class="timer-text">
                    🔒 Session ends in: <strong>{Math.floor($lighthouseStatus.sessionRemaining / 60)}:{$lighthouseStatus.sessionRemaining % 60 < 10 ? '0' : ''}{$lighthouseStatus.sessionRemaining % 60}</strong>
                </p>
            {/if}
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
        <!-- Dynamic Action Area -->
        {#if isLoading}
            <button class="btn-main btn-disabled" disabled>
                Booting...
            </button>
        {:else if !hasStartedThisSession}
            <button 
                class="btn-main btn-start" 
                onclick={handleStart}
            >
                Start Engine
            </button>
        {:else if isRunning}
            <div class="split-actions">
                <button 
                    class="btn-main btn-pause" 
                    onclick={lighthouseActions.pause}
                >
                    Pause Engine
                </button>
                <button 
                    class="btn-main btn-danger" 
                    onclick={handleTerminate}
                >
                    Terminate
                </button>
            </div>
        {:else}
            <div class="split-actions">
                <button 
                    class="btn-main btn-start" 
                    onclick={lighthouseActions.wakeup}
                >
                    Restart
                </button>
                <button 
                    class="btn-main btn-danger" 
                    onclick={handleTerminate}
                >
                    Terminate
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    .title-group h3 { margin: 0; font-size: 1.1rem; }
    .status-text { margin: 0.2rem 0 0 0; font-size: 0.8rem; color: #666; }
    
    .timer-text {
        margin: 0.4rem 0 0 0;
        font-size: 0.75rem;
        color: #b71c1c;
        background: #fff3f3;
        padding: 4px 8px;
        border-radius: 4px;
        display: inline-block;
        font-weight: 600;
    }

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

    .split-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
    }

    .btn-main {
        width: 100%;
        padding: 0.6rem;
        border: none;
        border-radius: 8px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 0.8rem;
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

    .btn-main:disabled, .btn-disabled {
        background-color: #ccc;
        cursor: not-allowed;
        transform: none;
        color: #666;
    }

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
