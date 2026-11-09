<script>
  import Navbar from "$lib/components/navbar.svelte";
  import Footer from "$lib/components/footer.svelte";
  import LighthouseCalendar from "$lib/components/lighthouse/LighthouseCalendar.svelte";
  import LighthouseLogo from "$lib/assets/LighthouseLogo.png";
  import LighthouseWorkspace from "$lib/components/lighthouse/LighthouseWorkspace.svelte";
  import PracticeBar from "./PracticeBar.svelte";
  import { lighthouseStatus } from "$lib/lighthouseStore.js";
  import { browser } from "$app/environment";
  import {
    PRACTICE_UNAVAILABLE,
    applyPracticePreset,
    fetchPracticeEngine,
    fetchPracticeSchedule,
    showSkip,
  } from "$lib/lighthousePractice.js";

  const practiceClient = {
    fetchSchedule: fetchPracticeSchedule,
    fetchEngine: fetchPracticeEngine,
    apply: applyPracticePreset,
    showSkip,
    unavailable: PRACTICE_UNAVAILABLE,
  };

  const currentPage = "products";

  let view = $state("upcoming");
</script>

<svelte:head>
  <title>Lighthouse practice | AI Profile Analysis</title>
</svelte:head>

<div class="app-shell">
  <div class="app-main">
    <Navbar {currentPage} />

    <div class="demo-warning">
      ⚠️ DEMO VERSION: This is an experimental prototype still in development.
      {#if $lighthouseStatus.huggingFaceNotice}
        <span class="hf-line" role="status">{$lighthouseStatus.huggingFaceNotice}</span>
      {/if}
    </div>

    <div class="navbar">
      <div class="nav-content">
        <div class="brand">
          <img class="logo" src={LighthouseLogo} alt="Lighthouse Logo" />
          <div class="nav-titles">
            <h1>Lighthouse practice</h1>
            <p>Team test for the session clock and the GPU</p>
          </div>
        </div>
        <div class="session-tabs" role="tablist" aria-label="Current and past sessions">
          <button
            type="button"
            role="tab"
            aria-selected={view === "upcoming"}
            onclick={() => (view = "upcoming")}
          >
            Current
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "past"}
            onclick={() => (view = "past")}
          >
            Past sessions
          </button>
        </div>
      </div>
    </div>

    {#if browser}
      {#if view === "upcoming"}
        <LighthouseCalendar
          practice
          {practiceClient}
          onUpload={() => (view = "past")}
        >
          {#snippet practiceBar(bar)}
            <PracticeBar view={bar} />
          {/snippet}
          {#snippet practiceExtra(extra)}
            <button
              type="button"
              class="skip"
              onclick={() => extra.choose("fast_forward")}>Fast forward</button
            >
          {/snippet}
        </LighthouseCalendar>
      {:else}
        <LighthouseWorkspace practice {practiceClient} />
      {/if}
    {/if}
  </div>
  <Footer />
</div>

<style>
  .app-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  .app-main {
    flex: 1 0 auto;
  }

  .demo-warning {
    background: var(--blue-color-main, #1b3350);
    color: white;
    border-bottom: 2px solid var(--button-color, #e3b878);
    padding: 0.8rem 1.5rem;
    text-align: center;
    font-weight: 500;
    font-size: 0.95rem;
    font-family: "Outfit", sans-serif;
  }

  .hf-line {
    display: block;
    margin-top: 0.35rem;
    color: #e3b878;
    font-weight: 700;
  }

  .navbar {
    background-color: white;
    border-bottom: 1px solid var(--border-color);
    padding: 0.75rem 0;
    margin-bottom: 2rem;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem 2rem;
    flex-wrap: wrap;
  }

  .session-tabs {
    display: flex;
    gap: 1.25rem;
  }

  .session-tabs button {
    border: 0;
    background: transparent;
    color: #777;
    font: inherit;
    padding: 0.35rem 0;
    border-bottom: 2px solid transparent;
    cursor: pointer;
  }

  .session-tabs button[aria-selected="true"] {
    color: #1b3350;
    border-bottom-color: #1b3350;
    font-weight: 700;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .logo {
    height: 40px;
    width: auto;
  }

  .nav-titles h1 {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1;
  }

  .nav-titles p {
    margin: 0.1rem 0 0;
    font-size: 0.8rem;
    color: #666;
  }

  .skip {
    font: inherit;
    border-radius: 4px;
    padding: 0.7rem 1rem;
    cursor: pointer;
    background: #fff;
    color: #1b3350;
    border: 1px solid #1b3350;
  }

  .skip:hover,
  .skip:focus-visible {
    background: #e8eef6;
  }
</style>
