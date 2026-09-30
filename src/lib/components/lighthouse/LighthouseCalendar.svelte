<script>
  import { onDestroy, onMount } from "svelte";
  import {
    SEAT_CAP,
    SESSION_TIMEZONES,
    canGoToPreviousMonth,
    canReturnSeat,
    claimSeat,
    clickableDayNumbers,
    clockSkewMs,
    detroitDate,
    fetchEngineStatus,
    fetchSchedule,
    formatSessionRange,
    googleCalendarUrl,
    HELD_SEATS_KEY,
    livePhase,
    highlightedDayNumbers,
    releaseSeat,
    scheduleLine,
    seatWindowOpen,
    scheduledTesterActive,
    seatControls,
    SEAT_TOKEN_KEY,
    SESSION_DRAIN_WARNING,
    SESSION_ENDED_WARNING,
    sessionDateKey,
    sessionIcs,
    sessionInstants,
    setDevSchedule,
    TesterKeyRequired,
  } from "$lib/lighthouseSchedule.js";
  import { lighthouseActions } from "$lib/lighthouseStore.js";
  import EngineStatus from "$lib/components/lighthouse/EngineStatus.svelte";
  import LighthouseSetup from "$lib/components/LighthouseSetup.svelte";

  let { onUpload = () => {} } = $props();

  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const PRACTICE_PRESETS = ["soon", "open", "drain", "ended"];

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
  let leaving = $state(false);
  let pendingAction = $state("claim");
  let claimError = $state("");
  let showTesterKey = $state(false);
  let pendingSeatDate = $state(null);
  let devNotice = $state("");
  let engine = $state(null);

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
  const zoneRange = $derived.by(() => {
    if (!selectedSession) return "";
    if (payload?.dev_waiting_for_seat && selected) {
      const date = sessionDateKey(
        selected.year,
        selected.monthIndex,
        selected.day,
      );
      if (date === payload.dev_date) return "Starts when someone takes a seat";
    }
    return formatSessionRange(
      selectedSession.start,
      selectedSession.end,
      zone.id,
    );
  });
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
    if (payload?.dev_date) return payload.dev_date;
    if (!payload) return "";
    const window = payload.current_window || payload.upcoming?.[0];
    if (!window?.start) return payload.seat_session || "";
    const date = detroitDate(new Date(window.start));
    return sessionDateKey(date.year, date.monthIndex, date.day);
  });
  const focusTaken = $derived(
    Number(payload?.seats?.[focusDate] ?? payload?.seats_taken ?? 0),
  );
  const selectedTaken = $derived.by(() => {
    if (!selectedDate) return 0;
    const seats = payload?.seats || {};
    if (Object.prototype.hasOwnProperty.call(seats, selectedDate)) {
      return Number(seats[selectedDate]);
    }
    if (selectedDate === payload?.seat_session) {
      return Number(payload?.seats_taken || 0);
    }
    return 0;
  });
  const holdingSelected = $derived(
    selectedDate !== "" && held.includes(selectedDate),
  );
  const selectedFull = $derived(selectedTaken >= seatCap && !holdingSelected);
  const selectedStage = $derived.by(() => {
    if (!selectedSession) return "";
    const instant = now - skew;
    const start = selectedSession.start.getTime();
    const end = selectedSession.end.getTime();
    const preWake = Number(payload?.pre_wake_minutes ?? 12) * 60000;
    const drain = Number(payload?.drain_minutes ?? 10) * 60000;
    if (instant < start - preWake) return "upcoming";
    if (instant < start) return "pre_warm";
    if (instant < end - drain) return "open";
    if (instant < end) return "drain";
    return "ended";
  });
  const liveForSelected = $derived(
    holdingSelected && (selectedStage === "open" || selectedStage === "drain"),
  );
  const canUseSeat = $derived(
    holdingSelected &&
      (selectedStage === "pre_warm" ||
        selectedStage === "open" ||
        selectedStage === "drain"),
  );
  const canUseFocusSeat = $derived(
    focusDate !== "" &&
      held.includes(focusDate) &&
      (payload?.phase === "pre_warm" ||
        payload?.phase === "open" ||
        payload?.phase === "drain"),
  );
  const shownPhase = $derived(
    payload ? livePhase(payload, now, skew) : "closed",
  );
  const canLeaveFocus = $derived(
    focusDate !== "" &&
      held.includes(focusDate) &&
      canReturnSeat(shownPhase, payload?.dev_preset) &&
      seatWindowOpen(payload, focusDate, now, skew),
  );
  const canLeaveSelected = $derived(
    holdingSelected && canReturnSeat(selectedStage, payload?.dev_preset),
  );
  const seat = $derived(
    seatControls({
      stage: selectedStage,
      holding: holdingSelected,
      full: selectedFull,
      claiming,
    }),
  );
  const seatNextStep = $derived.by(() => {
    if (!holdingSelected) return "";
    if (selectedStage === "pre_warm") {
      return "You're in early. The engine is starting, and you can upload a resume now. Analysis waits until the engine is ready.";
    }
    if (liveForSelected) {
      return "You're in. Upload a resume from your seat. Analysis runs when the engine is ready.";
    }
    if (selectedStage === "ended") {
      return "You're in. This session has ended, so resume upload is closed.";
    }
    return "You're in. Add this session to your calendar. Resume upload opens when the engine starts.";
  });

  function readHeld() {
    if (typeof sessionStorage === "undefined") return [];
    try {
      const parsed = JSON.parse(sessionStorage.getItem(HELD_SEATS_KEY) || "[]");
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
    sessionStorage.setItem(HELD_SEATS_KEY, JSON.stringify(held));
  }

  function forgetSeat(date) {
    held = held.filter((item) => item !== date);
    sessionStorage.setItem(HELD_SEATS_KEY, JSON.stringify(held));
  }

  function releaseLocalSeats() {
    held = [];
    sessionStorage.removeItem(HELD_SEATS_KEY);
  }

  function showDevDate(date) {
    if (!date) return;
    const [year, month, day] = date.split("-").map(Number);
    cursor = { year, monthIndex: month - 1 };
    return { year, monthIndex: month - 1, day };
  }

  async function chooseDev(preset) {
    const session =
      payload?.dev_date ||
      selectedDate ||
      focusDate ||
      sessionDateKey(today.year, today.monthIndex, today.day);
    try {
      const next = await setDevSchedule(
        preset,
        preset === "fill_seats" ? session : undefined,
      );
      payload = next;
      skew = clockSkewMs(next.server_time, Date.now());
      failed = false;
      if (preset === "reset_seats") releaseLocalSeats();
      const shown = showDevDate(
        preset === "fill_seats" ? session : next.dev_date,
      );
      const openPopup =
        shown &&
        (PRACTICE_PRESETS.includes(preset) ||
          preset === "fill_seats" ||
          preset === "fast_forward");
      if (openPopup) {
        selected = shown;
        zoneIndex = 0;
        claimError = "";
      }
      if (preset === "open") {
        const taken = Number(
          next.seats?.[next.dev_date] ?? next.seats_taken ?? 0,
        );
        devNotice =
          taken >= 1
            ? "Open now requested the GPU. The startup timer runs until Hugging Face says it is ready. Another practice button stops it."
            : "Open now is armed. The session clock and the GPU stay off until someone takes a seat.";
      } else if (preset === "soon") {
        devNotice =
          "Session starts in 10 minutes. Fast forward skips that wait. The GPU stays off.";
      } else if (preset === "fast_forward") {
        devNotice = "Skipped the wait. The session is open. The GPU stays off.";
      } else if (preset === "drain") {
        devNotice = SESSION_DRAIN_WARNING;
      } else if (preset === "ended") {
        devNotice = `${SESSION_ENDED_WARNING} Take a seat is off.`;
      } else if (preset === "clear") {
        selected = null;
        devNotice = "Real Tuesday and Thursday calendar is on.";
      } else if (preset === "reset_seats") {
        devNotice = "Seats reset. Open a session, then take a seat.";
      } else if (preset === "fill_seats") {
        devNotice =
          next.dev_preset === "open"
            ? "All 30 seats are filled. The GPU starts because someone has a seat."
            : "All 30 seats are filled. Take a seat stays off until you reset seats.";
      }
      await refreshEngine();
    } catch (error) {
      failed = true;
      claimError = error?.message || "Could not change the dev schedule.";
    }
  }

  function continueToUpload() {
    closeDialog();
    onUpload();
  }

  async function refreshEngine() {
    try {
      engine = await fetchEngineStatus();
      lighthouseActions.rememberEngine(engine);
    } catch {
      engine = null;
    }
  }

  async function refresh() {
    try {
      const next = await fetchSchedule();
      payload = next;
      skew = clockSkewMs(next.server_time, Date.now());
      failed = false;
      await refreshEngine();
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
    claimError = "";
    try {
      if (!(await scheduledTesterActive())) {
        pendingSeatDate = date;
        pendingAction = "claim";
        showTesterKey = true;
        return;
      }
    } catch {
      pendingSeatDate = date;
      pendingAction = "claim";
      showTesterKey = true;
      return;
    }
    await saveSeat(date);
  }

  async function saveSeat(date) {
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
      if (result.accepted) {
        rememberSeat(date);
        if (payload?.dev_preset === "open") {
          devNotice =
            "Open now requested the GPU. The startup timer runs until Hugging Face says it is ready. Another practice button stops it.";
          await refresh();
        }
      }
    } catch (error) {
      if (error instanceof TesterKeyRequired) {
        pendingSeatDate = date;
        pendingAction = "claim";
        showTesterKey = true;
        return;
      }
      claimError = error?.message || "Could not save a seat.";
    } finally {
      claiming = false;
    }
  }

  async function leaveSeat(date) {
    if (!date || leaving) return;
    leaving = true;
    claimError = "";
    try {
      const result = await releaseSeat(seatToken(), date);
      payload = {
        ...payload,
        seat_cap: result.seat_cap,
        seats: { ...(payload?.seats || {}), [date]: result.seats_taken },
        seats_taken:
          date === payload?.seat_session
            ? result.seats_taken
            : payload?.seats_taken,
      };
      forgetSeat(date);
      if (payload?.dev_preset === "open" && result.seats_taken < 1) {
        devNotice =
          "Open now is armed. The session clock and the GPU stay off until someone takes a seat.";
      }
    } catch (error) {
      if (error instanceof TesterKeyRequired) {
        pendingSeatDate = date;
        pendingAction = "leave";
        showTesterKey = true;
        return;
      }
      claimError = error?.message || "Could not leave the session.";
    } finally {
      leaving = false;
    }
  }

  function finishTesterKey() {
    showTesterKey = false;
    const date = pendingSeatDate;
    const action = pendingAction;
    pendingSeatDate = null;
    pendingAction = "claim";
    if (!date) return;
    if (action === "leave") leaveSeat(date);
    else saveSeat(date);
  }

  function cancelTesterKey() {
    showTesterKey = false;
    pendingSeatDate = null;
    pendingAction = "claim";
  }

  function openDay(day) {
    selected = { year: cursor.year, monthIndex: cursor.monthIndex, day };
    zoneIndex = 0;
    claimError = "";
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
  let announcedPhase = null;

  const engineFast = $derived(
    payload?.dev_preset === "open" &&
      Boolean(engine?.startup?.started_at) &&
      !engine?.startup?.ready_at,
  );

  $effect(() => {
    if (!payload) return;
    const shown = livePhase(payload, now, skew);
    if (shown === payload.phase) {
      announcedPhase = shown;
      return;
    }
    if (announcedPhase === shown) return;
    announcedPhase = shown;
    refresh();
  });

  $effect(() => {
    const delay = engineFast ? 3000 : 15000;
    const id = setInterval(refreshEngine, delay);
    return () => clearInterval(id);
  });

  onMount(() => {
    refresh();
    tick = setInterval(() => {
      now = Date.now();
    }, 1000);
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
        Practice schedule. Only Open now starts the GPU, and only after someone
        takes a seat. Fast forward skips the 10 minute wait and stays off the
        GPU. Leaving Open now stops it.
      </p>
      <div class="dev-actions">
        <button
          type="button"
          class:forwarded={payload.dev_preset === "soon" &&
            payload.dev_forwarded}
          aria-pressed={payload.dev_preset === "soon" && !payload.dev_forwarded}
          onclick={() => chooseDev("soon")}>Starts in 10 min</button
        >
        <button
          type="button"
          disabled={payload.dev_preset !== "soon"}
          onclick={() => chooseDev("fast_forward")}>Fast forward</button
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
        <button
          type="button"
          aria-pressed={!payload.dev_preset}
          onclick={() => chooseDev("clear")}>Real calendar</button
        >
        <button type="button" onclick={() => chooseDev("reset_seats")}
          >Reset seats</button
        >
        <button type="button" onclick={() => chooseDev("fill_seats")}
          >Fill seats</button
        >
      </div>
      {#if devNotice}
        <p class="dev-notice">{devNotice}</p>
      {/if}
    </div>
  {/if}
  <div class="schedule-header">
    <h2>Deep sessions</h2>
    <p>{failed ? "Schedule unavailable." : line}</p>
    {#if payload}
      <p class="seat-count">{focusTaken} of {seatCap} seats filled</p>
    {/if}
    {#if payload?.dev_preset === "ended"}
      <p class="session-warning">{SESSION_ENDED_WARNING} Take a seat is off.</p>
    {/if}
    <EngineStatus
      {engine}
      canLeave={canLeaveFocus}
      {leaving}
      onLeave={() => leaveSeat(focusDate)}
    />
    {#if (canUseFocusSeat || canLeaveFocus) && !selected}
      <p class="next-step">
        You have a seat.
        {#if canUseFocusSeat}
          <button type="button" onclick={continueToUpload}>Use your seat</button
          >
        {/if}
      </p>
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
          disabled={seat.disabled}
          onclick={() => takeSeat(selectedDate)}
        >
          {seat.label}
        </button>
        {#if payload?.dev_preset === "soon" && (selectedStage === "pre_warm" || selectedStage === "upcoming")}
          <button
            type="button"
            class="secondary"
            onclick={() => chooseDev("fast_forward")}>Fast forward</button
          >
        {/if}
        <button type="button" class="secondary" onclick={downloadCalendar}
          >Add to calendar</button
        >
        <a href={googleUrl} target="_blank" rel="noopener noreferrer"
          >Google Calendar</a
        >
      </div>
      {#if seat.warning}
        <p class="session-warning">{seat.warning}</p>
      {/if}
      {#if claimError}
        <p class="claim-error">{claimError}</p>
      {/if}
      {#if seatNextStep}
        <div class="next-step">
          <p>{seatNextStep}</p>
          {#if canUseSeat}
            <button type="button" class="primary" onclick={continueToUpload}
              >Use your seat</button
            >
          {/if}
          {#if canLeaveSelected}
            <button
              type="button"
              class="secondary"
              disabled={leaving}
              onclick={() => leaveSeat(selectedDate)}>Leave session</button
            >
          {/if}
        </div>
      {/if}
      <button type="button" class="text" onclick={closeDialog}>Close</button>
    </div>
  </div>
{/if}

{#if showTesterKey}
  <LighthouseSetup onComplete={finishTesterKey} onCancel={cancelTesterKey} />
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
  .dev-actions button.forwarded,
  .dev-actions button.forwarded:active {
    background: #c4a574;
    color: #3d2914;
    border-color: #8a6239;
  }
  .dev-actions button:active {
    transform: translateY(1px);
    background: #5c3b16;
    color: #fff;
  }
  .dev-actions button:disabled {
    opacity: 0.45;
    cursor: default;
  }
  .dev-actions button:disabled:active {
    transform: none;
    background: #fff;
    color: #5c3b16;
  }
  .session-warning {
    margin: 0.7rem 0 0;
    padding: 0.7rem 0.8rem;
    border-radius: 8px;
    background: #fff4e5;
    color: #6a3d09;
    font-weight: 600;
  }
  .dev-notice {
    margin: 0.7rem 0 0;
    font-weight: 600;
  }
  .next-step {
    margin: 0.85rem 0 0;
    color: #1b3350;
  }
  .dialog .next-step {
    padding: 0.75rem 0.85rem;
    border-radius: 8px;
    background: #f4f7fb;
  }
  .dialog .next-step p {
    margin: 0;
  }
  .dialog .next-step .primary {
    margin-top: 0.7rem;
  }
  .schedule-header .next-step button {
    margin-left: 0.35rem;
    border: 0;
    background: transparent;
    color: #1a4a86;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
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
    grid-template-columns: 2.4rem 1fr 2.4rem;
    margin-top: 1.1rem;
    text-align: center;
  }
  .month-nav strong {
    font-size: 1.35rem;
    color: #1b3350;
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
    gap: 0.4rem;
    margin-top: 0.7rem;
    padding: 0.85rem 0.55rem 0.95rem;
    border: 1px solid #c5d3e4;
    border-radius: 12px;
    background: #f4f7fb;
    text-align: center;
  }
  .dow {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #1b3350;
  }
  .day {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 2.75rem;
    aspect-ratio: 1;
    height: auto;
    margin: 0 auto;
    color: #8b97a6;
    font: inherit;
    font-size: 0.95rem;
  }
  .was-session {
    background: #e4eaf2;
    border: 1px solid #c5d0dc;
    border-radius: 999px;
    color: #4e5d6e;
    font-weight: 650;
  }
  button.session {
    background: #1a4a86;
    border-radius: 999px;
    color: #fff;
    font-weight: 700;
    font-size: 1rem;
    border: 0;
    cursor: pointer;
    box-shadow: 0 0 0 3px rgba(26, 74, 134, 0.22);
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
