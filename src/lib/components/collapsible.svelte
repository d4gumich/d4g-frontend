<!-- Collapsible.svelte -->
<script>
  export let heading;
  export let showCopyButton = false;
  export let markdownText = "";
  export let showNotification = null;

  import ChevronDown from "../assets/icons/chevron-down-solid.svelte";
  import ChevronUp from "../assets/icons/angle-up-solid.svelte";
  import CopyIcon from "../assets/icons/copy-solid.svelte";

  let open = false;
  let copyButtonClicked = false;

  $: showContent = `grid-template-rows: 1fr;`;
  $: hideBorder = `border-bottom: .1rem solid white;`;

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
      await navigator.clipboard.writeText(markdownText);
      showNotification();
      // alert("markdown text copied");
    } catch (error) {
      alert("Error copying text, please copy manually")
    }
    
  };
</script>

<div>
  <button class="toggle" style={open ? hideBorder : ``} on:click={handleOpen}>
    <div class="title">
      <div>{heading}</div>
      {#if showCopyButton}
        <button class="copy-button" on:click={copyTextToClipboard}>
          <div class="copy-icon"><CopyIcon /></div>
          <div>copy</div>
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
    background-color: white;
    border-radius: 0;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    padding: 1rem 1rem 1rem 0.1rem;
    position: relative;
    z-index: 3;
    margin: 0;
    cursor: pointer;
    transition: border-bottom 300ms;
  }

  .toggle:hover {
    border-color: #ddd0c8;
  }

  .title {
    display: flex;
    flex-direction: row;
    text-align: left;
    width: 100%;
  }

  .dropdown-arrow {
    text-align: right;
    height: 1rem;
    width: 1rem;
    color: black;
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
    background-color: white;
    border: 0.1rem solid black;
    border-radius: 0.75rem;
    text-align: left;
    align-items: left;
    margin-left: 0.8rem;
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    transition: background-color 500ms;
  }

  .copy-button:hover {
    border-color: #ddd0c8;
    background-color: #ddd0c8;
  }

  .copy-icon {
    height: 0.75rem;
    width: 0.75rem;
    margin-right: 0.25rem;
  }
</style>
