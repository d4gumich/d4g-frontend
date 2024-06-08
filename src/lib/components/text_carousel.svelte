<!-- TextCarousel.svelte -->
<script>
  import { onMount } from 'svelte';

  let text_index = 0;

  const texts = [
    "Taking longer than expected, waiting...",
    "Hang tight! We’re getting things ready for you.",
    "Good things come to those who wait... Loading your content.",
    "Almost there! Just a few more moments.",
    "Getting everything set up for you. Please wait a moment.",
  ];

  onMount(() => {
    const interval = setInterval(() => {
      if (text_index === texts.length - 1) {
        text_index = 0;
      } else {
        text_index++;
      }
    }, 5000);

    // Return a cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="text-carousel">
  <p class="text">{texts[text_index]}</p>
</div>

<style>
  .text {
    font-family: "Open Sans";
    margin: 0 0 1.5rem 0;
  }
</style>