<!-- CollapsibleButton.svelte -->
<script>
  export let heading;

  import ChevronDown from "../assets/icons/chevron-down-solid.svelte";
  import ChevronUp from "../assets/icons/angle-up-solid.svelte";

  let open = false;
  let copyButtonClicked = false;

  $: showContent = `grid-template-rows: 1fr;`;

  const handleOpen = () => {
    if (copyButtonClicked === false) {
      open = !open;
    } else {
      copyButtonClicked = false;
    }
  };
</script>

<div class="collapsible-button-container">
  <button class="toggle" on:click={handleOpen}>
    <div class="title">{heading}</div>
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
  .collapsible-button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 32rem;
  }

  .toggle {
    display: flex;
    flex-direction: row;
    align-items: center;
    text-decoration: none;
    width: 100%;
    background-color: #1b3350;
    border-radius: 1rem;
    color: white;
    cursor: pointer;
    font-weight: bold;
    padding: 1rem 1.5rem;
    text-align: center;
    transition: 200ms;
    margin: 1rem 0 0 0;
    box-sizing: border-box;
    border: 0;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  .toggle:not(:disabled):hover,
  .toggle:not(:disabled):focus {
    outline: 0;
    background: #1b3350;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2), 0 3px 8px 0 rgba(0, 0, 0, 0.15);
  }

  .toggle:disabled {
    filter: saturate(0.2) opacity(0.5);
    -webkit-filter: saturate(0.2) opacity(0.5);
    cursor: not-allowed;
  }

  .title {
    display: flex;
    flex-direction: row;
    font-family: "Open Sans";
    font-size: 1rem;
    width: 100%;
  }

  .dropdown-arrow {
    height: 1.1rem;
    width: 1.1rem;
    margin-left: 0.5rem;
    fill: white;
  }

  .collapsible {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 150ms;
  }

  .collapsible > div {
    overflow: hidden;
  }

  @media (max-width: 700px) {
    .collapsible-button-container {
      width: 16.5rem;
    }

    .toggle {
      padding: 0.5rem 1rem;
      margin: 0.3rem 0 0 0;
    }

    .title {
      font-size: 0.8rem;
    }
  }
</style>
