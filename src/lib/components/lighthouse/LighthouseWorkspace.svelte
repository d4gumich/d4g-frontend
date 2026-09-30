<script>
  import { fade } from "svelte/transition";
  import LighthouseResults from "$lib/components/lighthouse/lighthouse_results.svelte";
  import {
    analysisSourceLabel,
    lighthouseActions,
    lighthouseResults,
  } from "$lib/lighthouseStore.js";

  let { source = "team" } = $props();

  let file = $state(null);
  let fileInput = $state(null);
  let shouldSanitize = $state(false);
  let uploadError = $state("");

  function handleFileChange(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    file = selected;
    setTimeout(() => {
      if (fileInput) fileInput.value = "";
    }, 50);
  }

  async function handleUpload() {
    if (!file) return;
    uploadError = "";
    try {
      if (source === "personal") {
        await lighthouseActions.uploadStandardPdf(file, shouldSanitize);
      } else {
        await lighthouseActions.uploadPdf(file, shouldSanitize);
      }
      file = null;
    } catch (error) {
      uploadError = error?.message || "Upload failed.";
    }
  }
</script>

<div class="lighthouse-body">
  <main class="lighthouse-container">
    <div class="dashboard-grid">
      <aside class="sidebar">
        <div class="card upload-card">
          <h3>Upload Document</h3>
          <p>
            {source === "personal"
              ? "Analysis uses your Gemini key. Job search stays on the shared career index."
              : "Analysis uses the team model for this Deep session."}
          </p>

          <div class="file-options">
            <label class="checkbox-container">
              <input type="checkbox" bind:checked={shouldSanitize} />
              Sanitize PDF (Remove PII)
            </label>
          </div>

          <div class="file-input-group">
            <input
              bind:this={fileInput}
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
          {#if uploadError}
            <p class="upload-error">{uploadError}</p>
          {/if}
        </div>

        {#if $lighthouseResults.history.length > 0}
          <div class="card history-card" in:fade>
            <h3>Recent Documents</h3>
            <div class="history-list">
              {#each $lighthouseResults.history as doc (doc.id)}
                <div
                  class="history-item"
                  class:active={doc.id === $lighthouseResults.currentId}
                >
                  <button
                    class="select-doc"
                    onclick={() => lighthouseActions.selectDocument(doc.id)}
                  >
                    <span class="doc-name">{doc.name}</span>
                    <span class="doc-meta">
                      {new Date(doc.timestamp).toLocaleDateString()}
                      <span
                        class="source"
                        class:personal={doc.provider === "personal" ||
                          doc.provider === "byok"}
                      >
                        {analysisSourceLabel(doc.provider)}
                      </span>
                    </span>
                  </button>
                  <button
                    class="delete-doc"
                    onclick={() => lighthouseActions.deleteDocument(doc.id)}
                    title="Delete"
                  >
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
</div>

<style>
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
  }

  .upload-card h3,
  .history-card h3 {
    margin-top: 0;
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .upload-card p {
    margin-top: 0;
    color: #444;
  }

  .file-options {
    margin-bottom: 1rem;
    font-size: 0.85rem;
    background: #f8f9fa;
    padding: 0.75rem;
    border-radius: 6px;
  }

  .file-input {
    display: none;
  }

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
  }

  .file-label:hover {
    border-color: var(--blue-color-main);
    background: #f0f4f8;
    color: var(--blue-color-main);
  }

  .checkbox-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .upload-error {
    color: #d32f2f;
    font-size: 0.85rem;
  }

  .w-full {
    width: 100%;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .history-item {
    display: flex;
    align-items: center;
    background: #f9f9f9;
    border-radius: 4px;
    border: 1px solid transparent;
    padding-right: 0.5rem;
  }

  .history-item.active {
    background: #eef2f7;
    border-color: var(--blue-color-main);
  }

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

  .doc-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-color-main);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .doc-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    align-items: center;
    font-size: 0.7rem;
    color: #888;
  }

  .source {
    font-size: 0.65rem;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: #1b3350;
    background: #e7eef6;
    border-radius: 999px;
    padding: 0.1rem 0.45rem;
  }

  .source.personal {
    color: #5c3b16;
    background: #f6ead7;
  }

  .delete-doc {
    padding: 0.5rem;
    background: none;
    border: none;
    color: #ccc;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .delete-doc:hover {
    color: var(--error-color);
  }

  @media (max-width: 1100px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }

    .lighthouse-body .lighthouse-container {
      padding: 0.75rem 1rem 4.5rem;
    }
  }
</style>
