<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { aiActions, aiStatus, requestAiSetup } from "$lib/aiSetupStore.js";
  import { lighthouseResults, lighthouseStatus } from "$lib/lighthouseStore.js";
  import {
    clockSkewMs,
    fetchSchedule,
    HELD_SEATS_KEY,
    livePhase,
  } from "$lib/lighthouseSchedule.js";
  import {
    GUIDE_DONE_KEY,
    GUIDE_HIDE_KEY,
    GUIDE_OFF_KEY,
    GUIDE_ROUTE_KEY,
    GUIDE_STEP_KEY,
    guideSession,
    guideTarget,
    lessonSequence,
    placeCoach,
    seatGuidance,
    takeGuideReset,
  } from "$lib/lighthouseGuide.js";

  let { byokMode = false, view = "upcoming", onView = () => {} } = $props();

  let active = $state(false);
  let turnedOff = $state(false);
  let step = $state("card");
  let route = $state("scheduling");
  let schedule = $state(null);
  let scheduleReady = $state(false);
  let now = $state(Date.now());
  let skew = $state(0);
  let held = $state(false);
  let ringStyle = $state("");
  let cardStyle = $state("top:6rem;right:1rem;width:21rem;");
  let showRing = $state(false);
  let unlocked = $state(["card", "when", "pills", "days"]);
  let cardEl = $state(null);

  const phase = $derived(schedule ? livePhase(schedule, now, skew) : "closed");
  const guidance = $derived(scheduleReady ? seatGuidance(phase) : "loading");
  const currentDoc = $derived(
    $lighthouseResults.history?.find(
      (doc) => doc.id === $lighthouseResults.currentId,
    ) ?? null,
  );
  const hasDoc = $derived(Boolean(currentDoc));
  const hasAnalysis = $derived(Boolean(currentDoc?.analysis));
  const hasKey = $derived(
    $aiStatus.status === "active" && $aiStatus.key_source === "personal",
  );
  const engineReady = $derived(
    ($lighthouseStatus?.stage || "").toUpperCase() === "RUNNING",
  );
  const anchor = $derived(guideTarget(step, { held, hasKey }));
  const sequence = $derived.by(() => {
    const primary = lessonSequence(guidance, { held });
    if (primary.includes(step)) return primary;
    if (lessonSequence("closed").includes(step))
      return lessonSequence("closed");
    return lessonSequence("join");
  });
  const stepIndex = $derived(Math.max(0, sequence.indexOf(step)));
  const prevStep = $derived(stepIndex > 0 ? sequence[stepIndex - 1] : null);
  const nextStep = $derived(
    stepIndex < sequence.length - 1 ? sequence[stepIndex + 1] : null,
  );
  const canNext = $derived(Boolean(nextStep && unlocked.includes(nextStep)));

  function readHeld() {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(HELD_SEATS_KEY) || "[]");
      return Array.isArray(parsed) && parsed.length > 0;
    } catch {
      return false;
    }
  }

  function unlock(...ids) {
    const missing = ids.filter((id) => id && !unlocked.includes(id));
    if (missing.length) unlocked = [...unlocked, ...missing];
  }

  function rectOf(node) {
    if (!node) return null;
    const rect = node.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return null;
    return {
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
    };
  }

  function highlighted() {
    if (step === "seat") {
      const seat = document.querySelector("[data-coach='use-seat']");
      if (seat) return seat;
    }
    return document.querySelector(`[data-coach="${anchor}"]`);
  }

  function columnFor(target) {
    const schedule = document.querySelector(".schedule-card");
    if (schedule) return schedule;
    const main = document.querySelector(".main-content");
    const mainBusy = (main?.innerText || "").trim().length > 0;
    if (!mainBusy && target) return target;
    return document.querySelector(".workspace") || target;
  }

  function coachBox(target) {
    const column = columnFor(target);
    const dialog = [...document.querySelectorAll("[role='dialog']")].find(
      (node) => {
        const rect = node.getBoundingClientRect();
        return rect.width > 40 && rect.height > 40;
      },
    );
    let chromeBottom = 0;
    document
      .querySelectorAll(".ai-status-banner, .demo-warning, .navbar")
      .forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.bottom > chromeBottom && rect.top < window.innerHeight * 0.5) {
          chromeBottom = rect.bottom;
        }
      });
    const body = cardEl?.querySelector(".body");
    const actions = cardEl?.querySelector(".actions");
    const contentHeight =
      (body?.scrollHeight || 0) + (actions?.offsetHeight || 0) + 48;
    const narrow = window.innerWidth < 860;
    const nav = document.querySelector(".nav");
    const navBottom = nav ? Math.max(0, nav.getBoundingClientRect().bottom) : 0;
    return {
      chromeBottom,
      box: placeCoach({
        viewport: { width: window.innerWidth, height: window.innerHeight },
        target: rectOf(target),
        column: rectOf(column),
        dialog: rectOf(dialog),
        card: { height: contentHeight || 420 },
        chromeBottom: narrow ? navBottom : chromeBottom,
        floor: null,
      }),
    };
  }

  function revealAboveSheet(target) {
    const rect = target.getBoundingClientRect();
    const nav = document.querySelector(".nav");
    const navBottom = nav ? Math.max(0, nav.getBoundingClientRect().bottom) : 0;
    const desired = navBottom + 8;
    const low = window.innerHeight * 0.5;
    if (rect.top < desired - 12 || rect.bottom > low) {
      const delta = rect.top - desired;
      if (Math.abs(delta) > 8) window.scrollBy(0, delta);
    }
  }

  let layingOut = false;

  function paintRing(target, box) {
    showRing = Boolean(target);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    let top = rect.top - 6;
    let height = rect.height + 12;
    if (box?.docked) height = Math.min(height, box.top - 8 - top);
    if (height > 20) {
      const next = `top:${top}px;left:${rect.left - 6}px;width:${rect.width + 12}px;height:${height}px`;
      if (ringStyle !== next) ringStyle = next;
    } else {
      showRing = false;
    }
  }

  function layout(scroll) {
    if (layingOut) return;
    layingOut = true;
    let followUp = false;
    try {
      let target = highlighted();
      let { box } = coachBox(target);
      if (scroll && box.docked && target) {
        const before = window.scrollY;
        revealAboveSheet(target);
        followUp = Math.abs(window.scrollY - before) > 1;
        target = highlighted();
        ({ box } = coachBox(target));
      } else if (target && scroll) {
        target.scrollIntoView({ block: "nearest", inline: "nearest" });
        target = highlighted();
        ({ box } = coachBox(target));
      }
      paintRing(target, box);
      const nextCard = `top:${box.top}px;left:${box.left}px;width:${box.width}px;`;
      if (cardStyle !== nextCard) cardStyle = nextCard;
    } finally {
      layingOut = false;
      if (followUp) requestAnimationFrame(() => layout(false));
    }
  }

  function showPreview() {
    const preview = [...document.querySelectorAll(".tab-switcher button")].find(
      (button) => button.textContent.includes("Document Preview"),
    );
    preview?.click();
  }

  function showAnalysis() {
    document.querySelector("[data-coach='analysis-tab']")?.click();
  }

  function applyChrome(next) {
    if (
      next === "card" ||
      next === "when" ||
      next === "pills" ||
      next === "days" ||
      next === "migrate" ||
      next === "seat"
    ) {
      route = "scheduling";
      aiActions.setForceTeamKey(true);
      onView("upcoming");
      return;
    }
    if (next === "byok-switch" || next === "byok-pane") {
      route = "byok";
      aiActions.setForceTeamKey(false);
      return;
    }
    if (next === "byok-after") {
      route = "scheduling";
      aiActions.setForceTeamKey(true);
      onView("past");
      return;
    }
    if (route === "byok") {
      aiActions.setForceTeamKey(false);
      return;
    }
    aiActions.setForceTeamKey(true);
    onView("past");
  }

  function rememberPlace() {
    sessionStorage.setItem(GUIDE_STEP_KEY, step);
    sessionStorage.setItem(GUIDE_ROUTE_KEY, route);
  }

  function showStep(next) {
    step = next;
    applyChrome(next);
    rememberPlace();
    requestAnimationFrame(() => {
      if (next === "results") showAnalysis();
      if (next === "sections" || next === "analyze") showPreview();
      layout(true);
    });
  }

  function turnOff() {
    localStorage.setItem(GUIDE_OFF_KEY, "1");
    turnedOff = true;
    active = false;
    showRing = false;
  }

  function turnOn() {
    localStorage.removeItem(GUIDE_OFF_KEY);
    turnedOff = false;
    active = true;
    applyChrome(step);
    requestAnimationFrame(() => layout(true));
  }

  function useOwnKey() {
    route = "byok";
    unlock("migrate", "byok-switch", "byok-pane", "upload");
    const status = get(aiStatus);
    const personal =
      status.status === "active" && status.key_source === "personal";
    if (step === "analyze" && hasDoc && personal) {
      unlock("sections", "analyze");
      showStep("analyze");
      return;
    }
    showStep(personal ? "byok-pane" : "byok-switch");
  }

  $effect(() => {
    document.documentElement.classList.toggle("lighthouse-coach-on", active);
    return () =>
      document.documentElement.classList.remove("lighthouse-coach-on");
  });

  $effect(() => {
    if (!active) return;
    const ids = [];
    if (guidance === "join" || (guidance === "finishing" && held)) {
      ids.push("seat");
    }
    if (guidance === "join" && (held || view === "past")) ids.push("upload");
    else if (guidance === "finishing" && held) ids.push("upload");
    else if (scheduleReady && guidance !== "join" && guidance !== "loading") {
      ids.push("migrate", "byok-switch");
    }
    if (hasKey) ids.push("byok-pane");
    if (route === "byok" && hasKey) ids.push("upload");
    if (hasDoc) ids.push("sections", "analyze");
    if (hasAnalysis) ids.push("results", "byok-after");
    unlock(...ids);
  });

  $effect(() => {
    if (!active || step !== "seat" || route !== "scheduling") return;
    if (view === "past") showStep("upload");
  });

  let scrolledStep = "";

  $effect(() => {
    if (!active) return;
    const scroll = step !== scrolledStep;
    scrolledStep = step;
    anchor;
    const frame = requestAnimationFrame(() => layout(scroll));
    return () => cancelAnimationFrame(frame);
  });

  $effect(() => {
    if (!cardEl) return;
    const resizeCard = new ResizeObserver(() => layout(false));
    resizeCard.observe(cardEl);
    return () => resizeCard.disconnect();
  });

  onMount(() => {
    const resetSearch = takeGuideReset(window.location.search);
    if (resetSearch !== null) {
      localStorage.removeItem(GUIDE_DONE_KEY);
      localStorage.removeItem(GUIDE_OFF_KEY);
      sessionStorage.removeItem(GUIDE_HIDE_KEY);
      sessionStorage.removeItem(GUIDE_STEP_KEY);
      sessionStorage.removeItem(GUIDE_ROUTE_KEY);
      history.replaceState(
        null,
        "",
        window.location.pathname + resetSearch + window.location.hash,
      );
    }
    const session = guideSession({
      off: localStorage.getItem(GUIDE_OFF_KEY) === "1",
      step: sessionStorage.getItem(GUIDE_STEP_KEY) || "",
      route: sessionStorage.getItem(GUIDE_ROUTE_KEY) || "",
      reset: resetSearch !== null,
    });
    step = session.step;
    route = session.route;
    turnedOff = !session.show;
    if (session.show) {
      active = true;
      applyChrome(step);
    }
    rememberPlace();
    held = readHeld();
    const clock = setInterval(() => {
      now = Date.now();
      held = readHeld();
    }, 1000);
    const onResize = () => layout(false);
    const onScroll = () => {
      if (!active || layingOut) return;
      paintRing(highlighted(), null);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    let frame = 0;
    const observer = new MutationObserver((records) => {
      const relevant = records.some((record) => {
        const node = record.target;
        return !(node instanceof Element && node.closest("aside.card, .ring"));
      });
      if (!relevant) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => layout(false));
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const load = () =>
      fetchSchedule()
        .then((payload) => {
          schedule = payload;
          skew = clockSkewMs(payload.server_time, Date.now());
        })
        .catch(() => {});
    load().finally(() => {
      scheduleReady = true;
      layout(false);
    });
    const poll = setInterval(load, 30000);
    return () => {
      clearInterval(clock);
      clearInterval(poll);
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
      document.documentElement.classList.remove("lighthouse-coach-on");
    };
  });
</script>

{#if active}
  {#if showRing}
    <div class="ring" style={ringStyle}></div>
  {/if}
  <aside class="card" style={cardStyle} bind:this={cardEl}>
    <div class="body">
      <p class="eyebrow">
        {scheduleReady
          ? `Step ${stepIndex + 1} of ${sequence.length}`
          : `Step ${stepIndex + 1}`}
      </p>
      {#if step === "card"}
        <h2 id="coach-title">Deep sessions</h2>
        <p>
          The outlined card is Scheduling. There are two ways to analyze a
          resume.
        </p>
        <ul>
          <li>
            <strong>Scheduling</strong> uses this card while a session is open. A
            seat starts the shared GPU. You do not bring a key.
          </li>
          <li>
            <strong>Your key</strong> is a Gemini key you bring. It works at any time.
            It does not start the GPU, and this card hides. Use it when the card is
            offline.
          </li>
        </ul>
      {:else if step === "when"}
        <h2 id="coach-title">When the GPU can run</h2>
        <p>The top of the card is the clock for that GPU.</p>
        <ul>
          <li>
            The line under <strong>Deep sessions</strong> names the next session and
            how long until it starts.
          </li>
          <li>
            The seat line is how many of the 30 seats are filled. The GPU starts
            about 12 minutes before that session, once someone has a seat.
            Looking at the card does not take one.
          </li>
        </ul>
      {:else if step === "pills"}
        <h2 id="coach-title">The status pills</h2>
        <p>These three pills are the shared GPU inside the card.</p>
        <ul>
          <li>
            <strong>Off.</strong> The GPU is asleep. Scheduling cannot analyze yet.
            While the next session is still in the future, Off is the expected state.
          </li>
          <li>
            <strong>Starting.</strong> The GPU is waking, building, or opening the
            app. Analysis waits.
          </li>
          <li>
            <strong>Ready.</strong> The GPU is up. A resume can be analyzed.
          </li>
        </ul>
        {#if guidance === "join"}
          <p>
            After you take a seat, watch it move from Off to Starting, then
            Ready.
          </p>
        {/if}
      {:else if step === "days"}
        <h2 id="coach-title">The calendar</h2>
        <p>
          Blue numbers are Deep sessions. Days without a blue number have none.
        </p>
        <p>
          Choosing a blue day opens the details. That does not reserve a seat.
          <strong>Take a seat</strong> does, and it may ask for the team key.
          <strong>Use your seat</strong> then opens the upload page.
        </p>
        {#if guidance === "join"}
          <p>This session can be joined. Next is where you take the seat.</p>
        {:else if guidance === "loading"}
          <p>Checking whether a session is open.</p>
        {:else}
          <p>
            No session is open, so a seat on this card would not produce an
            analysis today. Next explains the switch to your key.
          </p>
        {/if}
      {:else if step === "migrate"}
        <h2 id="coach-title">Why this visit uses your key</h2>
        <p>
          Scheduling analyzes a resume only while a session is open and the pill
          says Ready. This card is offline, so the shared GPU will not run an
          analysis on this visit.
        </p>
        <p>
          Your Gemini key will. The badge for that says <strong>Your key</strong
          >. The upload and the analysis stay the same, and the key does not
          wake the GPU. On a later blue day, the shield returns you here.
        </p>
        <p>
          The badge is the switch: a shield is Scheduling, a key icon is Your
          key.
        </p>
      {:else if step === "seat"}
        <h2 id="coach-title">Get a seat</h2>
        {#if guidance === "join"}
          <p>
            A session is open, so Scheduling is the version to use. The shared
            GPU is available once you have a seat and the pill says Ready.
          </p>
          <ol>
            <li>Choose a blue day. The day opens. That reserves nothing.</li>
            <li>
              Choose <strong>Take a seat</strong>. If a team key is requested,
              enter it. That key admits you to the shared session.
            </li>
            <li>Choose <strong>Use your seat</strong>.</li>
          </ol>
          <p>
            The seat stays in this browser tab, and the upload page opens. The
            GPU starts for a seated session during the warmup.
          </p>
        {:else}
          <p>
            This session is in its last minutes. Your seat is still in this tab.
            Choose <strong>Use your seat</strong>. New seats are closed.
          </p>
        {/if}
      {:else if step === "byok-switch"}
        <h2 id="coach-title">Connect your Gemini key</h2>
        {#if hasKey}
          <p>
            Your key is already saved. The badge says <strong>Your key</strong>,
            and the Deep sessions card steps aside for the upload workspace.
            Next walks that workspace.
          </p>
        {:else}
          <p>
            Choose <strong>Connect Key</strong> at the top, or the button below. The
            form lists what to paste. Save the key.
          </p>
          <p>
            The badge changes from the shield to <strong>Your key</strong>. The
            calendar hides. Next explains the workspace that replaces it.
          </p>
        {/if}
      {:else if step === "byok-pane"}
        <h2 id="coach-title">The workspace for your key</h2>
        <p>
          This is the other version of the page. The outlined area is all of it.
        </p>
        <ul>
          <li>
            The badge says <strong>Your key</strong>. The model beside it is the
            one your key runs.
          </li>
          <li>The left card uploads the resume.</li>
          <li>The large area is where the resume and the analysis appear.</li>
        </ul>
        <p>
          Sanitize, the section cards, and Run AI Analysis are the same controls
          as on a Deep session. Choosing the badge’s shield brings the calendar
          back. The resume in this tab stays.
        </p>
      {:else if step === "upload"}
        <h2 id="coach-title">Upload your resume</h2>
        <p>
          {#if route === "byok" || byokMode}
            This left card is the upload for your key.
          {:else}
            The seat opened this page. The shared GPU may still be starting.
          {/if}
        </p>
        <ol>
          <li>
            <strong>Sanitize PDF (Remove PII).</strong> Turn this on before you upload
            when the file has your name, email, or phone number. Those become labels
            such as [NAME], [EMAIL], and [PHONE]. Leave it off when you want the original
            text sent.
          </li>
          <li>Pick the file with <strong>Choose PDF…</strong>.</li>
          <li>Choose <strong>Upload &amp; Partition</strong>.</li>
        </ol>
        <p>The PDF is read right away. It does not wait for the GPU.</p>
      {:else if step === "sections"}
        <h2 id="coach-title">Choose what is sent</h2>
        <p>Each card is one part of the resume. Every card starts checked.</p>
        <ul>
          <li>Uncheck a card to keep that text out of the analysis.</li>
          <li>
            The count above the cards is how many parts will be sent. The
            preview stays in this browser.
          </li>
          <li>
            Red labels such as [NAME] are text the sanitize step already
            replaced.
          </li>
        </ul>
        <p>
          Choose Next when the checked cards are the ones you want analyzed.
        </p>
      {:else if step === "analyze"}
        <h2 id="coach-title">Run the analysis</h2>
        {#if route === "byok" || byokMode}
          <p>
            <strong>Run AI Analysis</strong> sends only the checked text through your
            Gemini key. It does not wait for the pills. When the result arrives, Next
            opens it.
          </p>
        {:else if engineReady}
          <p>
            The GPU is Ready. <strong>Run AI Analysis</strong> sends only the checked
            sections. When the result arrives, Next opens it.
          </p>
        {:else}
          <p>
            On Scheduling, <strong>Run AI Analysis</strong> stays off until the pill
            says Ready. The tag reads Engine starting or Engine offline while you
            wait.
          </p>
          <p>
            You can wait for Ready, or analyze this same resume now with your
            Gemini key.
          </p>
        {/if}
      {:else if step === "results"}
        <h2 id="coach-title">Your analysis</h2>
        <p>This is the resume you uploaded, from the text you checked.</p>
        <ul>
          <li><strong>Extracted skills</strong> come from that text.</li>
          <li>
            <strong>Top jobs</strong> are the closest roles, each with a match percent.
          </li>
          <li><strong>Recommendations</strong> are the written next steps.</li>
        </ul>
        <p>
          Go back and change the cards to run it again. The new result replaces
          this one.
        </p>
        {#if route === "byok" || byokMode}
          <p>
            This result came from your key, because the session was offline. On
            a blue day, the shield returns to Scheduling.
          </p>
        {:else}
          <p>
            This result came from the shared GPU, because a session was open.
            Next explains your own key, for when the card is offline.
          </p>
        {/if}
      {:else}
        <h2 id="coach-title">Your own key, the other version</h2>
        <p>
          You used Scheduling because a session was open. That is the shared
          GPU, and it is the right version while the pill can reach Ready.
        </p>
        <p>
          <strong>Your key</strong> is the version for any other time. The
          outlined shield switches to your Gemini key.
          <strong>Connect Key</strong> saves one when you do not have one yet. The
          calendar hides, and a later run uses the key instead of the GPU. It does
          not wake the GPU. The analysis already on screen stays either way.
        </p>
      {/if}
      {#if !canNext && nextStep && step !== "results"}
        <p class="hint">
          {#if step === "days" && guidance === "loading"}
            Checking whether a Deep session is open.
          {:else if step === "seat" && guidance === "join"}
            Next turns on after you choose Use your seat.
          {:else if step === "seat" && guidance === "finishing" && held}
            Next turns on after you choose Use your seat.
          {:else if step === "byok-switch"}
            Next turns on after the key is saved.
          {:else if step === "upload"}
            Next turns on after a resume is open on this page.
          {:else if step === "analyze"}
            Next turns on when the analysis appears.
          {/if}
        </p>
      {/if}
    </div>
    <div class="actions">
      {#if prevStep}
        <button
          type="button"
          class="secondary"
          onclick={() => showStep(prevStep)}
        >
          Back
        </button>
      {/if}
      {#if step === "seat" && guidance === "join"}
        <button type="button" class="secondary" onclick={useOwnKey}>
          Use my key instead
        </button>
      {:else if step === "analyze" && route === "scheduling" && !byokMode && !engineReady}
        <button type="button" class="secondary" onclick={useOwnKey}>
          Analyze with my key
        </button>
      {:else if step === "byok-switch" && !hasKey}
        <button type="button" class="secondary" onclick={requestAiSetup}>
          Open the key form
        </button>
      {/if}
      {#if step === "results" && nextStep === "byok-after"}
        <button
          type="button"
          class="secondary"
          onclick={() => showStep("byok-after")}
        >
          Your own key
        </button>
      {:else if nextStep}
        <button
          type="button"
          class="primary"
          disabled={!canNext}
          onclick={() => canNext && showStep(nextStep)}>Next</button
        >
      {/if}
      <button type="button" class="text" onclick={turnOff}>Turn off</button>
    </div>
  </aside>
{:else if turnedOff}
  <button type="button" class="show-steps" onclick={turnOn}>Show steps</button>
{/if}

<style>
  :global(html.lighthouse-coach-on) :global(.schedule-card) {
    margin-left: auto;
    margin-right: 24rem;
  }
  :global(html.lighthouse-coach-on) :global(.workspace) {
    margin-left: 1.25rem;
    margin-right: 24rem;
    max-width: none;
    width: auto;
  }
  @media (max-width: 860px) {
    :global(html.lighthouse-coach-on) :global(.schedule-card) {
      margin-right: auto;
    }
    :global(html.lighthouse-coach-on) :global(.workspace) {
      margin-left: auto;
      margin-right: auto;
      max-width: 1400px;
    }
  }
  .ring {
    position: fixed;
    z-index: 1400;
    border: 3px solid #e3b878;
    border-radius: 10px;
    box-shadow: 0 0 0 4px rgba(227, 184, 120, 0.28);
    pointer-events: none;
  }
  .card {
    position: fixed;
    z-index: 1401;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: visible;
    border-radius: 12px;
    background: #fff;
    color: #1b3350;
    box-shadow: 0 12px 32px rgba(27, 51, 80, 0.18);
  }
  .body {
    overflow: visible;
    padding: 0.95rem 1rem 0.4rem;
  }
  .eyebrow {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #8a5a16;
  }
  h2 {
    margin: 0.15rem 0 0.45rem;
    font-size: 1.05rem;
  }
  p,
  li {
    margin: 0 0 0.55rem;
    line-height: 1.45;
    font-size: 0.92rem;
  }
  ul,
  ol {
    margin: 0 0 0.55rem;
    padding-left: 1.15rem;
  }
  .hint {
    margin: 0;
    color: #6a3d09;
    font-weight: 650;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    flex: none;
    padding: 0.7rem 1rem 0.85rem;
    border-top: 1px solid #efe6d6;
    background: #fff;
  }
  button {
    font: inherit;
    cursor: pointer;
    border-radius: 4px;
  }
  button:focus-visible {
    outline: 2px solid #e3b878;
    outline-offset: 2px;
  }
  .primary {
    border: 0;
    background: #1b3350;
    color: #fff;
    padding: 0.45rem 0.8rem;
    font-weight: 700;
  }
  .primary:disabled {
    opacity: 0.45;
    cursor: default;
  }
  .secondary,
  .text {
    border: 0;
    background: transparent;
    color: #1b3350;
    padding: 0.45rem 0.35rem;
    font-weight: 700;
  }
  .secondary {
    border: 1px solid #1b3350;
    padding: 0.4rem 0.7rem;
  }
  .show-steps {
    position: fixed;
    z-index: 1401;
    right: 1rem;
    bottom: 1rem;
    border: 1px solid #1b3350;
    background: #fff;
    color: #1b3350;
    padding: 0.45rem 0.75rem;
    font-weight: 700;
    box-shadow: 0 8px 20px rgba(27, 51, 80, 0.16);
  }
</style>
