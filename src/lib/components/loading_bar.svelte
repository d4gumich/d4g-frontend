<!-- LoadingBar.svelte -->
<script>
  export let progress = 0;

  // Style the progress bar based on the progress value
  $: barStyle = `width: ${progress}%; border-radius: 1rem;`;
</script>

<div class="loading-bar">
  <div class="progress" style={barStyle}></div>
</div>

<style>
  .loading-bar {
    width: 20rem;
    background-color: #f0f0f0;
    border-radius: 1rem;
    overflow: hidden;
    margin-bottom: 3rem;
  }

  .progress {
    width: 0%;
    height: 0.5rem;
    background-color: #1b3350;
    transition: width 0.3s ease;
    border-radius: 1rem;
  }
</style>