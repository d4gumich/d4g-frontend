<script>
  import Navbar from "$lib/components/navbar.svelte";
  import LighthouseControl from "$lib/components/lighthouse/LighthouseControl.svelte";
  import LighthouseCalendar from "$lib/components/lighthouse/LighthouseCalendar.svelte";
  import Console from "$lib/components/lighthouse/Console.svelte";
  import { lighthouseActions, lighthouseStatus } from "$lib/lighthouseStore.js";
  import LighthouseLogo from "$lib/assets/LighthouseLogo.png";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { base } from "$app/paths";
  import { page } from "$app/stores";

  const currentPage = "products";

  let secretKey = $state(null);
  let sessionActive = $derived($lighthouseStatus.sessionActive);

  onMount(async () => {
    if (browser) {
      secretKey = $page.url.searchParams.get("key");
      await lighthouseActions.fetchStatus(true);
    }
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
  </div>
</div>

{#if browser}
  <LighthouseCalendar />
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
