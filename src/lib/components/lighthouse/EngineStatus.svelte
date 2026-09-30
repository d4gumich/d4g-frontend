<script>
  import { onDestroy, onMount } from "svelte";
  import { formatElapsed } from "$lib/lighthouseSchedule.js";

  let { engine = null } = $props();

  const STEPS = [
    ["off", "Off"],
    ["starting", "Starting"],
    ["ready", "Ready"],
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
    {#if showSteps}
      <ol>
        {#each STEPS as [id, label], index}
          <li
            class={id}
            class:current={index === stepIndex}
            aria-current={index === stepIndex ? "step" : undefined}
          >
            {label}
          </li>
        {/each}
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
    gap: 0.35rem;
    margin: 0 0 0.55rem;
    padding: 0;
    list-style: none;
  }
  li {
    border: 2px solid #000;
    border-radius: 999px;
    padding: 0.28rem 0.7rem;
    font-size: 0.75rem;
    font-weight: 700;
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
