<script>
  import LighthouseResults from "$lib/components/lighthouse/lighthouse_results.svelte";
  import {
    lighthouseActions,
    lighthouseResults,
  } from "$lib/lighthouseStore.js";

  let resumeFile = $state(null);
  let sanitizeResume = $state(false);
  let resumeError = $state("");
  let fileInput = $state(null);

  function sourceLabel(doc) {
    return doc?.provider === "byok" ? "Your API key" : "In house";
  }

  async function processResume(event) {
    event.preventDefault();
    if (!resumeFile) return;
    resumeError = "";
    try {
      await lighthouseActions.uploadPdf(resumeFile, sanitizeResume);
      resumeFile = null;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      resumeError = error?.message || "Upload failed.";
    }
  }
</script>

<section class="past-card" aria-label="Past Lighthouse sessions">
  <div class="past-header">
    <h2>Past sessions</h2>
    <p>Resumes processed in this tab stay here until the tab closes.</p>
  </div>

  <form class="resume-form" onsubmit={processResume}>
    <label>
      Resume
      <input
        bind:this={fileInput}
        type="file"
        accept="application/pdf"
        onchange={(event) => {
          resumeFile = event.currentTarget.files?.[0] || null;
        }}
      />
    </label>
    <label class="sanitize">
      <input type="checkbox" bind:checked={sanitizeResume} />
      Sanitize PDF
    </label>
    <button type="submit" disabled={!resumeFile || $lighthouseResults.loading}>
      {$lighthouseResults.loading ? "Processing…" : "Process resume"}
    </button>
  </form>
  {#if resumeError}
    <p class="empty">{resumeError}</p>
  {/if}
  {#if $lighthouseResults.history.length === 0}
    <p class="empty">No resumes processed in this tab yet.</p>
  {:else}
    <ul class="past-list">
      {#each $lighthouseResults.history as doc (doc.id)}
        <li>
          <button
            type="button"
            class:selected={doc.id === $lighthouseResults.currentId}
            onclick={() => lighthouseActions.selectDocument(doc.id)}
          >
            {doc.name}
          </button>
          <span class="source" class:byok={doc.provider === "byok"}
            >{sourceLabel(doc)}</span
          >
          <time datetime={doc.timestamp}
            >{new Date(doc.timestamp).toLocaleString()}</time
          >
          <button
            type="button"
            class="remove"
            aria-label="Remove {doc.name}"
            onclick={() => lighthouseActions.deleteDocument(doc.id)}
            >Remove</button
          >
        </li>
      {/each}
    </ul>
    {#if $lighthouseResults.currentId}
      <LighthouseResults />
    {/if}
  {/if}
</section>

<style>
  .past-card {
    margin: 1rem auto 2rem;
    max-width: 720px;
    padding: 1.25rem 1.5rem 1.5rem;
    border: 1px solid #e4e4e4;
    border-radius: 12px;
    background: #fff;
  }
  .past-header h2 {
    margin: 0;
    font-size: 1.1rem;
  }
  .past-header p {
    margin: 0.35rem 0 0;
    color: #333;
  }
  .resume-form {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    margin-top: 1rem;
    color: #333;
  }
  .resume-form button,
  .past-list button {
    font: inherit;
    cursor: pointer;
  }
  .resume-form button {
    background: #1b3350;
    color: #fff;
    border: 0;
    border-radius: 4px;
    padding: 0.55rem 0.8rem;
  }
  .resume-form button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .sanitize {
    display: flex;
    gap: 0.35rem;
    align-items: center;
  }
  .past-list {
    list-style: none;
    margin: 1rem 0 0;
    padding: 0;
    color: #333;
  }
  .past-list li {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    padding: 0.45rem 0;
    border-bottom: 1px solid #eee;
  }
  .past-list li button:first-child {
    border: 0;
    background: transparent;
    color: #1b3350;
    font-weight: 600;
    padding: 0;
  }
  .past-list li button.selected {
    text-decoration: underline;
  }
  .source {
    font-size: 0.72rem;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: #1b3350;
    background: #e7eef6;
    border-radius: 999px;
    padding: 0.15rem 0.55rem;
  }
  .source.byok {
    color: #5c3b16;
    background: #f6ead7;
  }
  .past-list time {
    color: #666;
    font-size: 0.85rem;
  }
  .remove {
    margin-left: auto;
    border: 0;
    background: transparent;
    color: #888;
  }
  .empty {
    color: #777;
  }
</style>
