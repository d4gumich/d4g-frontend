<!-- LoadingBar.svelte -->
<script>
  export let progress = 0;
  export let barWidth = `20rem`;
  import { sleep } from "$lib/components/utils/helper_functions.js";
  

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
      progressClass = ``;
    }
  }

  $: {
    barStyle = `width: ${progress}%;`;
    handleProgress();
  }
</script>

<div class="loading-bar" style={`width: ${barWidth};`}>
  <div class={`progress ${progressClass}`} style={barStyle}></div>
</div>

<style>
  .loading-bar {
    width: 0;
    background-color: #f0f0f0;
    border-radius: 1rem;
    overflow: hidden;
    margin: 0;
  }

  .progress {
    width: 0%;
    height: 0.5rem;
    background-color: var(--button-color);
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

  @media (max-device-width: 912px) and (min-resolution: 2dppx) {
    .loading-bar {
      width: 0;
      background-color: #f0f0f0;
      border-radius: 1rem;
      overflow: hidden;
      margin: 0;
    }

    .progress {
      width: 0%;
      height: 1rem;
      background-color: var(--button-color);
      transition: width 0.3s ease;
      border-radius: 1rem;
    }
  }
</style>