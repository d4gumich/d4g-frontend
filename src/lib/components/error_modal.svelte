<!-- ErrorModal.svelte -->
<script>
  export let updateShowErrorFromParent;
  export let errorType;

  const text = [
    "File upload must be a PDF. Please try again.",
    'Something went wrong. Could not contact hangul server. Please try again. If the issue persists try a different document and inform us of the issue using the "Provide Feedback" button.',
  ];

  function handleClick() {
    updateShowErrorFromParent(false);
  }
</script>

<div class="modal-overlay">
  <div class="modal">
    <p class="text-prompt">{text[errorType]}</p>
    <button class="small-button" on:click={handleClick}>OK</button>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    max-width: 30rem;
    background-color: var(--text-color-light);
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-family: Open Sans;
  }

  .small-button {
    padding: 0.3rem 1rem;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    background: var(--button-color);
    color: var(--text-color-main);
    margin: 0 0.1rem;
    font-size: 1rem;
    transition: 200ms;
    box-sizing: border-box;
    border: 0;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  .small-button:not(:disabled):hover,
  .small-button:not(:disabled):focus {
    outline: 0;
    background: var(--button-color);
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.8), 0 3px 8px 0 rgba(0, 0, 0, 0.8);
  }

  .small-button:disabled {
    filter: saturate(0.2) opacity(0.5);
    -webkit-filter: saturate(0.2) opacity(0.5);
    cursor: not-allowed;
  }

  .text-prompt {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }

  @media (max-device-width: 912px) and (min-resolution: 2dppx) {
    .modal-overlay {
      top: -200px;
    }
    
    .modal {
      padding: 5rem 2rem;
      max-width: 90vw;
    }

    .text-prompt {
      font-size: 2rem;
      text-align: center;
      margin: 0.5rem 0;
    }

    .small-button {
      font-size: 2rem;
      padding: 1rem 2rem;
      margin: 0.5rem 0.8rem;
    }
  }
</style>
