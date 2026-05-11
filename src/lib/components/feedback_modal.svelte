<!-- FeedbackModal.svelte -->
<script>
  import { GOOGLE_FORM_URL } from "../assets/constants/constants.js";
  export let showModal;

  const handleModalKeydown = (event) => {
    if (event.key === "Escape") {
      showModal = false;
    }
  };
</script>

<div
  class="modal"
  on:click|self={() => (showModal = false)}
  on:keydown={handleModalKeydown}
  tabindex="-1"
  role="dialog"
  aria-modal="true"
  aria-label="Feedback Modal"
>
  <div class="modal-content">
    <span
      class="modal-close"
      on:click|stopPropagation={() => (showModal = false)}
      on:keydown|stopPropagation={handleModalKeydown}
      tabindex="0"
      role="button"
      aria-label="Close modal">&times;</span
    >
    <iframe src={GOOGLE_FORM_URL} width="100%" height="100%" title="Feedback form"></iframe>
  </div>
</div>

<style>
  .modal {
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

  .modal-content {
    width: 80%;
    height: 80%;
    background-color: var(--text-color-light);
    padding: 20px;
  }

  .modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
</style>
