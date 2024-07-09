<!-- Collapsible.svelte -->
<script>
  export let heading;
  export let showCopyButton = false
  export let textToCopy = ""
  export let showNotification = null
  export let styleAdjustment = ``
  export let headingFontSize = null;
  export let runOpenSequence = false;
  export let isValid = false;
  export let useCheckMark = false;

  import ChevronDown from "../assets/icons/chevron-down-solid.svelte";
  import ChevronUp from "../assets/icons/angle-up-solid.svelte";
  import CopyIcon from "../assets/icons/copy-solid.svelte";
  import { sleep } from "$lib/components/utils/helper_functions.js";
  import { onMount } from "svelte";
  import CheckMark from "svelte-material-icons/CheckCircle.svelte";
  import FailAlert from "svelte-material-icons/MessageAlert.svelte";
  import { PHONE_SCREEN_WIDTH } from "$lib/assets/constants/constants.js"

  let copyButtonClicked = false;
  let open = false;
  let isMobile = false;
  let screenWidth;
  let headingFontSizeDefault;

  $: showContent = `grid-template-rows: 1fr;`;
  $: hideBorder = `border-bottom: .1rem solid white;`;

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

  onMount(async () => {
    if (runOpenSequence) {
      await sleep(1000);
      open = true;
    }
  });

  const handleOpen = () => {
    if (copyButtonClicked === false) {
      open = !open;
    } else {
      copyButtonClicked = false;
    }
  };

  async function copyTextToClipboard() {
    copyButtonClicked = true;
    try {
      await navigator.clipboard.writeText(textToCopy);
      showNotification();
      // alert("markdown text copied");
    } catch (error) {
      alert("Error copying text, please copy manually")
    }
    
  };
</script>

<div style={styleAdjustment}>
  <button class="toggle" style={open ? hideBorder : ``} on:click={handleOpen}>
    <div class="title">
      <div style={headingFontSizeDefault}>{heading}</div>
      {#if useCheckMark}
        <div class="check-mark-spacer"></div>
      {/if}
      {#if isValid && useCheckMark}
        {#if isMobile}
          <CheckMark size="2rem" color="#34b233" />
        {:else}
          <CheckMark size="0.95rem" color="#34b233" />
        {/if}
      {/if}
      {#if !isValid && useCheckMark}
        {#if isMobile}
          <FailAlert size="2rem" color="tomato" />
        {:else}
          <FailAlert size="0.95rem" color="tomato" />
        {/if}
      {/if}
      {#if showCopyButton}
        <button class="copy-button" on:click={copyTextToClipboard}>
          <div class="copy-icon"><CopyIcon /></div>
          <div class="copy-text">copy</div>
        </button>
      {/if}
    </div>
    <div class="dropdown-arrow">
      {#if open}
        <ChevronUp />
      {:else}
        <ChevronDown />
      {/if}
    </div>
  </button>
  <div class="collapsible" style={open ? showContent : ``}>
    <div>
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
    width: 100%;
    border: none;
    border-bottom: 0.1rem solid black;
    background-color: var(--text-color-light);
    border-radius: 0;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 500;
    padding: 1rem 1rem 1rem 0.1rem;
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
    color: var(--text-color-main);
  }

  .dropdown-arrow {
    text-align: right;
    height: 1rem;
    width: 1rem;
    color: var(--text-color-main);
  }

  .collapsible {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 150ms;
  }

  .collapsible > div {
    overflow: hidden;
  }

  .copy-button {
    display: flex;
    flex-direction: row;
    background-color: var(--text-color-light);
    border: 0.1rem solid  var(--background-color-dark);
    border-radius: 0.5rem;
    justify-content: center;
    text-align: center;
    align-items: center;
    margin-left: 0.8rem;
    padding: 0.35rem 0.7rem;
    cursor: pointer;
    transition: all 300ms ease;
  }

  .copy-button:hover {
    background-color: var(--button-color);
  }

  .copy-icon {
    height: 0.75rem;
    width: 0.75rem;
    margin-right: 0.25rem;
  }

  .copy-text {
    font-size: 0.75rem;
    font-weight: 500;
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
      font-weight: 200;
    }

    .dropdown-arrow {
      height: 2.5rem;
      width: 2.5rem;
    }

    .copy-button {
      font-size: 1.5rem;
      margin-left: 1rem;
      padding: 0.2rem 0.5rem;
      cursor: pointer;
      transition: all 300ms ease;
    }

    .copy-text {
      font-size: 1.5rem;
    }
  }
</style>
