<!-- LoadingBar.svelte -->
<script>
  export let progress = 0;

  // Style the progress bar based on the progress value
  $: barStyle = `width: ${progress}%;`;
</script>

<div class="loading-bar">
  <div class="progress" style={barStyle}></div>
</div>

<style>
  .loading-bar {
    width: 100%;
    height: 4px;
    background-color: #f0f0f0;
  }

  .progress {
    height: 100%;
    background-color: #007bff;
    transition: width 0.3s ease;
  }
</style>