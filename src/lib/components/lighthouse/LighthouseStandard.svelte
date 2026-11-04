<script>
  import { onMount } from "svelte";
  import AISetup from "$lib/components/AISetup.svelte";
  import { aiActions, aiStatus, HOST_URL } from "$lib/aiSetupStore.js";
  import { csrfHeaders } from "$lib/byokSession.js";
  import { lighthouseActions } from "$lib/lighthouseStore.js";

  let resumeText = $state("");
  let resumeFile = $state(null);
  let loading = $state(false);
  let error = $state("");
  let result = $state(null);
  let showSetup = $state(false);

  let geminiReady = $derived(
    $aiStatus.status === "active" &&
      $aiStatus.key_source === "personal" &&
      String($aiStatus.provider || "").toLowerCase().includes("google"),
  );

  onMount(() => {
    aiActions.fetchStatus();
  });

  async function readError(response) {
    const data = await response.json().catch(() => ({}));
    return data.detail || "The request failed.";
  }

  async function extractPdf(file) {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch(`${HOST_URL}api/v1/products/lighthouse/standard/parse-pdf`, {
      method: "POST",
      headers: csrfHeaders(),
      body,
      credentials: "include",
    });
    if (!response.ok) throw new Error(await readError(response));
    const data = await response.json();
    return data.extracted_text || "";
  }

  async function analyze(event) {
    event.preventDefault();
    error = "";
    result = null;
    if (!geminiReady) {
      showSetup = true;
      error = "Add a personal Gemini key before running standard analysis.";
      return;
    }

    loading = true;
    try {
      await aiActions.fetchStatus();
      let text = resumeText.trim();
      const name = resumeFile?.name || "Pasted resume";
      if (resumeFile) {
        text = (await extractPdf(resumeFile)).trim();
        resumeText = text;
      }
      if (!text) {
        error = "Paste a resume or choose a PDF.";
        return;
      }
      const response = await fetch(`${HOST_URL}api/v1/products/lighthouse/standard/analyze`, {
        method: "POST",
        headers: csrfHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ resume_text: text }),
        credentials: "include",
      });
      if (!response.ok) throw new Error(await readError(response));
      result = await response.json();
      lighthouseActions.recordStandardResult(name, text, result);
      resumeFile = null;
    } catch (err) {
      error = err?.message || "Standard analysis failed.";
    } finally {
      loading = false;
    }
  }
</script>

<section class="standard" aria-label="Standard analysis with your API key">
  <div class="heading">
    <h2>Your API key</h2>
    <p>Outside a Deep session, skill extraction and recommendations use your Gemini key. Job search stays on the shared career index.</p>
  </div>

  {#if geminiReady}
    <p class="ready">Using {$aiStatus.model || "your Gemini model"}.</p>
  {:else}
    <button type="button" class="setup" onclick={() => (showSetup = true)}>Add your Gemini key</button>
  {/if}

  <form onsubmit={analyze}>
    <label>
      Resume text
      <textarea bind:value={resumeText} rows="8" maxlength="50000" placeholder="Paste resume text"></textarea>
    </label>
    <label>
      Or a PDF
      <input
        type="file"
        accept="application/pdf,.pdf"
        onchange={(event) => {
          resumeFile = event.currentTarget.files?.[0] || null;
        }}
      />
    </label>
    <button type="submit" disabled={loading}>{loading ? "Analyzing…" : "Analyze with your key"}</button>
  </form>

  {#if error}
    <p class="error" role="alert">{error}</p>
  {/if}

  {#if result}
    <div class="output">
      <h3>Skills</h3>
      {#if result.extracted_skills?.length}
        <ul class="skills">
          {#each result.extracted_skills as skill}
            <li>{skill}</li>
          {/each}
        </ul>
      {:else}
        <p>No skills were written in the resume.</p>
      {/if}
      <h3>Matching jobs</h3>
      {#if result.top_jobs?.length}
        <ul>
          {#each result.top_jobs as job}
            <li>{job.title} · {Math.round((job.score || 0) * 100)}%</li>
          {/each}
        </ul>
      {:else}
        <p>No jobs matched.</p>
      {/if}
      <h3>Recommendations</h3>
      {#if result.recommendations?.length}
        <ul>
          {#each result.recommendations as line}
            <li>{line}</li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</section>

{#if showSetup}
  <AISetup productName="Lighthouse" onComplete={() => (showSetup = false)} onCancel={() => (showSetup = false)} />
{/if}

<style>
  .standard {
    max-width: 720px;
    margin: 0 auto 2rem;
    padding: 1.25rem;
    background: #fff;
    border: 1px solid var(--border-color, #d7dce3);
    border-radius: 12px;
  }

  .heading h2 {
    margin: 0 0 0.35rem;
    color: #1a4a86;
  }

  .heading p,
  .ready {
    margin: 0 0 1rem;
    color: #334155;
  }

  form {
    display: grid;
    gap: 0.75rem;
  }

  label {
    display: grid;
    gap: 0.35rem;
    font-weight: 600;
  }

  textarea,
  input,
  button {
    font: inherit;
  }

  textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 0.75rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
  }

  button {
    justify-self: start;
    padding: 0.65rem 1rem;
    border: 0;
    border-radius: 8px;
    background: #1a4a86;
    color: #fff;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.7;
    cursor: wait;
  }

  .setup {
    margin-bottom: 1rem;
  }

  .error {
    color: #9f1239;
  }

  .skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding: 0;
    list-style: none;
  }

  .skills li {
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    background: #e8eef6;
  }

  @media (max-width: 640px) {
    .standard {
      margin-inline: 1rem;
      padding: 1rem;
    }
  }
</style>
