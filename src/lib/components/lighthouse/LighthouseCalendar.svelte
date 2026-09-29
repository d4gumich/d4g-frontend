<script>
  import { onDestroy, onMount } from "svelte";
  import {
    SEAT_CAP,
    SESSION_TIMEZONES,
    canGoToPreviousMonth,
    claimSeat,
    clickableDayNumbers,
    clockSkewMs,
    detroitDate,
    fetchSchedule,
    formatSessionRange,
    googleCalendarUrl,
    highlightedDayNumbers,
    scheduleLine,
    sessionDateKey,
    sessionIcs,
    sessionInstants,
    setDevSchedule,
  } from "$lib/lighthouseSchedule.js";

  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const SEAT_TOKEN_KEY = "lighthouse_seat_token";
  const HELD_KEY = "lighthouse_seats_held";

  let payload = $state(null);
  let skew = $state(0);
  let now = $state(Date.now());
  let failed = $state(false);
  let cursor = $state(detroitDate(new Date()));
  let selected = $state(null);
  let zoneIndex = $state(0);
  let dialogEl = $state(null);
  let held = $state(readHeld());
  let claiming = $state(false);
  let claimError = $state("");

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
  const selectedDate = $derived(
    selected
      ? sessionDateKey(selected.year, selected.monthIndex, selected.day)
      : "",
  );
  const seatCap = $derived(Number(payload?.seat_cap ?? SEAT_CAP));
  const focusDate = $derived.by(() => {
    if (!payload) return "";
    const window = payload.current_window || payload.upcoming?.[0];
    if (!window?.start) return payload.seat_session || "";
    const date = detroitDate(new Date(window.start));
    return sessionDateKey(date.year, date.monthIndex, date.day);
  });
  const focusTaken = $derived(
    Number(payload?.seats?.[focusDate] ?? payload?.seats_taken ?? 0),
  );
  const selectedTaken = $derived(Number(payload?.seats?.[selectedDate] ?? 0));
  const holdingSelected = $derived(
    selectedDate !== "" && held.includes(selectedDate),
  );
  const selectedFull = $derived(selectedTaken >= seatCap && !holdingSelected);

  function readHeld() {
    if (typeof sessionStorage === "undefined") return [];
    try {
      const parsed = JSON.parse(sessionStorage.getItem(HELD_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function seatToken() {
    let token = sessionStorage.getItem(SEAT_TOKEN_KEY);
    if (!token) {
      token = crypto.randomUUID();
      sessionStorage.setItem(SEAT_TOKEN_KEY, token);
    }
    return token;
  }

  function rememberSeat(date) {
    if (held.includes(date)) return;
    held = [...held, date];
    sessionStorage.setItem(HELD_KEY, JSON.stringify(held));
  }

  function showDevDate(date) {
    if (!date) return;
    const [year, month, day] = date.split("-").map(Number);
    cursor = { year, monthIndex: month - 1 };
    return { year, monthIndex: month - 1, day };
  }

  async function chooseDev(preset) {
    const session =
      focusDate || sessionDateKey(today.year, today.monthIndex, today.day);
    try {
      const next = await setDevSchedule(
        preset,
        preset === "fill_seats" ? session : undefined,
      );
      payload = next;
      skew = clockSkewMs(next.server_time, Date.now());
      failed = false;
      if (preset === "reset_seats") {
        held = [];
        sessionStorage.removeItem(HELD_KEY);
      }
      const shown = showDevDate(next.dev_date);
      if (shown && ["soon", "open", "drain"].includes(preset)) {
        selected = shown;
        zoneIndex = 0;
        claimError = "";
      } else if (preset === "ended" || preset === "clear") {
        selected = null;
      }
    } catch (error) {
      failed = true;
      claimError = error?.message || "Could not change the dev schedule.";
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

  async function takeSeat(date) {
    if (!date || claiming) return;
    claiming = true;
    claimError = "";
    try {
      const result = await claimSeat(seatToken(), date);
      payload = {
        ...payload,
        seat_cap: result.seat_cap,
        seats: { ...(payload?.seats || {}), [date]: result.seats_taken },
      };
      if (result.accepted) rememberSeat(date);
    } catch (error) {
      claimError = error?.message || "Could not save a seat.";
    } finally {
      claiming = false;
    }
  }

  async function openDay(day) {
    selected = { year: cursor.year, monthIndex: cursor.monthIndex, day };
    zoneIndex = 0;
    claimError = "";
    const date = sessionDateKey(cursor.year, cursor.monthIndex, day);
    if (held.includes(date)) await takeSeat(date);
  }

  function closeDialog() {
    selected = null;
    claimError = "";
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
  {#if payload?.dev}
    <div class="dev-bar" role="region" aria-label="Schedule practice controls">
      <p>
        Practice schedule. Open a session on this machine to take a seat and add
        a calendar reminder. This does not wake the GPU.
      </p>
      <div class="dev-actions">
        <button
          type="button"
          aria-pressed={payload.dev_preset === "soon"}
          onclick={() => chooseDev("soon")}>Starts in 10 min</button
        >
        <button
          type="button"
          aria-pressed={payload.dev_preset === "open"}
          onclick={() => chooseDev("open")}>Open now</button
        >
        <button
          type="button"
          aria-pressed={payload.dev_preset === "drain"}
          onclick={() => chooseDev("drain")}>Draining</button
        >
        <button
          type="button"
          aria-pressed={payload.dev_preset === "ended"}
          onclick={() => chooseDev("ended")}>Ended</button
        >
        <button type="button" onclick={() => chooseDev("clear")}
          >Real calendar</button
        >
        <button type="button" onclick={() => chooseDev("reset_seats")}
          >Reset seats</button
        >
        <button type="button" onclick={() => chooseDev("fill_seats")}
          >Fill seats</button
        >
      </div>
    </div>
  {/if}
  <div class="schedule-header">
    <h2>Deep sessions</h2>
    <p>{failed ? "Schedule unavailable." : line}</p>
    {#if payload}
      <p class="seat-count">{focusTaken} of {seatCap} seats filled</p>
    {/if}
  </div>

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
    <button type="button" onclick={() => shiftMonth(1)} aria-label="Next month"
      >›</button
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
      <p class="seats">{selectedTaken} of {seatCap} seats filled</p>
      <p class="seats-note">First come, first served</p>
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
        <button
          type="button"
          class="primary"
          disabled={holdingSelected || selectedFull || claiming}
          onclick={() => takeSeat(selectedDate)}
        >
          {claiming
            ? "Saving seat…"
            : holdingSelected
              ? "Seat saved"
              : selectedFull
                ? "Session full"
                : "Take a seat"}
        </button>
        <button type="button" class="secondary" onclick={downloadCalendar}
          >Add to calendar</button
        >
        <a href={googleUrl} target="_blank" rel="noopener noreferrer"
          >Google Calendar</a
        >
      </div>
      {#if claimError}
        <p class="claim-error">{claimError}</p>
      {/if}
      <button type="button" class="text" onclick={closeDialog}>Close</button>
    </div>
  </div>
{/if}

<style>
  .dev-bar {
    margin-bottom: 1rem;
    padding: 0.8rem 0.9rem;
    border: 1px solid #e3b878;
    border-radius: 8px;
    background: #fff8ee;
  }
  .dev-bar p {
    margin: 0;
    color: #5c3b16;
  }
  .dev-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    margin-top: 0.7rem;
  }
  .dev-actions button {
    font: inherit;
    cursor: pointer;
    border: 1px solid #5c3b16;
    background: #fff;
    color: #5c3b16;
    border-radius: 4px;
    padding: 0.4rem 0.65rem;
  }
  .dev-actions button[aria-pressed="true"] {
    background: #5c3b16;
    color: #fff;
  }
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
  .seat-count {
    color: #1b3350;
    font-weight: 600;
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
    background: #1a4a86;
    border-radius: 999px;
    color: #fff;
    font-weight: 700;
    border: 0;
    cursor: pointer;
  }
  button.session:hover {
    background: #153d70;
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
    color: #1b3350;
    font-weight: 600;
  }
  .seats-note,
  .claim-error {
    margin: 0.2rem 0 0;
    color: #555;
  }
  .claim-error {
    color: #8a2a2a;
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
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    margin-top: 1rem;
  }
  .primary,
  .secondary,
  .dialog-actions a {
    font: inherit;
    text-decoration: none;
  }
  .primary,
  .secondary {
    border-radius: 4px;
    padding: 0.7rem 1rem;
    cursor: pointer;
  }
  .primary {
    background: #1b3350;
    color: #fff;
    border: 0;
  }
  .primary:disabled {
    opacity: 0.65;
    cursor: default;
  }
  .secondary {
    background: #fff;
    color: #1b3350;
    border: 1px solid #1b3350;
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
