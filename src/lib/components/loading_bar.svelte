<!-- LoadingBar.svelte -->
<script>
  import { sleep } from "$lib/components/utils/helper_functions.js";
  export let progress = 0;

  let barStyle = ``;
  let progressClass = ``;
  let slept = false;

  async function handleProgress() {
    if (progress >= 100) {
      if (!slept) {
        await sleep(500);
        slept = true;
      }
      progressClass = 'completed';
    } else {
      slept = false;
    }
  }

  $: {
    barStyle = `width: ${progress}%;`;
    handleProgress();
  }
</script>

<div class="loading-bar">
  <div class={`progress ${progressClass}`} style={barStyle}></div>
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

  .completed {
    animation: pulse 4s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.3;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
}
</style>