<script>
  import Navbar from "$lib/components/navbar.svelte";
  import AIBanner from "$lib/components/AIBanner.svelte";
  import LighthouseCalendar from "$lib/components/lighthouse/LighthouseCalendar.svelte";
  import Console from "$lib/components/lighthouse/Console.svelte";
  import LighthouseLogo from "$lib/assets/LighthouseLogo.png";
  import LighthousePastSessions from "$lib/components/lighthouse/LighthousePastSessions.svelte";
  import LighthouseWorkspace from "$lib/components/lighthouse/LighthouseWorkspace.svelte";
  import { aiActions, aiStatus } from "$lib/aiSetupStore.js";
  import { sessionIsJoined } from "$lib/lighthouseSchedule.js";
  import {
    scheduleState,
    watchSchedule,
  } from "$lib/lighthouseScheduleStore.js";
  import { browser } from "$app/environment";
  import { onDestroy, onMount } from "svelte";
  import { base } from "$app/paths";

  const currentPage = "products";

  let view = $state("upcoming");
  let byokMode = $derived(
    $aiStatus.status === "active" &&
      $aiStatus.key_source === "personal" &&
      !$aiStatus.forceTeamKey,
  );
  let joined = $derived(
    sessionIsJoined($scheduleState.payload, $scheduleState.held),
  );
  let showWorkspace = $derived(byokMode || joined);

  onMount(() => {
    document.body.classList.add("has-system-console");
    if (browser) aiActions.fetchStatus();
    return watchSchedule();
  });

  onDestroy(() => {
    if (browser) document.body.classList.remove("has-system-console");
  });
</script>

<svelte:head>
  <title>Lighthouse | AI Profile Analysis</title>
  <link rel="stylesheet" href="{base}/lighthouse.css" />
</svelte:head>

<Navbar {currentPage} />
<AIBanner variant="lighthouse" productName="Lighthouse" />

<div class="demo-warning">
  ⚠️ DEMO VERSION: This is an experimental prototype still in development.
</div>

<div class="navbar">
  <div class="nav-content">
    <div class="brand">
      <img class="logo" src={LighthouseLogo} alt="Lighthouse Logo" />
      <div class="nav-titles">
        <h1>Lighthouse</h1>
        <p>High-Fidelity AI Profile Analysis</p>
      </div>
    </div>
    {#if !showWorkspace}
      <div class="session-tabs" role="tablist" aria-label="Lighthouse sessions">
        <button
          type="button"
          role="tab"
          aria-selected={view === "upcoming"}
          onclick={() => (view = "upcoming")}
        >
          Upcoming
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
    {/if}
  </div>
</div>

{#if browser}
  {#if showWorkspace}
    <LighthouseWorkspace source={byokMode ? "personal" : "team"} />
  {:else if view === "upcoming"}
    <LighthouseCalendar />
  {:else}
    <LighthousePastSessions />
  {/if}
{/if}

<Console />

<style>
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
    margin: 0.1rem 0 0 0;
    font-size: 0.8rem;
    color: #666;
  }

  @media (max-width: 800px) {
    .navbar {
      margin-bottom: 0.75rem;
      padding: 0.5rem 0;
    }

    .nav-content {
      padding: 0 1rem;
    }
  }
</style>
