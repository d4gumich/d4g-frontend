<script>
  export let text;
  export let link = null;
  export let click = null;
  export let styleAdjustment = null;
</script>

<a href={link} class="global-button" role="button" on:click={click} style={styleAdjustment}>
  <div class="text">{text}</div>
</a>

<style>
.global-button {
  appearance: none;
  background-color: var(--button-color);
  border: 1px solid var(--text-color-main);
  border-radius: 0.5rem;
  box-sizing: border-box;
  color: var(--text-color-main);
  cursor: pointer;
  display: inline-block;
  line-height: normal;
  outline: none;
  padding: 1rem 1.5rem;
  text-align: center;
  text-decoration: none;
  transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: 11rem;
  will-change: transform;
  margin: 0 1rem;
}

.global-button:disabled {
  pointer-events: none;
}

.global-button:hover {
  color: var(--text-color-main);
  background-color: var(--button-color);
  box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
  transform: translateY(-2px);
}

.global-button:active {
  box-shadow: none;
  transform: translateY(0);
}

  .text {
    font-family: "Open Sans";
    font-size: 1rem;
    font-style: normal;
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
