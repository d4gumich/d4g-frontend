<!-- ConfirmationModal.svelte -->
<script>
  export let pages;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function handleConfirmation(confirm) {
    dispatch("confirm", confirm);
  }
</script>

<div class="modal-overlay">
  <div class="modal">
    <p class="text-prompt">
      The file is <b>{pages} pages</b> long. Do you want to proceed?
    </p>
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
    border: none;
    background: #1b3350;
    color: #faefef;
    margin: 0 0.1rem;
    font-size: 0.9rem;
  }

  .small-button:hover {
    background: #30598b;
  }

  .text-prompt {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }
</style>
