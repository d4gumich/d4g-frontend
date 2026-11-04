<script>
  import { onDestroy, onMount } from "svelte";
  import { formatElapsed } from "$lib/lighthouseSchedule.js";

  let {
    engine = null,
    canLeave = false,
    leaving = false,
    onLeave = () => {},
  } = $props();

  const STEPS = [
    [
      "off",
      "Off",
      "The GPU is asleep. It starts about 12 minutes before the session, once someone has a seat.",
    ],
    [
      "starting",
      "Starting",
      "The GPU is waking on Hugging Face. Analysis waits until it is ready.",
    ],
    ["ready", "Ready", "The GPU is up. Resume analysis can run."],
  ];

  let now = $state(Date.now());
  let clock;

  const displayStep = $derived.by(() => {
    const step = engine?.step;
    if (step === "asleep") return "off";
    if (step === "ready") return "ready";
    if (step === "waking" || step === "building" || step === "starting")
      return "starting";
    return "";
  });
  const stepIndex = $derived(STEPS.findIndex(([id]) => id === displayStep));
  const showSteps = $derived(stepIndex >= 0);
  const startupLabel = $derived.by(() => {
    const startup = engine?.startup;
    if (!startup?.started_at) return "";
    const started = Date.parse(startup.started_at);
    const end = startup.ready_at ? Date.parse(startup.ready_at) : now;
    if (Number.isNaN(started) || Number.isNaN(end)) return "";
    const clockText = formatElapsed(end - started);
    return startup.ready_at
      ? `Startup took ${clockText}`
      : `Startup ${clockText}`;
  });

  onMount(() => {
    clock = setInterval(() => {
      now = Date.now();
    }, 1000);
  });
  onDestroy(() => clearInterval(clock));
</script>

{#if engine?.summary}
  <div class="engine-status" class:problem={engine.step === "error"}>
    {#if showSteps || canLeave}
      <ol>
        {#if showSteps}
          {#each STEPS as [id, label, tip], index}
            <li
              class={id}
              class:current={index === stepIndex}
              aria-current={index === stepIndex ? "step" : undefined}
            >
              {label}
              <span class="engine-tail"></span>
              <span class="engine-tip">{tip}</span>
            </li>
          {/each}
        {/if}
        {#if canLeave}
          <li class="leave">
            <button type="button" disabled={leaving} onclick={onLeave}
              >Leave session</button
            >
          </li>
        {/if}
      </ol>
    {/if}
    {#if startupLabel}
      <p class="startup">{startupLabel}</p>
    {/if}
    <p>{engine.summary}</p>
  </div>
{/if}

<style>
  .engine-status {
    margin-top: 0.85rem;
    padding: 0.75rem 0.85rem;
    border-radius: 8px;
    background: #f4f7fb;
    color: #1b3350;
  }
  .problem {
    background: #fbf4f4;
    color: #8a2a2a;
  }
  ol {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
    margin: 0 0 0.55rem;
    padding: 0;
    list-style: none;
  }
  li.leave {
    padding: 0;
    background: #fff;
    color: #1b3350;
  }
  li.leave button {
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.28rem 0.7rem;
    border-radius: 999px;
    cursor: pointer;
  }
  li.leave button:disabled {
    opacity: 0.55;
    cursor: default;
  }
  li {
    position: relative;
    border: 2px solid #000;
    border-radius: 999px;
    padding: 0.28rem 0.7rem;
    font-size: 0.75rem;
    font-weight: 700;
  }
  .engine-tail,
  .engine-tip {
    position: absolute;
    z-index: 6;
    opacity: 0;
    pointer-events: none;
  }
  .engine-tail {
    left: 50%;
    top: 100%;
    transform: translateX(-50%);
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 8px solid transparent;
  }
  .engine-tip {
    left: 50%;
    top: calc(100% + 7px);
    transform: translateX(-50%);
    box-sizing: border-box;
    width: max-content;
    max-width: 220px;
    padding: 0.45rem 0.55rem;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 500;
    line-height: 1.35;
    text-align: left;
    white-space: normal;
  }
  li.off .engine-tail {
    border-bottom-color: #c23b3b;
  }
  li.off .engine-tip {
    left: 0;
    transform: none;
    background: #c23b3b;
    color: #fff;
    box-shadow: 0 6px 16px rgba(194, 59, 59, 0.28);
  }
  li.starting .engine-tail {
    border-bottom-color: #f2c200;
  }
  li.starting .engine-tip {
    background: #f2c200;
    color: #3a3008;
    box-shadow: 0 6px 16px rgba(242, 194, 0, 0.35);
  }
  li.ready .engine-tail {
    border-bottom-color: #1f8a4c;
  }
  li.ready .engine-tip {
    background: #1f8a4c;
    color: #fff;
    box-shadow: 0 6px 16px rgba(31, 138, 76, 0.28);
  }
  li:hover .engine-tail,
  li:hover .engine-tip,
  li:focus-within .engine-tail,
  li:focus-within .engine-tip {
    opacity: 1;
  }
  @media (max-width: 800px) {
    li.starting .engine-tip,
    li.ready .engine-tip {
      left: 0;
      right: auto;
      transform: none;
    }
  }
  li.off {
    background: #f3d6d6;
    color: #8d3a3a;
  }
  li.off.current {
    background: #c23b3b;
    color: #fff;
  }
  li.starting {
    background: #f8efc0;
    color: #6f5b10;
  }
  li.starting.current {
    background: #f2c200;
    color: #3a3008;
  }
  li.ready {
    background: #d9eedf;
    color: #246b3e;
  }
  li.ready.current {
    background: #1f8a4c;
    color: #fff;
  }
  p {
    margin: 0;
  }
  .startup {
    margin-bottom: 0.35rem;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
  }
</style>
