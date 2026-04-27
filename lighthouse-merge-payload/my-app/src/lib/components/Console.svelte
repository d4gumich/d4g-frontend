<script>
    import { onMount } from 'svelte';
    import { lighthouseStatus, lighthouseResults } from '../lighthouseStore.js';
    import { fade, slide } from 'svelte/transition';

    let logs = $state([]);
    let isOpen = $state(false);
    let consoleElement = $state();

    // Auto-scroll to bottom when logs change or console opens
    $effect(() => {
        if (isOpen && logs.length > 0 && consoleElement) {
            consoleElement.scrollTop = 0; // Recent logs at top, but let's scroll body if needed
        }
    });

    // Monitor status errors
    $effect(() => {
        if ($lighthouseStatus.error) {
            addLog('ERROR', 'System', $lighthouseStatus.error);
        }
    });

    // Monitor result errors
    $effect(() => {
        if ($lighthouseResults.error) {
            addLog('ERROR', 'Analysis', $lighthouseResults.error);
        }
    });

    function addLog(type, source, message) {
        const timestamp = new Date().toLocaleTimeString();
        // Avoid duplicate consecutive identical logs
        if (logs.length > 0 && logs[0].message === message) return;
        
        logs = [{ timestamp, type, source, message }, ...logs].slice(0, 50);
        if (type === 'ERROR') isOpen = true;
    }

    function clearLogs(e) {
        e.stopPropagation();
        logs = [];
    }

    function toggleConsole() {
        isOpen = !isOpen;
    }
</script>

<div class="console-wrapper" class:open={isOpen}>
    <div 
        class="console-header" 
        onclick={toggleConsole} 
        onkeydown={(e) => e.key === 'Enter' && toggleConsole()} 
        role="button" 
        tabindex="0"
    >
        <div class="header-left">
            <span class="icon"> {isOpen ? '▼' : '▲'} </span>
            <span class="title">System Console</span>
            {#if logs.filter(l => l.type === 'ERROR').length > 0}
                <span class="error-count">{logs.filter(l => l.type === 'ERROR').length}</span>
            {/if}
        </div>
        <div class="header-right">
            <button class="clear-btn" onclick={clearLogs}>Clear</button>
        </div>
    </div>

    {#if isOpen}
        <div class="console-body" transition:slide={{ axis: 'y' }} bind:this={consoleElement}>
            {#if logs.length === 0}
                <div class="empty-msg">No system logs...</div>
            {:else}
                {#each logs as log}
                    <div class="log-entry" class:error={log.type === 'ERROR'}>
                        <span class="timestamp">[{log.timestamp}]</span>
                        <span class="source">[{log.source}]</span>
                        <span class="type">{log.type}:</span>
                        <span class="message">{log.message}</span>
                    </div>
                {/each}
            {/if}
        </div>
    {/if}
</div>

<style>
    .console-wrapper {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #1e1e1e;
        color: #d4d4d4;
        font-family: 'Courier New', Courier, monospace;
        z-index: 1000;
        border-top: 1px solid #333;
        transition: transform 0.3s ease;
    }

    .console-header {
        width: 100%;
        background: #252526;
        border: none;
        color: #fff;
        padding: 0.5rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-sizing: border-box;
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        flex-shrink: 1;
        min-width: 0;
        overflow: hidden;
    }

    .title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .header-right {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        margin-left: 1rem;
    }

    .error-count {
        background: #f44336;
        color: white;
        padding: 0 6px;
        border-radius: 10px;
        font-size: 0.7rem;
        font-weight: bold;
        flex-shrink: 0;
    }

    .clear-btn {
        background: #333;
        border: 1px solid #444;
        color: #aaa;
        padding: 4px 12px;
        font-size: 0.7rem;
        border-radius: 3px;
        cursor: pointer;
        transition: all 0.2s;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .clear-btn:hover {
        color: #fff;
        background: #444;
        border-color: #666;
    }

    .console-body {
        height: 200px;
        overflow-y: auto;
        padding: 0.5rem;
        font-size: 0.85rem;
        background: #1e1e1e;
    }

    .log-entry {
        margin-bottom: 0.3rem;
        line-height: 1.4;
        border-bottom: 1px solid #2a2a2a;
        padding-bottom: 0.2rem;
        word-break: break-all;
    }

    .log-entry.error {
        color: #f48771;
    }

    .timestamp { color: #888; margin-right: 0.5rem; }
    .source { color: #569cd6; margin-right: 0.5rem; }
    .type { font-weight: bold; margin-right: 0.5rem; }

    .empty-msg {
        color: #555;
        text-align: center;
        margin-top: 40px;
        font-style: italic;
    }

    /* Scrollbar styling */
    .console-body::-webkit-scrollbar {
        width: 10px;
    }
    .console-body::-webkit-scrollbar-track {
        background: #1e1e1e;
    }
    .console-body::-webkit-scrollbar-thumb {
        background: #333;
    }
    .console-body::-webkit-scrollbar-thumb:hover {
        background: #444;
    }
</style>
