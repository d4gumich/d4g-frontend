<script>
  export let text;
  export let link = null;
  export let click = null;
  export let styleAdjustment = null;
</script>

<a href={link} class="global-button" on:click={click} style={styleAdjustment}>
  <div class="text">{text}</div>
</a>

<style>
  .global-button {
    text-decoration: none;
    background-color: #1b3350;
    border-radius: 1rem;
    color: #000;
    cursor: pointer;
    font-weight: bold;
    padding: 1rem 1.5rem;
    text-align: center;
    transition: 200ms;
    width: max-content;
    margin: 0 1rem;
    box-sizing: border-box;
    border: 0;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  .global-button:not(:disabled):hover,
  .global-button:not(:disabled):focus {
    outline: 0;
    background: #1b3350;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2), 0 3px 8px 0 rgba(0, 0, 0, 0.15);
  }

  .global-button:disabled {
    filter: saturate(0.2) opacity(0.5);
    -webkit-filter: saturate(0.2) opacity(0.5);
    cursor: not-allowed;
  }

  .text {
    color: white;
    font-family: "Open Sans";
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    margin: 0;
    padding: 0;
  }

  @media (max-width: 700px) {
    .global-button {
      margin: 0 0.5rem;
      padding: 0.5rem 1rem;
    }
  }
</style>
