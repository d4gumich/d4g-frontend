<script>
    import { onMount, onDestroy } from 'svelte';
    import { lighthouseStatus, lighthouseActions } from '../lighthouseStore.js';

    let interval;

    onMount(() => {
        lighthouseActions.fetchStatus(true);
    });

    onDestroy(() => {
        // No interval to clear
    });

    function getStatusClass(stage) {
        const s = stage?.toUpperCase() || '';
        if (s === 'RUNNING') return 'status-active';
        if (s === 'STOPPED' || s === 'PAUSED' || s === 'SLEEPING' || s === 'OFFLINE') return 'status-inactive';
        if (s.includes('BUILDING') || s.includes('STARTING') || s.includes('INITIALIZING') || s.includes('RUNNING_WITH_DEVIATIONS')) return 'status-loading';
        return 'status-inactive'; // Default to inactive/gray instead of no color
    }
</script>

<div class="card">
    <div class="control-header">
        <h3>Lighthouse Engine</h3>
        <span class="status-badge {getStatusClass($lighthouseStatus.stage)}">
            {$lighthouseStatus.stage}
        </span>
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
        
        {#if $lighthouseStatus.requestedHardware || $lighthouseStatus.stage === 'BUILDING' || $lighthouseStatus.stage === 'STARTING'}
            <p class="estimate">
                <span class="icon">⏱</span> 
                Rough estimate: 3-5 minutes to boot
            </p>
        {/if}

        {#if $lighthouseStatus.message}
            <p class="message">{$lighthouseStatus.message}</p>
        {/if}
    </div>

    <div class="actions">
        <button 
            class="btn-primary" 
            onclick={lighthouseActions.wakeup}
            disabled={$lighthouseStatus.loading}
        >
            {$lighthouseStatus.loading ? 'Processing...' : ($lighthouseStatus.stage === 'RUNNING' ? 'Restart Engine' : 'Wake Up Space')}
        </button>
        
        <button 
            class="btn-accent" 
            onclick={lighthouseActions.pause}
            disabled={$lighthouseStatus.loading || $lighthouseStatus.stage === 'STOPPED'}
        >
            Pause Space
        </button>
        
        <button 
            class="btn-refresh" 
            onclick={() => lighthouseActions.fetchStatus(true)}
            disabled={$lighthouseStatus.loading || $lighthouseStatus.isRefreshing}
            title="Refresh Status"
        >
            <span class:spinning={$lighthouseStatus.isRefreshing}>↻</span>
        </button>
    </div>
</div>

<style>
    .control-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    h3 { margin: 0; }

    .status-details {
        font-size: 0.9rem;
        margin-bottom: 1.5rem;
    }

    .status-details p { margin: 0.2rem 0; }

    .message { color: #666; font-style: italic; }
    .error { color: var(--error-color); font-weight: 600; }

    .requesting-text {
        color: var(--warning-color);
        font-weight: 600;
        animation: pulse 2s infinite;
    }

    .estimate {
        background: #fff3e0;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        color: #e65100;
        font-size: 0.8rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        margin: 0.5rem 0;
    }

    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.6; }
        100% { opacity: 1; }
    }

    .actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .btn-refresh {
        background: none;
        border: 1px solid var(--border-color);
        color: var(--text-color-main);
        padding: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
    }

    .btn-refresh:hover:not(:disabled) {
        background: #f0f0f0;
    }

    .spinning {
        display: inline-block;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
</style>
