<script>
  import Navbar from "$lib/components/navbar.svelte";
  import LighthouseControl from "$lib/components/lighthouse/LighthouseControl.svelte";
  import LighthouseCalendar from "$lib/components/lighthouse/LighthouseCalendar.svelte";
  import Console from "$lib/components/lighthouse/Console.svelte";
  import { lighthouseActions, lighthouseStatus } from "$lib/lighthouseStore.js";
  import LighthouseLogo from "$lib/assets/LighthouseLogo.png";
  import LighthousePastSessions from "$lib/components/lighthouse/LighthousePastSessions.svelte";
  import { browser } from "$app/environment";
  import { onDestroy, onMount } from "svelte";
  import { base } from "$app/paths";
  import { page } from "$app/stores";

  const currentPage = "products";

  let secretKey = $state(null);
  let sessionActive = $derived($lighthouseStatus.sessionActive);
  let view = $state("upcoming");

  onMount(async () => {
    document.body.classList.add("has-system-console");
    if (browser) {
      secretKey = $page.url.searchParams.get("key");
      await lighthouseActions.fetchStatus(true);
    }
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
  </div>
</div>

{#if browser}
  {#if view === "upcoming"}
    <LighthouseCalendar />
  {:else}
    <LighthousePastSessions />
  {/if}
  {#if (secretKey && secretKey.length >= 5) || sessionActive}
    <div class="engine-wrap">
      <LighthouseControl />
    </div>
  {/if}
{/if}

<Console />

<style>
  .engine-wrap {
    max-width: 720px;
    margin: 0 auto 2rem;
    padding: 0 1rem;
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
    margin: 0.1rem 0 0 0;
    font-size: 0.8rem;
    color: #666;
  }
</style>
