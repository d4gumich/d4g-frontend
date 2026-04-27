<script>
    import LighthouseResults from "$lib/components/lighthouse_results.svelte";
    import LighthouseControl from "$lib/components/LighthouseControl.svelte";
    import Console from "$lib/components/Console.svelte";
    import { lighthouseResults, lighthouseActions, lighthouseSettings } from "$lib/lighthouseStore.js";
    import logo from "$lib/assets/D4G-Logo-2.png";
    import { fade } from 'svelte/transition';

    let file = $state(null);
    let shouldSanitize = $state(false);

    function handleFileChange(event) {
        file = event.target.files[0];
    }

    async function handleUpload() {
        if (!file) {
            alert("Please select a PDF file first.");
            return;
        }
        try {
            await lighthouseActions.uploadPdf(file, shouldSanitize);
            file = null; // Reset file input
        } catch (err) {
            alert("Upload failed. Ensure the Lighthouse engine is RUNNING.");
        }
    }
</script>

<nav class="navbar">
    <div class="nav-content">
        <div class="brand">
            <img src={logo} alt="Data4Good Logo" class="logo" />
            <div class="nav-titles">
                <h1>Lighthouse</h1>
                <p>AI Profile Analysis</p>
            </div>
        </div>
    </div>
</nav>

<main class="container">
    <div class="dashboard-grid">
        <aside class="sidebar">
            <LighthouseControl />
            
            <div class="card upload-card">
                <h3>Upload Document</h3>
                <p>Analyze your PDF resume</p>
                
                <div class="file-options">
                    <label class="checkbox-container">
                        <input type="checkbox" bind:checked={shouldSanitize} />
                        <span class="checkmark"></span>
                        Sanitize PDF (Remove PII)
                    </label>
                </div>

                <div class="file-input-group">
                    <input 
                        type="file" 
                        id="pdf-upload"
                        accept="application/pdf" 
                        onchange={handleFileChange} 
                        class="file-input"
                    />
                    <label for="pdf-upload" class="file-label">
                        {file ? file.name : "Choose PDF..."}
                    </label>
                </div>
                <button 
                    class="btn-primary w-full" 
                    class:btn-loading={$lighthouseResults.loading}
                    onclick={handleUpload}
                    disabled={!file || $lighthouseResults.loading}
                >
                    {$lighthouseResults.loading ? "UPLOADING..." : "UPLOAD & PARTITION"}
                </button>
            </div>

            {#if $lighthouseResults.history.length > 0}
                <div class="card history-card" in:fade>
                    <h3>Recent Documents</h3>
                    <div class="history-list">
                        {#each $lighthouseResults.history as doc}
                            <div class="history-item" class:active={doc.id === $lighthouseResults.currentId}>
                                <button class="select-doc" onclick={() => lighthouseActions.selectDocument(doc.id)}>
                                    <span class="doc-name">{doc.name}</span>
                                    <span class="doc-meta">{new Date(doc.timestamp).toLocaleDateString()}</span>
                                </button>
                                <button class="delete-doc" onclick={() => lighthouseActions.deleteDocument(doc.id)} title="Delete">
                                    ✕
                                </button>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </aside>

        <section class="main-content">
            <LighthouseResults />
        </section>
    </div>
</main>

<Console />

<style>
    .navbar {
        background-color: white;
        border-bottom: 1px solid var(--border-color);
        padding: 0.75rem 0;
        margin-bottom: 2rem;
        position: sticky;
        top: 0;
        z-index: 100;
    }

    .nav-content {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .brand { display: flex; align-items: center; gap: 1.5rem; }

    .logo { height: 40px; width: auto; }

    .nav-titles h1 { margin: 0; font-size: 1.25rem; line-height: 1; }
    .nav-titles p { margin: 0.1rem 0 0 0; font-size: 0.8rem; color: #666; }

    .dashboard-grid {
        display: grid;
        grid-template-columns: 320px 1fr;
        gap: 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    .sidebar {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        position: sticky;
        top: 80px;
        height: calc(100vh - 120px);
        overflow-y: auto;
        padding-right: 0.5rem;
    }

    /* Hide sidebar scrollbar */
    .sidebar::-webkit-scrollbar { width: 4px; }
    .sidebar::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

    .upload-card h3, .history-card h3 { margin-top: 0; font-size: 1rem; margin-bottom: 1rem; }
    
    .file-options { 
        margin-bottom: 1rem; 
        font-size: 0.85rem; 
        background: #f8f9fa;
        padding: 0.75rem;
        border-radius: 6px;
    }

    .file-input { display: none; }

    .file-label {
        display: block;
        padding: 0.8rem;
        border: 2px dashed #ccc;
        background: #fafafa;
        border-radius: 6px;
        text-align: center;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 600;
        color: #666;
        margin-bottom: 1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: all 0.2s;
    }

    .file-label:hover {
        border-color: var(--blue-color-main);
        background: #f0f4f8;
        color: var(--blue-color-main);
    }

    .history-list { display: flex; flex-direction: column; gap: 0.5rem; }

    .history-item {
        display: flex;
        align-items: center;
        background: #f9f9f9;
        border-radius: 4px;
        border: 1px solid transparent;
        transition: all 0.2s;
    }

    .history-item:hover { background: #f0f0f0; border-color: #ddd; }
    .history-item.active { background: #eef2f7; border-color: var(--blue-color-main); }

    .select-doc {
        flex: 1;
        background: none;
        border: none;
        text-align: left;
        padding: 0.6rem;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        text-transform: none;
    }

    .doc-name { font-size: 0.85rem; font-weight: 600; color: var(--text-color-main); overflow: hidden; text-overflow: ellipsis; }
    .doc-meta { font-size: 0.7rem; color: #888; }

    .delete-doc {
        padding: 0.5rem;
        background: none;
        border: none;
        color: #ccc;
        font-size: 0.8rem;
        cursor: pointer;
    }

    .delete-doc:hover { color: var(--error-color); }

    .btn-loading {
        background-color: #778899 !important;
        color: white !important;
    }

    .checkbox-container { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
    .label-text { white-space: nowrap; }

    @media (max-width: 1100px) {
        .dashboard-grid { grid-template-columns: 1fr; }
        .sidebar { height: auto; position: static; }
    }
</style>
