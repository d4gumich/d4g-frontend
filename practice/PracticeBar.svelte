<script>
  let { view } = $props();
</script>

{#if view.kind === "unavailable"}
  <p class="practice-off" role="status">
    {view.message}
    <button type="button" onclick={view.retry}>Enter team key</button>
  </p>
{:else}
  <div class="dev-bar" role="region" aria-label="Schedule practice controls">
    <p>
      Practice schedule. Only Open now starts the GPU, and only after someone
      takes a seat. The session popup can skip the 10 minute wait, and that
      stays off the GPU. Leaving Open now stops it.
    </p>
    <div class="dev-actions">
      <button
        type="button"
        class:forwarded={view.payload.dev_preset === "soon" &&
          view.payload.dev_forwarded}
        aria-pressed={view.payload.dev_preset === "soon" &&
          !view.payload.dev_forwarded}
        onclick={() => view.choose("soon")}
      >
        Starts in 10 min
        <span class="dev-tail"></span>
        <span class="dev-tip"
          >Practice session starts in 10 minutes. The GPU stays off.</span
        >
      </button>
      <button
        type="button"
        aria-pressed={view.payload.dev_preset === "open"}
        onclick={() => view.choose("open")}
      >
        Open now
        <span class="dev-tail"></span>
        <span class="dev-tip"
          >Session is open now. The GPU starts only after someone takes a
          seat. Another practice button stops it.</span
        >
      </button>
      <button
        type="button"
        aria-pressed={view.payload.dev_preset === "drain"}
        onclick={() => view.choose("drain")}
      >
        Draining
        <span class="dev-tail"></span>
        <span class="dev-tip"
          >Last minutes of the session. No new seats. People who already have
          a seat can finish.</span
        >
      </button>
      <button
        type="button"
        aria-pressed={view.payload.dev_preset === "ended"}
        onclick={() => view.choose("ended")}
      >
        Ended
        <span class="dev-tail"></span>
        <span class="dev-tip">The session is over. Take a seat is off.</span>
      </button>
      <button
        type="button"
        aria-pressed={!view.payload.dev_preset}
        onclick={() => view.choose("clear")}
      >
        Real calendar
        <span class="dev-tail"></span>
        <span class="dev-tip"
          >Leave practice mode and show the real Tuesday and Thursday
          schedule.</span
        >
      </button>
      <button type="button" onclick={() => view.choose("reset_seats")}>
        Reset seats
        <span class="dev-tail"></span>
        <span class="dev-tip">Clear every held seat.</span>
      </button>
      <button type="button" onclick={() => view.choose("fill_seats")}>
        Fill seats
        <span class="dev-tail"></span>
        <span class="dev-tip"
          >Fill all 30 seats. If Open now is on, that starts the GPU.</span
        >
      </button>
    </div>
    {#if view.devNotice}
      <p class="dev-notice">{view.devNotice}</p>
    {/if}
  </div>
{/if}

<style>
  .practice-off {
    margin: 0 0 1rem;
  }
  .practice-off button {
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
    position: relative;
    font: inherit;
    cursor: pointer;
    border: 1px solid #5c3b16;
    background: #fff;
    color: #5c3b16;
    border-radius: 4px;
    padding: 0.4rem 0.65rem;
  }
  .dev-tail,
  .dev-tip {
    position: absolute;
    z-index: 6;
    opacity: 0;
    pointer-events: none;
  }
  .dev-tail {
    left: 50%;
    top: 100%;
    transform: translateX(-50%);
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 8px solid #3d2914;
  }
  .dev-tip {
    left: 50%;
    top: calc(100% + 7px);
    transform: translateX(-50%);
    box-sizing: border-box;
    width: max-content;
    max-width: 220px;
    padding: 0.45rem 0.55rem;
    border-radius: 6px;
    background: #3d2914;
    color: #fff8ee;
    font-size: 0.78rem;
    font-weight: 500;
    line-height: 1.35;
    text-align: left;
    white-space: normal;
    box-shadow: 0 6px 16px rgba(60, 36, 12, 0.18);
  }
  .dev-actions button:hover .dev-tail,
  .dev-actions button:hover .dev-tip,
  .dev-actions button:focus-visible .dev-tail,
  .dev-actions button:focus-visible .dev-tip {
    opacity: 1;
  }
  @media (max-width: 800px) {
    .dev-actions button:nth-child(1) .dev-tip,
    .dev-actions button:nth-child(3) .dev-tip {
      left: 0;
      transform: none;
    }
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
  .dev-notice {
    margin: 0.7rem 0 0;
    font-weight: 600;
  }
</style>
