<script>
  import Navbar from "$lib/components/navbar.svelte";
  import Footer from "$lib/components/footer.svelte";
</script>

<div class="app-shell">
  <div class="app-main">
    <!-- <Navbar {currentPage} /> -->
    <slot />
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
</style>
