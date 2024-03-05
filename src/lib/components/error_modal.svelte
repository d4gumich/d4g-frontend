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
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
