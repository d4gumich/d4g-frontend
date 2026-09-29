<script>
  import { onDestroy, onMount } from "svelte";
  import LighthouseResults from "$lib/components/lighthouse/lighthouse_results.svelte";
  import {
    lighthouseActions,
    lighthouseResults,
  } from "$lib/lighthouseStore.js";
  import {
    SEAT_CAP,
    SESSION_TIMEZONES,
    canGoToPreviousMonth,
    clickableDayNumbers,
    clockSkewMs,
    detroitDate,
    fetchSchedule,
    formatSessionRange,
    formatWindow,
    googleCalendarUrl,
    highlightedDayNumbers,
    scheduleLine,
    sessionIcs,
    sessionInstants,
  } from "$lib/lighthouseSchedule.js";

  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let payload = $state(null);
  let skew = $state(0);
  let now = $state(Date.now());
  let failed = $state(false);
  let cursor = $state(detroitDate(new Date()));
  let tab = $state("upcoming");
  let selected = $state(null);
  let zoneIndex = $state(
    SESSION_TIMEZONES.findIndex((zone) => zone.id === "America/Detroit"),
  );
  let dialogEl = $state(null);

  const today = $derived(detroitDate(new Date(now - skew)));
  const line = $derived(payload ? scheduleLine(payload, now, skew) : "");
  const sessionDays = $derived(
    payload
      ? highlightedDayNumbers(
          cursor.year,
          cursor.monthIndex,
          payload.weekly,
          payload.one_off,
        )
      : [],
  );
  const clickable = $derived(
    payload
      ? clickableDayNumbers(
          cursor.year,
          cursor.monthIndex,
          payload.weekly,
          payload.one_off,
          new Date(now - skew),
        )
      : [],
  );
  const monthLabel = $derived(
    new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "America/Detroit",
    }).format(new Date(Date.UTC(cursor.year, cursor.monthIndex, 1, 17))),
  );
  const leadingBlanks = $derived.by(() => {
    const name = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Detroit",
      weekday: "short",
    }).format(new Date(Date.UTC(cursor.year, cursor.monthIndex, 1, 17)));
    return WEEKDAYS.indexOf(name);
  });
  const daysInMonth = $derived(
    new Date(Date.UTC(cursor.year, cursor.monthIndex + 1, 0)).getUTCDate(),
  );
  const previousEnabled = $derived(canGoToPreviousMonth(cursor, today));
  let resumeFile = $state(null);
  let sanitizeResume = $state(false);
  let resumeError = $state("");
  const selectedSession = $derived(
    selected && payload
      ? sessionInstants(
          selected.year,
          selected.monthIndex,
          selected.day,
          payload.weekly,
          payload.one_off,
        )
      : null,
  );
  const zone = $derived(SESSION_TIMEZONES[zoneIndex]);
  const zoneRange = $derived(
    selectedSession
      ? formatSessionRange(selectedSession.start, selectedSession.end, zone.id)
      : "",
  );
  const selectedTitle = $derived(
    selectedSession
      ? new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Detroit",
          weekday: "short",
          month: "short",
          day: "numeric",
        }).format(selectedSession.start)
      : "",
  );
  const calendarSession = $derived(
    selectedSession
      ? {
          year: selected.year,
          monthIndex: selected.monthIndex,
          day: selected.day,
          startTime: selectedSession.startTime,
          endTime: selectedSession.endTime,
        }
      : null,
  );
  const googleUrl = $derived(
    calendarSession ? googleCalendarUrl(calendarSession) : "",
  );

  async function processResume(event) {
    event.preventDefault();
    if (!resumeFile) return;
    resumeError = "";
    try {
      await lighthouseActions.uploadPdf(resumeFile, sanitizeResume);
      resumeFile = null;
    } catch (error) {
      resumeError = error?.message || "Upload failed.";
    }
  }

  async function refresh() {
    try {
      const next = await fetchSchedule();
      payload = next;
      skew = clockSkewMs(next.server_time, Date.now());
      failed = false;
    } catch {
      failed = true;
    }
  }

  function shiftMonth(delta) {
    if (delta < 0 && !previousEnabled) return;
    const date = new Date(Date.UTC(cursor.year, cursor.monthIndex + delta, 1));
    cursor = { year: date.getUTCFullYear(), monthIndex: date.getUTCMonth() };
  }

  function openDay(day) {
    selected = { year: cursor.year, monthIndex: cursor.monthIndex, day };
    zoneIndex = SESSION_TIMEZONES.findIndex(
      (item) => item.id === "America/Detroit",
    );
  }

  function closeDialog() {
    selected = null;
  }

  function shiftZone(delta) {
    zoneIndex =
      (zoneIndex + delta + SESSION_TIMEZONES.length) % SESSION_TIMEZONES.length;
  }

  function downloadCalendar() {
    const body = sessionIcs(calendarSession);
    const blob = new Blob([body], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lighthouse-${calendarSession.year}-${String(calendarSession.monthIndex + 1).padStart(2, "0")}-${String(calendarSession.day).padStart(2, "0")}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function onKeydown(event) {
    if (event.key === "Escape") closeDialog();
  }

  $effect(() => {
    if (selected && dialogEl) dialogEl.focus();
  });

  let tick;
  let poll;
  onMount(() => {
    refresh();
    tick = setInterval(() => {
      now = Date.now();
    }, 30000);
    poll = setInterval(refresh, 60000);
  });
  onDestroy(() => {
    clearInterval(tick);
    clearInterval(poll);
  });
</script>

<svelte:window onkeydown={onKeydown} />

<section class="schedule-card" aria-label="Lighthouse Deep session schedule">
  <div class="schedule-header">
    <h2>Deep sessions</h2>
    <p>{failed ? "Schedule unavailable." : line}</p>
  </div>

  <div class="tabs" role="tablist">
    <button
      type="button"
      role="tab"
      aria-selected={tab === "upcoming"}
      onclick={() => (tab = "upcoming")}
    >
      Upcoming
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={tab === "past"}
      onclick={() => (tab = "past")}
    >
      Past sessions
    </button>
  </div>

  {#if tab === "upcoming"}
    <div class="month-nav">
      <button
        type="button"
        onclick={() => shiftMonth(-1)}
        aria-label="Previous month"
        disabled={!previousEnabled}
      >
        ‹
      </button>
      <strong>{monthLabel}</strong>
      <button
        type="button"
        onclick={() => shiftMonth(1)}
        aria-label="Next month">›</button
      >
    </div>
    <div class="month-grid">
      {#each WEEKDAYS as name}
        <span class="dow">{name}</span>
      {/each}
      {#each { length: leadingBlanks } as _}
        <span aria-hidden="true"></span>
      {/each}
      {#each { length: daysInMonth } as _, index}
        {@const day = index + 1}
        {#if clickable.includes(day)}
          <button type="button" class="day session" onclick={() => openDay(day)}
            >{day}</button
          >
        {:else}
          <span class="day" class:was-session={sessionDays.includes(day)}
            >{day}</span
          >
        {/if}
      {/each}
    </div>
  {:else}
    <form class="resume-form" onsubmit={processResume}>
      <label>
        Resume
        <input
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
      <button
        type="submit"
        disabled={!resumeFile || $lighthouseResults.loading}
      >
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
      <LighthouseResults />
    {/if}
  {/if}
</section>

{#if selectedSession}
  <div class="backdrop">
    <button
      type="button"
      class="backdrop-dismiss"
      aria-label="Close session details"
      onclick={closeDialog}
    ></button>
    <div
      class="dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-title"
      tabindex="-1"
      bind:this={dialogEl}
    >
      <h3 id="session-title">{selectedTitle}</h3>
      <p class="seats">First come, first served · {SEAT_CAP} seats</p>
      <div class="carousel">
        <button
          type="button"
          onclick={() => shiftZone(-1)}
          aria-label="Previous timezone">‹</button
        >
        <div>
          <strong>{zone.label}</strong>
          <p>{zoneRange}</p>
        </div>
        <button
          type="button"
          onclick={() => shiftZone(1)}
          aria-label="Next timezone">›</button
        >
      </div>
      <div class="dialog-actions">
        <button type="button" class="primary" onclick={downloadCalendar}
          >Add to calendar</button
        >
        <a href={googleUrl} target="_blank" rel="noopener noreferrer"
          >Google Calendar</a
        >
      </div>
      <button type="button" class="text" onclick={closeDialog}>Close</button>
    </div>
  </div>
{/if}

<style>
  .schedule-card {
    margin: 1rem auto 2rem;
    max-width: 720px;
    padding: 1.25rem 1.5rem 1.5rem;
    border: 1px solid #e4e4e4;
    border-radius: 12px;
    background: #fff;
  }
  .schedule-header h2 {
    margin: 0;
    font-size: 1.1rem;
  }
  .schedule-header p {
    margin: 0.35rem 0 0;
    color: #333;
  }
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .tabs button {
    border: 0;
    background: transparent;
    color: #777;
    font: inherit;
    padding: 0.35rem 0.2rem;
    border-bottom: 2px solid transparent;
    cursor: pointer;
  }
  .tabs button[aria-selected="true"] {
    color: #1b3350;
    border-bottom-color: #1b3350;
    font-weight: 700;
  }
  .month-nav,
  .month-grid,
  .carousel {
    display: grid;
    align-items: center;
  }
  .month-nav {
    grid-template-columns: 2rem 1fr 2rem;
    margin-top: 0.75rem;
    text-align: center;
  }
  .month-nav button,
  .carousel button {
    border: 0;
    background: transparent;
    font-size: 1.4rem;
    cursor: pointer;
    color: #1b3350;
  }
  .month-nav button:disabled {
    opacity: 0.3;
    cursor: default;
  }
  .month-grid {
    grid-template-columns: repeat(7, 1fr);
    gap: 0.35rem;
    margin-top: 0.5rem;
    text-align: center;
  }
  .dow {
    font-size: 0.7rem;
    color: #777;
  }
  .day {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.1rem;
    height: 2.1rem;
    margin: 0 auto;
    color: #c4c4c4;
    font: inherit;
  }
  .was-session {
    background: #f2f2f2;
    border-radius: 999px;
    color: #9a9a9a;
  }
  button.session {
    background: #e8f1ff;
    border-radius: 999px;
    color: #1b3350;
    font-weight: 700;
    border: 0;
    cursor: pointer;
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
  .backdrop {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 1rem;
  }
  .backdrop-dismiss {
    position: absolute;
    inset: 0;
    border: 0;
    background: rgba(27, 51, 80, 0.45);
    cursor: pointer;
  }
  .dialog {
    position: relative;
    z-index: 1;
    width: min(420px, 100%);
    background: #fff;
    border-radius: 12px;
    padding: 1.25rem 1.4rem 1.1rem;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  }
  .dialog h3 {
    margin: 0;
  }
  .seats {
    margin: 0.4rem 0 0;
    color: #444;
  }
  .carousel {
    grid-template-columns: 2rem 1fr 2rem;
    margin-top: 1rem;
    text-align: center;
    background: #f7f8fb;
    border-radius: 8px;
    padding: 0.6rem 0.2rem;
  }
  .carousel p {
    margin: 0.15rem 0 0;
  }
  .dialog-actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin-top: 1rem;
  }
  .primary,
  .dialog-actions a {
    font: inherit;
    text-decoration: none;
  }
  .primary {
    background: #1b3350;
    color: #fff;
    border: 0;
    border-radius: 4px;
    padding: 0.7rem 1rem;
    cursor: pointer;
  }
  .dialog-actions a {
    color: #1b3350;
  }
  .text {
    margin-top: 0.8rem;
    border: 0;
    background: transparent;
    color: #666;
    cursor: pointer;
    font: inherit;
    padding: 0;
  }
</style>
