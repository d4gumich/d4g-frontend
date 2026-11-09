<script>
  import { onDestroy, onMount } from "svelte";
  import LighthouseResults from "$lib/components/lighthouse/lighthouse_results.svelte";
  import EngineStatus from "$lib/components/lighthouse/EngineStatus.svelte";
  import {
    lighthouseActions,
    lighthouseResults,
  } from "$lib/lighthouseStore.js";
  import {
    clockSkewMs,
    fetchEngineStatus,
    canReturnSeat,
    fetchSchedule,
    seatWindowOpen,
    HELD_SEATS_KEY,
    livePhase,
    releaseSeat,
    scheduleLine,
    sourceTag,
    syncHeldSeats,
    scheduledTesterActive,
    SESSION_DRAIN_WARNING,
    SESSION_ENDED_WARNING,
    SEAT_TOKEN_KEY,
    TesterKeyRequired,
    unreadEngine,
  } from "$lib/lighthouseSchedule.js";
  import LighthouseSetup from "$lib/components/LighthouseSetup.svelte";

  let { personal = false, practice = false, practiceClient = null } = $props();
  const practicePage = $derived(practice === true && practiceClient != null);

  let schedule = $state(null);
  let engine = $state(null);
  let now = $state(Date.now());
  let skew = $state(0);
  let held = $state(readHeld());
  let file = $state(null);
  let fileInput = $state(null);
  let shouldSanitize = $state(false);
  let uploadError = $state("");
  let leaveError = $state("");
  let leaving = $state(false);
  let showTesterKey = $state(false);
  let keyForLeave = $state(false);
  let practiceOff = $state(false);
  let practiceKeyTried = $state(false);
  let keyForPractice = $state(false);

  const focusDate = $derived(schedule?.seat_session || "");
  const phase = $derived(schedule ? livePhase(schedule, now, skew) : "closed");
  const line = $derived(schedule ? scheduleLine(schedule, now, skew) : "");
  const seated = $derived(focusDate !== "" && held.includes(focusDate));
  const canUpload = $derived(
    personal ||
      (seated &&
        (phase === "pre_warm" || phase === "open" || phase === "drain")),
  );
  const canLeave = $derived(
    seated &&
      canReturnSeat(phase, schedule?.dev_preset) &&
      seatWindowOpen(schedule, focusDate, now, skew),
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

  function forgetSeat(date) {
    held = held.filter((item) => item !== date);
    sessionStorage.setItem(HELD_SEATS_KEY, JSON.stringify(held));
  }

  $effect(() => {
    const seats = schedule?.seats;
    if (!seats) return;
    const next = syncHeldSeats(held, seats);
    if (
      next.length === held.length &&
      next.every((date, index) => date === held[index])
    ) {
      return;
    }
    held = next;
    sessionStorage.setItem(HELD_SEATS_KEY, JSON.stringify(next));
  });

  async function leaveSeat() {
    if (!focusDate || leaving) return;
    leaving = true;
    leaveError = "";
    try {
      if (!(await scheduledTesterActive())) {
        keyForLeave = true;
        showTesterKey = true;
        return;
      }
      const token = sessionStorage.getItem(SEAT_TOKEN_KEY);
      if (!token) {
        forgetSeat(focusDate);
        return;
      }
      const result = await releaseSeat(token, focusDate, undefined, practicePage);
      if (schedule) {
        schedule = {
          ...schedule,
          seats_taken: result.seats_taken,
          seats: { ...(schedule.seats || {}), [focusDate]: result.seats_taken },
        };
      }
      forgetSeat(focusDate);
      lighthouseActions.useScheduledSeat(null, null);
    } catch (error) {
      if (error instanceof TesterKeyRequired) {
        keyForLeave = true;
        showTesterKey = true;
        return;
      }
      leaveError = error?.message || "Could not leave the session.";
    } finally {
      leaving = false;
    }
  }

  function sourceLabel(doc) {
    return sourceTag(doc, now);
  }

  function notePracticeLoadFailure(error) {
    if (
      error instanceof TesterKeyRequired ||
      (error?.status === 404 && !practiceKeyTried)
    ) {
      keyForPractice = true;
      showTesterKey = true;
      return;
    }
    if (error?.status === 404) {
      practiceOff = true;
      lighthouseActions.rememberEngine(null);
    }
  }

  async function refresh() {
    try {
      schedule = practicePage
        ? await practiceClient.fetchSchedule()
        : await fetchSchedule();
      skew = clockSkewMs(schedule.server_time, Date.now());
      practiceOff = false;
    } catch (error) {
      if (practicePage) notePracticeLoadFailure(error);
      else lighthouseActions.rememberEngine(null);
      return;
    }
    try {
      engine = practicePage
        ? await practiceClient.fetchEngine()
        : await fetchEngineStatus();
      lighthouseActions.rememberEngine(engine);
    } catch (error) {
      if (practicePage) notePracticeLoadFailure(error);
      else {
        engine = unreadEngine();
        lighthouseActions.rememberEngine(engine);
      }
    }
    held = readHeld();
  }

  function handleFileChange(event) {
    file = event.currentTarget.files?.[0] || null;
  }

  async function handleUpload() {
    if (!file || !canUpload) return;
    uploadError = "";
    try {
      if (personal) {
        await lighthouseActions.uploadStandardPdf(file, shouldSanitize);
      } else {
        if (!(await scheduledTesterActive())) {
          keyForLeave = false;
          showTesterKey = true;
          return;
        }
        await lighthouseActions.uploadPdf(file, shouldSanitize);
      }
      file = null;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      if (error instanceof TesterKeyRequired) {
        keyForLeave = false;
        showTesterKey = true;
        return;
      }
      uploadError = error?.message || "Upload failed.";
    }
  }

  $effect(() => {
    if (personal) {
      lighthouseActions.useScheduledSeat(null, null);
      return;
    }
    const token =
      typeof sessionStorage === "undefined"
        ? ""
        : sessionStorage.getItem(SEAT_TOKEN_KEY);
    if (canUpload && token) {
      lighthouseActions.useScheduledSeat(token, focusDate, practice);
    } else {
      lighthouseActions.useScheduledSeat(null, null);
    }
  });

  let announcedPhase = null;
  const engineFast = $derived(
    schedule?.dev_preset === "open" &&
      Boolean(engine?.startup?.started_at) &&
      !engine?.startup?.ready_at,
  );

  $effect(() => {
    if (!schedule) return;
    const shown = livePhase(schedule, now, skew);
    if (shown === schedule.phase) {
      announcedPhase = shown;
      return;
    }
    if (announcedPhase === shown) return;
    announcedPhase = shown;
    refresh();
  });

  $effect(() => {
    const id = setInterval(refresh, engineFast ? 3000 : 15000);
    return () => clearInterval(id);
  });

  onMount(() => {
    refresh();
    const clock = setInterval(() => {
      now = Date.now();
    }, 1000);
    return () => clearInterval(clock);
  });
  onDestroy(() => {
    lighthouseActions.useScheduledSeat(null, null);
  });
</script>

<section class="workspace" aria-label="Lighthouse seat workspace">
  {#if practicePage && practiceOff}
    <p role="status">
      {practiceClient.unavailable}
      <button
        class="retry"
        type="button"
        onclick={() => {
          practiceKeyTried = false;
          keyForPractice = true;
          showTesterKey = true;
        }}
      >
        Enter team key
      </button>
    </p>
  {:else}
    {#if !personal}
      {#if line}
        <p class="session-line">{line}</p>
      {/if}
      {#if schedule?.dev_preset === "ended" || (seated && phase === "closed")}
        <p class="session-warning">
          {SESSION_ENDED_WARNING} Resume upload is closed.
        </p>
      {/if}
      <EngineStatus {engine} {canLeave} {leaving} onLeave={leaveSeat} />
      {#if leaveError}
        <p class="upload-error" role="alert">{leaveError}</p>
      {/if}
    {/if}
    <div class="dashboard-grid">
      <aside class="sidebar">
        <div class="card upload-card">
          <h3>Upload Document</h3>
          <p>Analyze your PDF resume</p>
          {#if !canUpload}
            <p class="gate">
              {#if phase === "drain"}
                {SESSION_DRAIN_WARNING}
              {:else if seated && phase === "closed"}
                {SESSION_ENDED_WARNING} Resume upload is closed.
              {:else}
                Take a seat while a session is starting or live. Reading the PDF
                does not wait for the engine.
              {/if}
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
            <p class="upload-error" role="alert">{uploadError}</p>
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
        <LighthouseResults {personal} />
      </section>
    </div>
  {/if}
</section>

{#if showTesterKey}
  <LighthouseSetup
    onComplete={() => {
      const leavingAfterKey = keyForLeave;
      const practiceAfterKey = keyForPractice;
      showTesterKey = false;
      keyForLeave = false;
      keyForPractice = false;
      if (practiceAfterKey) practiceKeyTried = true;
      if (leavingAfterKey) leaveSeat();
      else if (practiceAfterKey) refresh();
      else handleUpload();
    }}
    onCancel={() => {
      if (keyForPractice && !schedule) {
        practiceKeyTried = true;
        practiceOff = true;
      }
      showTesterKey = false;
      keyForLeave = false;
      keyForPractice = false;
    }}
  />
{/if}

<style>
  .workspace {
    max-width: 1400px;
    margin: 0 auto 2rem;
    padding: 0 2rem;
  }
  .retry {
    display: block;
    margin-top: 0.6rem;
    border: 0;
    background: transparent;
    color: #1b3350;
    font: inherit;
    font-weight: 700;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
  }
  .session-line {
    margin: 0 0 0.85rem;
    color: #1b3350;
    font-weight: 650;
  }
  .session-warning {
    margin: 0 0 0.85rem;
    padding: 0.7rem 0.8rem;
    border-radius: 8px;
    background: #fff4e5;
    color: #6a3d09;
    font-weight: 600;
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
