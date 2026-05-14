<script>
  let { text, link = null, click = null, styleAdjustment = null } = $props();
</script>

{#if link}
  <a href={link} class="global-button" role="button" style={styleAdjustment}>
    <p class="text">{text}</p>
  </a>
{:else}
  <button class="global-button" onclick={click} style={styleAdjustment} type="button">
    <p class="text">{text}</p>
  </button>
{/if}

<style>
  .global-button {
    background-color: var(--button-color);
    color: var(--text-color-main);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    cursor: pointer;
    box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.05);
    border: none;
    font-family: "Open Sans";
    height: fit-content;
    transition: all 0.2s ease;
  }

  .global-button:hover {
    background-color: var(--button-color-hover, #d4a76a);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  .text {
    margin: 0;
    font-weight: 500;
  }

  @media (max-device-width: 912px) and (min-resolution: 2dppx) {

    .global-button {
      width: 20rem;
      padding: 1.5rem 2rem;
    }

    .text {
      font-size: 2rem;
      font-weight: 200;
    }
  }
</style>
