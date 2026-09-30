<script>
  import { onDestroy, onMount } from "svelte";
  import LighthouseResults from "$lib/components/lighthouse/lighthouse_results.svelte";
  import EngineStatus from "$lib/components/lighthouse/EngineStatus.svelte";
  import {
    lighthouseActions,
    lighthouseResults,
  } from "$lib/lighthouseStore.js";
  import {
    fetchEngineStatus,
    fetchSchedule,
    HELD_SEATS_KEY,
    scheduledTesterActive,
    SEAT_TOKEN_KEY,
    TesterKeyRequired,
  } from "$lib/lighthouseSchedule.js";
  import LighthouseSetup from "$lib/components/LighthouseSetup.svelte";

  let schedule = $state(null);
  let engine = $state(null);
  let held = $state(readHeld());
  let file = $state(null);
  let fileInput = $state(null);
  let shouldSanitize = $state(false);
  let uploadError = $state("");
  let showTesterKey = $state(false);

  const focusDate = $derived(schedule?.seat_session || "");
  const phase = $derived(schedule?.phase || "closed");
  const seated = $derived(focusDate !== "" && held.includes(focusDate));
  const canUpload = $derived(
    seated && (phase === "pre_warm" || phase === "open" || phase === "drain"),
  );

  function readHeld() {
    if (typeof sessionStorage === "undefined") return [];
    try {
      const parsed = JSON.parse(sessionStorage.getItem(HELD_SEATS_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function sourceLabel(doc) {
    return doc?.provider === "byok" ? "Your API key" : "In house";
  }

  async function refresh() {
    try {
      schedule = await fetchSchedule();
      engine = await fetchEngineStatus();
      lighthouseActions.rememberEngine(engine);
      held = readHeld();
    } catch {
      /* Keep the last schedule if a refresh fails. */
    }
  }

  function handleFileChange(event) {
    file = event.currentTarget.files?.[0] || null;
  }

  async function handleUpload() {
    if (!file || !canUpload) return;
    uploadError = "";
    try {
      if (!(await scheduledTesterActive())) {
        showTesterKey = true;
        return;
      }
      await lighthouseActions.uploadPdf(file, shouldSanitize);
      file = null;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      if (error instanceof TesterKeyRequired) {
        showTesterKey = true;
        return;
      }
      uploadError = error?.message || "Upload failed.";
    }
  }

  $effect(() => {
    const token =
      typeof sessionStorage === "undefined"
        ? ""
        : sessionStorage.getItem(SEAT_TOKEN_KEY);
    if (canUpload && token) {
      lighthouseActions.useScheduledSeat(token, focusDate);
    } else {
      lighthouseActions.useScheduledSeat(null, null);
    }
  });

  let poll;
  onMount(() => {
    refresh();
    poll = setInterval(refresh, 15000);
  });
  onDestroy(() => {
    clearInterval(poll);
    lighthouseActions.useScheduledSeat(null, null);
  });
</script>

<section class="workspace" aria-label="Lighthouse seat workspace">
  <EngineStatus {engine} />
  <div class="dashboard-grid">
    <aside class="sidebar">
      <div class="card upload-card">
        <h3>Upload Document</h3>
        <p>Analyze your PDF resume</p>
        {#if !canUpload}
          <p class="gate">
            Take a seat while a session is starting or live. Reading the PDF
            does not wait for the engine.
          </p>
        {/if}
        <div class="file-options">
          <label class="checkbox-container">
            <input type="checkbox" bind:checked={shouldSanitize} />
            Sanitize PDF (Remove PII)
          </label>
        </div>
        <div class="file-input-group">
          <input
            bind:this={fileInput}
            id="pdf-upload"
            class="file-input"
            type="file"
            accept="application/pdf"
            onchange={handleFileChange}
          />
          <label for="pdf-upload" class="file-label">
            {file ? file.name : "Choose PDF..."}
          </label>
        </div>
        <button
          class="btn-primary w-full"
          class:btn-loading={$lighthouseResults.loading}
          type="button"
          onclick={handleUpload}
          disabled={!canUpload || !file || $lighthouseResults.loading}
        >
          {$lighthouseResults.loading ? "UPLOADING..." : "UPLOAD & PARTITION"}
        </button>
        {#if uploadError}
          <p class="upload-error">{uploadError}</p>
        {/if}
      </div>

      {#if $lighthouseResults.history.length > 0}
        <div class="card history-card">
          <h3>Recent Documents</h3>
          <div class="history-list">
            {#each $lighthouseResults.history as doc (doc.id)}
              <div
                class="history-item"
                class:active={doc.id === $lighthouseResults.currentId}
              >
                <button
                  class="select-doc"
                  type="button"
                  onclick={() => lighthouseActions.selectDocument(doc.id)}
                >
                  <span class="doc-name">{doc.name}</span>
                  <span class="doc-meta">
                    {new Date(doc.timestamp).toLocaleDateString()}
                    · {sourceLabel(doc)}
                  </span>
                </button>
                <button
                  class="delete-doc"
                  type="button"
                  aria-label="Remove {doc.name}"
                  onclick={() => lighthouseActions.deleteDocument(doc.id)}
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
</section>

{#if showTesterKey}
  <LighthouseSetup
    onComplete={() => {
      showTesterKey = false;
      handleUpload();
    }}
    onCancel={() => (showTesterKey = false)}
  />
{/if}

<style>
  .workspace {
    max-width: 1400px;
    margin: 0 auto 2rem;
    padding: 0 2rem;
  }
  .dashboard-grid {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 2rem;
    margin-top: 1rem;
  }
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .upload-card h3,
  .history-card h3 {
    margin-top: 0;
    margin-bottom: 0.35rem;
    font-size: 1rem;
  }
  .upload-card p {
    margin: 0 0 1rem;
    color: #333;
  }
  .gate,
  .upload-error {
    font-size: 0.85rem;
  }
  .upload-error {
    color: #8a2a2a;
  }
  .file-options {
    margin-bottom: 1rem;
    font-size: 0.85rem;
    background: #f8f9fa;
    padding: 0.75rem;
    border-radius: 6px;
  }
  .checkbox-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
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
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .w-full {
    width: 100%;
  }
  .btn-loading {
    background-color: #778899 !important;
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
    border-color: #1a4a86;
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
  }
  .doc-name {
    font-size: 0.85rem;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .doc-meta {
    font-size: 0.7rem;
    color: #888;
  }
  .delete-doc {
    padding: 0.5rem;
    background: none;
    border: none;
    color: #ccc;
    cursor: pointer;
  }
  @media (max-width: 1100px) {
    .workspace {
      padding: 0 1rem;
    }
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
