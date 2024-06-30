<!-- CollapsibleButton.svelte -->
<script>
  export let heading;

  import { GRID_TEMPLATE_ROWS_SHOW_CONTENT } from "$lib/assets/constants/constants.js"; 
  import ChevronDown from "../assets/icons/chevron-down-solid.svelte";
  import ChevronUp from "../assets/icons/angle-up-solid.svelte";

  let open = false;
  let copyButtonClicked = false;

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
  <div class="collapsible" style={open ? GRID_TEMPLATE_ROWS_SHOW_CONTENT : ``}>
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
    appearance: none;
    background-color: var(--button-color);
    border: 1px solid var(--text-color-main);
    border-radius: 0.5rem;
    box-sizing: border-box;
    color: var(--text-color-main);
    cursor: pointer;
    line-height: normal;
    outline: none;
    padding: 1rem 1.5rem;
    text-align: center;
    text-decoration: none;
    transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    width: 100%;
    will-change: transform;
    margin: 0.8rem 0 0 0;
    display: flex;
    justify-content: center;
  }

  .toggle:not(:disabled):hover {
    color: var(--text-color-main);
    background-color: var(--button-color);
    box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
    transform: translateY(-2px);
  }

  .toggle:active {
    box-shadow: none;
    transform: translateY(0);
  }

  .toggle:disabled {
    pointer-events: none;
  }

  .title {
    display: flex;
    flex-direction: row;
    font-family: "Open Sans";
    font-size: 1rem;
    width: 100%;
    padding: 0;
  }

  .dropdown-arrow {
    margin: 0;
    padding: 0;
    position: relative;
    top: 1px;
    width: 1rem;
    height: 1rem;
  }

  .collapsible {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 150ms;
  }

  .collapsible > div {
    overflow: hidden;
  }

  @media (max-device-width: 912px) and (min-resolution: 2dppx) {
    .collapsible-button-container {
      width: 46.5rem;
      margin: 1rem 0 0 0;
    }

    .toggle {
      padding: 1.5rem 1rem;
      margin: 0.3rem 0 0 0;
    }

    .title {
      font-size: 2rem;
      padding: 0 0 0 1rem;
    }

    .dropdown-arrow {
      width: 2rem;
      height: 2rem;
      padding: 0 0.5rem 0 0;
    }
  }
</style>
