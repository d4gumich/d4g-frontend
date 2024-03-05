<!-- ConfirmationModal.svelte -->
<script>
  export let estimatedTime;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function handleConfirmation(confirm) {
    dispatch("confirm", confirm);
  }
</script>

<div class="modal-overlay">
  <div class="modal">
    <p class="text-prompt">
      The file will take an estimated <b
        >{estimatedTime} second{estimatedTime !== 1 ? "s" : ""}</b
      > to analyze.
    </p>
    <p class="text-prompt">Do you want to proceed?</p>
    <div class="button-section">
      <button class="small-button" on:click={() => handleConfirmation(true)}
        >Yes</button
      >
      <button class="small-button" on:click={() => handleConfirmation(false)}
        >No</button
      >
    </div>
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
    background-color: white;
    padding: 2rem;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Open Sans;
  }

  .small-button {
    padding: 0.3rem 1rem;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    background: #1b3350;
    color: white;
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
    background: #1b3350;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2), 0 3px 8px 0 rgba(0, 0, 0, 0.15);
  }

  .small-button:disabled {
    filter: saturate(0.2) opacity(0.5);
    -webkit-filter: saturate(0.2) opacity(0.5);
    cursor: not-allowed;
  }

  .button-section {
    margin-top: 1.2rem;
  }

  .text-prompt {
    font-size: 1rem;
    margin: 0.1rem;
  }

  @media (max-width: 700px) {
    .modal {
      padding: 1rem;
    }

    .text-prompt {
      font-size: 0.8rem;
    }

    .small-button {
      font-size: 0.8rem;
    }
  }
</style>
