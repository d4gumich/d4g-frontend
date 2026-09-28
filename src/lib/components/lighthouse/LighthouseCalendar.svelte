<script>
  import { onDestroy, onMount } from "svelte";
  import {
    clockSkewMs,
    fetchSchedule,
    formatWindow,
    highlightedDayNumbers,
    scheduleLine,
  } from "$lib/lighthouseSchedule.js";

  function detroitMonth(date) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Detroit",
      year: "numeric",
      month: "numeric",
    }).formatToParts(date);
    return {
      year: Number(parts.find((part) => part.type === "year").value),
      monthIndex: Number(parts.find((part) => part.type === "month").value) - 1,
    };
  }

  let payload = $state(null);
  let skew = $state(0);
  let now = $state(Date.now());
  let failed = $state(false);
  let cursorReady = false;
  let cursor = $state(detroitMonth(new Date()));

  const line = $derived(payload ? scheduleLine(payload, now, skew) : "");
  const highlights = $derived(
    payload ? highlightedDayNumbers(cursor.year, cursor.monthIndex, payload.weekly, payload.one_off) : []
  );
  const monthLabel = $derived(
    new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "America/Detroit" }).format(
      new Date(Date.UTC(cursor.year, cursor.monthIndex, 1, 17))
    )
  );
  const leadingBlanks = $derived.by(() => {
    const name = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Detroit",
      weekday: "short",
    }).format(new Date(Date.UTC(cursor.year, cursor.monthIndex, 1, 17)));
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
  });
  const daysInMonth = $derived(new Date(Date.UTC(cursor.year, cursor.monthIndex + 1, 0)).getUTCDate());

  async function refresh() {
    try {
      const next = await fetchSchedule();
      payload = next;
      skew = clockSkewMs(next.server_time, Date.now());
      failed = false;
      const first = next.upcoming?.[0]?.start;
      if (first && !cursorReady) {
        cursor = detroitMonth(new Date(first));
        cursorReady = true;
      }
    } catch {
      failed = true;
    }
  }

  function shiftMonth(delta) {
    const date = new Date(Date.UTC(cursor.year, cursor.monthIndex + delta, 1));
    cursor = { year: date.getUTCFullYear(), monthIndex: date.getUTCMonth() };
  }

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

<section class="schedule-card" aria-label="Lighthouse Deep session schedule">
  <div class="schedule-header">
    <h2>Deep sessions</h2>
    <p>{failed ? "Schedule unavailable." : line}</p>
  </div>
  <div class="month-nav">
    <button type="button" onclick={() => shiftMonth(-1)} aria-label="Previous month">‹</button>
    <strong>{monthLabel}</strong>
    <button type="button" onclick={() => shiftMonth(1)} aria-label="Next month">›</button>
  </div>
  <div class="month-grid">
    {#each ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as name}
      <span class="dow">{name}</span>
    {/each}
    {#each { length: leadingBlanks } as _}
      <span aria-hidden="true"></span>
    {/each}
    {#each { length: daysInMonth } as _, index}
      <span class:session={highlights.includes(index + 1)}>{index + 1}</span>
    {/each}
  </div>
  {#if payload?.upcoming?.length}
    <ul>
      {#each payload.upcoming as window}
        <li>
          {formatWindow(window.start, "America/Detroit")}
          <span> · {formatWindow(window.start, Intl.DateTimeFormat().resolvedOptions().timeZone)}</span>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .schedule-card {
    margin: 1rem auto;
    max-width: 720px;
    padding: 1rem 1.25rem;
    border: 1px solid #e4e4e4;
    border-radius: 12px;
    background: #fff;
  }
  .schedule-header h2 { margin: 0; font-size: 1.1rem; }
  .schedule-header p { margin: 0.35rem 0 0; color: #333; }
  .month-nav, .month-grid { display: grid; align-items: center; }
  .month-nav { grid-template-columns: 2rem 1fr 2rem; margin-top: 0.75rem; }
  .month-nav button { border: 0; background: transparent; font-size: 1.4rem; cursor: pointer; }
  .month-grid { grid-template-columns: repeat(7, 1fr); gap: 0.25rem; margin-top: 0.5rem; text-align: center; }
  .dow { font-size: 0.7rem; color: #777; }
  .session { background: #e8f1ff; border-radius: 999px; font-weight: 700; }
  ul { padding-left: 1.1rem; }
  li span { color: #666; }
</style>
