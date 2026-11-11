<script>
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";
  import EngineStatus from "./EngineStatus.svelte";

  let { onClose = () => {} } = $props();

  const STEPS = [
    "Status pills",
    "BYOK or Scheduling",
    "Get a seat",
    "Upload a resume",
    "Choose what is sent",
    "The analysis",
  ];

  const PILL_SAMPLES = [
    {
      caption: "Off",
      engine: {
        step: "asleep",
        summary:
          "The engine is off. It starts about 12 minutes before the session, once someone has a seat.",
      },
    },
    {
      caption: "Starting",
      engine: {
        step: "starting",
        summary: "The engine is starting the app.",
      },
    },
    {
      caption: "Ready",
      engine: {
        step: "ready",
        summary: "The engine is ready.",
      },
    },
  ];

  const SECTION_COLORS = ["#e3b878", "#1b3350", "#afb6a6"];

  let step = $state(0);
  let dialogEl = $state(null);
  let lessonEl = $state(null);
  let sampleByok = $state(true);
  let dayOpen = $state(false);
  let seated = $state(false);
  let sampleFile = $state("");
  let uploaded = $state(false);
  let sanitize = $state(false);
  let analyzed = $state(false);
  let sections = $state([
    {
      title: "Header / Contact",
      selected: true,
      raw: "Jordan Example\njordan.example@example.com\n(555) 010-0199",
      clean: "[NAME]\n[EMAIL]\n[PHONE]",
    },
    {
      title: "Experience",
      selected: true,
      raw: "Coordinated an after-school program. Wrote grant reports and interviewed partner organizations.",
      clean:
        "Coordinated an after-school program. Wrote grant reports and interviewed partner organizations.",
    },
    {
      title: "Education",
      selected: true,
      raw: "B.A. in Public Policy, Example University",
      clean: "B.A. in Public Policy, Example University",
    },
  ]);

  let selectedCount = $derived(
    sections.filter((section) => section.selected).length,
  );
  let sentText = $derived(
    sections
      .filter((section) => section.selected)
      .map((section) => (sanitize ? section.clean : section.raw))
      .join("\n\n"),
  );

  function resetStory() {
    step = 0;
    sampleByok = true;
    dayOpen = false;
    seated = false;
    sampleFile = "";
    uploaded = false;
    sanitize = false;
    analyzed = false;
    sections = sections.map((section) => ({ ...section, selected: true }));
    lessonEl?.scrollTo({ top: 0 });
  }

  function go(next) {
    step = next;
    lessonEl?.scrollTo({ top: 0 });
  }

  function onKey(event) {
    if (event.key === "Escape") onClose();
  }

  function toggleSection(index) {
    sections = sections.map((section, i) =>
      i === index ? { ...section, selected: !section.selected } : section,
    );
    analyzed = false;
  }

  function setSanitize(checked) {
    sanitize = checked;
    analyzed = false;
  }

  function sectionBody(section) {
    return sanitize ? section.clean : section.raw;
  }

  function highlightRedacted(content) {
    const escaped = content
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
    return escaped.replace(
      /\[(NAME|EMAIL|PHONE)\]/g,
      '<span class="tutorial-pii">$&</span>',
    );
  }

  onMount(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogEl?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  });
</script>

<svelte:window onkeydown={onKey} />

<div class="backdrop">
  <button
    type="button"
    class="backdrop-dismiss"
    aria-label="Close tutorial"
    onclick={onClose}
  ></button>
  <div
    class="dialog"
    role="dialog"
    aria-modal="true"
    aria-labelledby="lighthouse-tutorial-title"
    tabindex="-1"
    bind:this={dialogEl}
  >
    <header class="dialog-head">
      <div>
        <p class="eyebrow">Lighthouse tutorial</p>
        <h2 id="lighthouse-tutorial-title">{STEPS[step]}</h2>
      </div>
      <button type="button" class="text" onclick={onClose}>Close</button>
    </header>

    <ol class="step-list">
      {#each STEPS as label, index}
        <li>
          <button
            type="button"
            aria-current={index === step ? "step" : undefined}
            onclick={() => go(index)}
          >
            {index + 1}. {label}
          </button>
        </li>
      {/each}
    </ol>

    <div class="lesson" bind:this={lessonEl}>
      <p class="kicker">
        Sample screens only. Nothing here takes a seat, uploads a file, or
        contacts Hugging Face.
      </p>

      {#if step === 0}
        <p>
          The Hugging Face GPU is the row of pills on a Deep session. One pill
          is lit. Hover a pill here for the same tip the live page uses.
        </p>
        <div class="pill-grid">
          {#each PILL_SAMPLES as sample}
            <figure>
              <figcaption>{sample.caption}</figcaption>
              <EngineStatus engine={sample.engine} />
            </figure>
          {/each}
        </div>
        <p>
          Off means the GPU is asleep. It is scheduled to start about 12 minutes
          before the session, once someone has a seat. Starting covers waking,
          building, and app startup, and analysis waits. Ready means resume
          analysis can run.
        </p>
        <figure>
          <figcaption>No pill</figcaption>
          <EngineStatus
            engine={{
              step: "unknown",
              summary:
                "The engine status could not be read. The schedule still starts it before the session.",
            }}
          />
        </figure>
        <p>
          If no pill lights up, the status could not be read. The calendar still
          opens on time. That line is the GPU status, not a seat error.
        </p>
      {:else if step === 1}
        <p>
          The badge on the bar at the top of the page picks the mode. This
          sample starts on BYOK, which is where a saved Gemini key leaves you.
          Click the badge. It does not change your real key.
        </p>
        <div class="sample-banner" class:byok={sampleByok}>
          <button
            type="button"
            class="mode-toggle"
            aria-pressed={sampleByok}
            onclick={() => (sampleByok = !sampleByok)}
          >
            {#if sampleByok}
              <span class="badge byok-badge">
                <Icon icon="mdi:account-key" width="16" height="16" />
                BYOK
              </span>
            {:else}
              <span class="badge team-badge">
                <Icon icon="mdi:shield-check" width="16" height="16" />
                Scheduling
              </span>
            {/if}
          </button>
          {#if sampleByok}
            <span class="model-label">gemini-2.5-flash-lite</span>
          {:else}
            <span class="model-label fixed"
              >meta-llama/Meta-Llama-3.1-8B-Instruct</span
            >
          {/if}
          <span class="connect-sample">Connect Key</span>
        </div>
        {#if sampleByok}
          <p>
            Your Gemini key is on. Click the badge to switch back to Scheduling.
            The icon changes back to a shield. BYOK hides Current and Past, and
            it hides the calendar. Your key runs the analysis. It does not start
            the Hugging Face GPU.
          </p>
        {:else}
          <p>
            Scheduling uses the shared Deep session. The shield is the shared
            session, and the model stays on
            meta-llama/Meta-Llama-3.1-8B-Instruct. Click the badge again if you
            want your own API key. The shield changes to a key. The calendar and
            the seat counter are on this mode.
          </p>
        {/if}
        <p>
          Connect Key on the live bar is where a Gemini, OpenAI, or Anthropic
          key is pasted. This sample does not open that form.
        </p>
      {:else if step === 2}
        <p>
          Stay on Scheduling. A blue day is a Detroit session you can still
          open. Gray days are over. Click Tuesday in this sample.
        </p>
        <div class="week" role="group" aria-label="Sample session week">
          {#each ["Mon", "Tue", "Wed", "Thu", "Fri"] as name}
            {#if name === "Tue"}
              <button
                type="button"
                class="session-day"
                aria-pressed={dayOpen}
                onclick={() => (dayOpen = true)}
              >
                {name}
              </button>
            {:else}
              <span>{name}</span>
            {/if}
          {/each}
        </div>
        {#if dayOpen}
          <div class="seat-card">
            <h3>Tuesday · Eastern</h3>
            <p class="seats">4 of 30 seats filled</p>
            <p class="note">First come, first served</p>
            <button
              type="button"
              class="primary"
              disabled={seated}
              onclick={() => (seated = true)}
            >
              {seated ? "Seat saved" : "Take a seat"}
            </button>
            {#if seated}
              <p class="next-step" role="status">
                This sample seat is saved. On the live calendar, Take a seat
                stores the seat for that Detroit date in this browser tab.
              </p>
            {:else}
              <p class="note">Opening the day does not take a seat.</p>
            {/if}
          </div>
        {/if}
        <p>
          If you are not signed in for a Deep session, Take a seat asks for the
          team security key first. A personal Gemini key is not that key. The
          seat is for this tab and that date. It is not an email list.
        </p>
        <p>
          With a seat, upload opens while the session is warming up, live, or in
          its last minutes. The GPU stays off until someone has a seat, then it
          is scheduled to start about 12 minutes before the session. A red line
          under Take a seat means the seat was not saved. The grey box on the
          calendar is only the GPU status.
        </p>
      {:else if step === 3}
        <p>
          Upload Document takes a PDF resume. Choose the file, then Upload &amp;
          Partition. Reading the PDF does not wait for the engine. Partitioning
          only splits the text into cards.
        </p>
        <p class="callout">
          With no seat, the card says: Take a seat while a session is starting
          or live. Reading the PDF does not wait for the engine.
        </p>
        <div class="card upload-sample">
          <h3>Upload Document</h3>
          <p>Analyze your PDF resume</p>
          <label class="check">
            <input
              type="checkbox"
              checked={sanitize}
              onchange={(event) => setSanitize(event.currentTarget.checked)}
            />
            Sanitize PDF (Remove PII)
          </label>
          <button
            type="button"
            class="file-label"
            onclick={() => (sampleFile = "sample-resume.pdf")}
          >
            {sampleFile || "Choose PDF..."}
          </button>
          <button
            type="button"
            class="btn-primary full"
            disabled={!sampleFile || uploaded}
            onclick={() => (uploaded = true)}
          >
            {uploaded ? "PARTITIONED" : "UPLOAD & PARTITION"}
          </button>
          {#if uploaded}
            <p class="ok" role="status">
              The sample PDF is split into cards. The GPU can still be Off or
              Starting. Analysis is a later step.
            </p>
          {/if}
        </div>
        <p>
          In the last minutes, new seats stop: No more new seats. People who
          already have a seat are finishing before the server shuts down. After
          the session: This session has ended. Resume upload is closed.
        </p>
      {:else if step === 4}
        <p>
          Sanitize PDF (Remove PII) sits on the upload card and starts
          unchecked. Check it before Upload &amp; Partition. The server then
          replaces names, emails, phone numbers, and similar details with labels
          such as [NAME]. The preview marks those labels.
        </p>
        <label class="check standalone">
          <input
            type="checkbox"
            checked={sanitize}
            onchange={(event) => setSanitize(event.currentTarget.checked)}
          />
          Sanitize PDF (Remove PII)
        </label>
        <p>
          This sample lets you flip that box after the upload so you can
          compare. On the live page, upload again to get the other version.
        </p>
        <p class="count">
          <strong>{selectedCount}</strong> of {sections.length} sections selected
        </p>
        <div class="sections">
          {#each sections as section, index}
            <div
              class="section"
              class:unselected={!section.selected}
              style="border-left-color: {SECTION_COLORS[index]}"
            >
              <label class="check">
                <input
                  type="checkbox"
                  checked={section.selected}
                  onchange={() => toggleSection(index)}
                />
                <span class="section-title">{section.title}</span>
              </label>
              <p class="section-body">
                {#if sanitize}
                  {@html highlightRedacted(sectionBody(section))}
                {:else}
                  {sectionBody(section)}
                {/if}
              </p>
            </div>
          {/each}
        </div>
        <p>
          Every card starts checked. Uncheck a card to leave it out of the text
          sent for analysis. The card stays on your screen. The count is how
          many cards will be sent.
        </p>
        <div class="sent">
          <h3>Text that would be sent</h3>
          {#if sentText}
            <pre>{sentText}</pre>
          {:else}
            <p>Nothing. Every card is unchecked.</p>
          {/if}
        </div>
      {:else}
        <p>
          Run AI Analysis sends only the checked text. On Scheduling the button
          stays off until the Ready pill is lit. The tag says Engine starting or
          Engine offline. On BYOK, your Gemini key runs this step and does not
          wait for the GPU.
        </p>
        <div class="run-row">
          <button
            type="button"
            class="btn-primary"
            disabled={!sentText || analyzed}
            onclick={() => (analyzed = true)}
          >
            {analyzed ? "Analysis ready" : "Run AI Analysis"}
          </button>
          {#if !sentText}
            <span class="warn">Check at least one section.</span>
          {/if}
        </div>
        <p>
          This sample is treated as Ready, so the button can run. It does not
          call a model. Extracted skills come from the text you sent. Top jobs
          are the closest roles, with a match percent. Recommendations are the
          written next steps. On the live page, hover a job to see which skills
          matched.
        </p>
        {#if analyzed}
          <div class="analysis" role="status">
            <article class="result-card">
              <h3>
                Extracted Skills
                <span class="tag">Extracted</span>
              </h3>
              <ul class="skills">
                <li>Grant writing</li>
                <li>Partner interviews</li>
                <li>Program coordination</li>
              </ul>
            </article>
            <article class="result-card">
              <h3>
                Top Jobs
                <span class="tag ai">AI Analysis</span>
              </h3>
              <div class="job">
                <div class="job-main">
                  <strong>Program Manager</strong>
                  <span>86%</span>
                </div>
                <p>Matched skills: grant reports, partner interviews</p>
              </div>
              <div class="job">
                <div class="job-main">
                  <strong>Development Associate</strong>
                  <span>74%</span>
                </div>
                <p>Matched skills: grant reports</p>
              </div>
            </article>
            <article class="result-card wide">
              <h3>
                AI Recommendations
                <span class="tag ai">AI Analysis</span>
              </h3>
              <ul>
                <li>
                  Lead the profile with the grant reports. That work matches
                  program and development roles.
                </li>
                <li>
                  Keep partner interviews in a checked card so the match can see
                  them.
                </li>
              </ul>
            </article>
          </div>
          <p>
            These cards are a fixed example. On the live page they follow the
            text you left checked.
          </p>
        {/if}
      {/if}
    </div>

    <footer class="dialog-foot">
      <button type="button" class="secondary" onclick={resetStory}
        >Replay</button
      >
      <div class="nav-buttons">
        <button
          type="button"
          class="secondary"
          disabled={step === 0}
          onclick={() => go(step - 1)}>Back</button
        >
        {#if step < STEPS.length - 1}
          <button type="button" class="primary" onclick={() => go(step + 1)}
            >Next</button
          >
        {:else}
          <button type="button" class="primary" onclick={onClose}>Done</button>
        {/if}
      </div>
    </footer>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 1300;
    display: flex;
    align-items: center;
    justify-content: center;
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
    display: flex;
    flex-direction: column;
    width: min(880px, 100%);
    max-height: min(92vh, 860px);
    background: #fff;
    color: #1b3350;
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
    outline: none;
  }
  .dialog-head,
  .dialog-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.9rem 1.2rem;
  }
  .dialog-head {
    border-bottom: 1px solid #e6ebf2;
  }
  .dialog-foot {
    border-top: 1px solid #e6ebf2;
  }
  .eyebrow {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #5c6b80;
  }
  h2,
  h3 {
    margin: 0;
  }
  h2 {
    font-size: 1.25rem;
  }
  .text,
  .primary,
  .secondary {
    font: inherit;
    cursor: pointer;
  }
  .text {
    border: 0;
    background: transparent;
    color: #1b3350;
    font-weight: 700;
  }
  .primary,
  .secondary {
    border-radius: 4px;
    padding: 0.55rem 0.9rem;
  }
  .primary {
    border: 0;
    background: #1b3350;
    color: #fff;
  }
  .primary:hover:not(:disabled) {
    background: #2a4d73;
  }
  .secondary {
    border: 1px solid #1b3350;
    background: #fff;
    color: #1b3350;
  }
  .secondary:hover:not(:disabled) {
    background: #e8eef6;
  }
  .primary:disabled,
  .secondary:disabled {
    opacity: 0.55;
    cursor: default;
  }
  .nav-buttons {
    display: flex;
    gap: 0.5rem;
  }
  .step-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin: 0;
    padding: 0.7rem 1.2rem 0;
    list-style: none;
  }
  .step-list button {
    border: 1px solid #d5deea;
    background: #fff;
    color: #4e5d6e;
    font: inherit;
    font-size: 0.75rem;
    border-radius: 999px;
    padding: 0.25rem 0.6rem;
    cursor: pointer;
  }
  .step-list button[aria-current="step"] {
    border-color: #1b3350;
    background: #1b3350;
    color: #fff;
    font-weight: 700;
  }
  .lesson {
    overflow: auto;
    padding: 0.9rem 1.2rem 1.1rem;
  }
  .lesson p {
    margin: 0 0 0.75rem;
    line-height: 1.45;
  }
  .kicker,
  .callout {
    padding: 0.65rem 0.75rem;
    border-radius: 8px;
    background: #fff6e8;
    color: #5c3b16;
  }
  .pill-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.6rem;
    margin-bottom: 0.75rem;
  }
  figure {
    margin: 0 0 0.75rem;
  }
  figcaption {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .sample-banner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.85rem;
    padding: 0.55rem 0.75rem;
    border-radius: 8px;
    background: #b0c4de;
    border-bottom: 2px solid #778899;
  }
  .sample-banner.byok {
    background: #93c47d;
    border-bottom-color: #6aa84f;
  }
  .mode-toggle {
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.75rem;
    border-radius: 2rem;
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #fff;
  }
  .byok-badge {
    background: #2e7d32;
  }
  .team-badge {
    background: #1b3350;
  }
  .model-label,
  .connect-sample {
    font-size: 0.75rem;
    font-weight: 700;
  }
  .model-label {
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.5);
  }
  .connect-sample {
    margin-left: auto;
    padding: 0.25rem 0.65rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #fff;
    color: #444;
  }
  .week {
    display: flex;
    gap: 0.4rem;
    margin-bottom: 0.85rem;
  }
  .week span,
  .session-day {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 999px;
    font: inherit;
    font-weight: 700;
  }
  .week span {
    color: #8b97a6;
  }
  .session-day {
    border: 0;
    background: #1a4a86;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 0 0 3px rgba(26, 74, 134, 0.22);
  }
  .session-day:hover {
    background: #153d70;
  }
  .seat-card,
  .sent,
  .result-card {
    margin-bottom: 0.85rem;
    padding: 0.9rem 1rem;
    border: 1px solid #e6ebf2;
    border-radius: 8px;
    background: #f7f8fb;
  }
  .seats {
    font-weight: 700;
  }
  .note,
  .next-step {
    color: #3d4c60;
  }
  .next-step {
    margin-top: 0.7rem;
    padding: 0.65rem 0.75rem;
    border-radius: 8px;
    background: #e7f6ec;
    color: #246b3e;
  }
  .upload-sample {
    max-width: 22rem;
    margin-bottom: 0.85rem;
  }
  .upload-sample h3 {
    margin-bottom: 0.35rem;
    font-size: 1rem;
  }
  .check {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    cursor: pointer;
  }
  .standalone {
    width: fit-content;
    margin-bottom: 0.85rem;
    padding: 0.75rem;
    border-radius: 6px;
    background: #f8f9fa;
  }
  .file-label {
    display: block;
    width: 100%;
    margin-bottom: 0.75rem;
    padding: 0.8rem;
    border: 2px dashed #ccc;
    border-radius: 6px;
    background: #fafafa;
    color: #666;
    font: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
  }
  .full {
    width: 100%;
  }
  .ok {
    margin-top: 0.75rem;
    color: #246b3e;
    font-weight: 600;
  }
  .count {
    font-size: 0.95rem;
  }
  .sections {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    margin-bottom: 0.85rem;
  }
  .section {
    padding: 0.75rem 0.85rem;
    border: 1px solid #eee;
    border-left: 4px solid #e3b878;
    border-radius: 0 4px 4px 0;
    background: #fdfdfd;
  }
  .section.unselected {
    opacity: 0.45;
  }
  .section-title {
    font-weight: 700;
  }
  .section-body {
    margin: 0;
    color: #555;
    white-space: pre-wrap;
  }
  .sent pre {
    margin: 0.55rem 0 0;
    white-space: pre-wrap;
    font: inherit;
    color: #333;
  }
  :global(.tutorial-pii) {
    padding: 0 2px;
    border-radius: 2px;
    background: #e3b878;
    font-weight: 700;
  }
  .run-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.85rem;
  }
  .warn {
    color: #8a2a2a;
    font-size: 0.85rem;
    font-weight: 700;
  }
  .analysis {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 0.75rem;
  }
  .wide {
    grid-column: 1 / -1;
  }
  .result-card h3 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.7rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid #e6ebf2;
    font-size: 0.95rem;
  }
  .tag {
    padding: 0.1rem 0.4rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #f0f0f0;
    color: #666;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  .tag.ai {
    border-color: #c8d6e5;
    background: #eef2f8;
    color: #1b3350;
  }
  .skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .skills li {
    padding: 0.2rem 0.6rem;
    border: 1px solid #d1d9e0;
    border-radius: 999px;
    background: #f0f4f8;
    font-size: 0.75rem;
  }
  .job {
    margin-top: 0.45rem;
    padding: 0.65rem 0.7rem;
    border: 1px solid #eee;
    border-radius: 6px;
    background: #fff;
  }
  .job-main {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .job-main span {
    color: #2e7d32;
    font-weight: 700;
  }
  .job p,
  .result-card ul {
    margin: 0.35rem 0 0;
    color: #444;
    font-size: 0.85rem;
  }
  .result-card ul {
    padding-left: 1.1rem;
  }
  .result-card li + li {
    margin-top: 0.45rem;
  }
  @media (max-width: 800px) {
    .pill-grid,
    .analysis {
      grid-template-columns: 1fr;
    }
    .wide {
      grid-column: auto;
    }
    .dialog-head,
    .dialog-foot,
    .lesson,
    .step-list {
      padding-left: 0.85rem;
      padding-right: 0.85rem;
    }
    .dialog-foot {
      align-items: stretch;
      flex-direction: column;
    }
    .nav-buttons {
      justify-content: flex-end;
    }
  }
</style>
