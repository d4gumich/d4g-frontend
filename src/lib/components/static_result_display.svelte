<!-- StaticResultDisplay.svelte -->
<script>
  export let heading;
  export let styleAdjustment = ``;
  export let headingFontSize = null;
  export let isValid = false;
  export let useCheckMark = false;

  import CheckMark from "svelte-material-icons/CheckCircle.svelte";
  import FailAlert from "svelte-material-icons/MessageAlert.svelte";
  import { PHONE_SCREEN_WIDTH } from "$lib/assets/constants/constants.js";
  import { onMount } from "svelte";

  let isMobile = false;
  let screenWidth;
  let headingFontSizeDefault;

  $: {
    if (headingFontSize == null) {
      headingFontSizeDefault = isMobile ? `font-size: 2rem;`: `font-size: 1.1rem;`
    } else {
      headingFontSizeDefault = headingFontSize;
    }
  }

  onMount(() => {
    if (typeof window !== 'undefined') {
      screenWidth = window.screen.width
    }

    if (screenWidth <= PHONE_SCREEN_WIDTH) {
      isMobile = true
    }
    else {
      isMobile = false
    }
  })
</script>

<div style={styleAdjustment}>
  <div class="toggle">
    <div class="title">
      <div style={headingFontSizeDefault}>{heading}</div>
      {#if useCheckMark}
        <div class="check-mark-spacer"></div>
      {/if}
      {#if isValid && useCheckMark}
        {#if isMobile}
          <CheckMark size={"2rem"} color="#34b233" />
        {/if}
        {#if !isMobile}
          <CheckMark size={"0.9rem"} color="#34b233" />
        {/if}
      {/if}
      {#if !isValid && useCheckMark}
        {#if isMobile}
          <FailAlert size={"2rem"} color="tomato" />
        {/if}
        {#if !isMobile}
          <FailAlert size={"0.9rem"} color="tomato" />
        {/if}
      {/if}
    </div>
    <div class="result-text">
      <slot name="text" />
    </div>
  </div>
</div>

<style>
  .toggle {
    display: flex;
    flex-direction: row;
    text-align: center;
    align-items: center;
    justify-content: center;
    width: 100%;
    border: none;
    border-bottom: 0.1rem solid black;
    background-color: var(--text-color-light);
    border-radius: 0;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    padding: 1rem 0 1rem 0.1rem;
    position: relative;
    z-index: 3;
    margin: 0;
    cursor: pointer;
    transition: border-bottom 300ms;
  }

  .toggle:hover {
    border-color: var(--background-color-dark);
  }

  .title {
    display: flex;
    flex-direction: row;
    text-align: left;
    align-items: center;
    width: 100%;
    font-family: "Open Sans";
  }

  .result-text {
    text-align: center;
    justify-content: center;
    height: 1rem;
    width: max-content;
    color: var(--text-color-main);
  }

  .check-mark-spacer {
    width: 0.25rem;
    height: auto;
  }

  @media (max-device-width: 912px) and (min-resolution: 2dppx) {
    .toggle {
      padding: 2rem 1rem 2rem 0.5rem;
    }

    .title {
      font-size: 2rem;
    }

    .result-text {
      font-size: 2rem;
    }
  }
</style>
