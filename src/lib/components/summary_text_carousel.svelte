<!-- SummaryTextCarousel.svelte -->
<script>
  import { onMount } from 'svelte';

  let text_index = 0;

  const texts = [
    "Summary | Generating your summary, please wait...",
    "Summary | Hang tight! Your summary is being delivered.",
    "Summary | Good things come to those who wait...",
    "Summary | Almost there! Just a few more moments."
  ];

  onMount(() => {
    const interval = setInterval(() => {
      if (text_index === texts.length - 1) {
        text_index = 0;
      } else {
        text_index++;
      }
    }, 7000);

    // Return a cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="text-carousel">
  <p class="summary-loading">{texts[text_index]}</p>
</div>

<style>
  .summary-loading {
		margin: 0 1rem 0 0;
	}

  @media (max-device-width: 912px) and (min-resolution: 2dppx) {
    .summary-loading {
      font-size: 1.5rem;
    }
  }
</style>