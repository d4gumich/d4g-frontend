<script>
  let { engine = null } = $props();

  const STEPS = [
    ["asleep", "Off"],
    ["waking", "Waking"],
    ["building", "Building"],
    ["starting", "Starting"],
    ["ready", "Ready"],
  ];

  const stepIndex = $derived(STEPS.findIndex(([id]) => id === engine?.step));
  const showSteps = $derived(stepIndex >= 0);
</script>

{#if engine?.summary}
  <div class="engine-status" class:problem={engine.step === "error"}>
    {#if showSteps}
      <ol>
        {#each STEPS as [id, label], index}
          <li
            class:done={index < stepIndex}
            class:current={index === stepIndex}
            aria-current={index === stepIndex ? "step" : undefined}
          >
            {label}
          </li>
        {/each}
      </ol>
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
    border-radius: 999px;
    padding: 0.15rem 0.55rem;
    background: #e6e8ee;
    color: #667;
    font-size: 0.75rem;
    font-weight: 700;
  }
  li.done {
    background: #d5e0ef;
    color: #1a4a86;
  }
  li.current {
    background: #1a4a86;
    color: #fff;
  }
  p {
    margin: 0;
  }
</style>
