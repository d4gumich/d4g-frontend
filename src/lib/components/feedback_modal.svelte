<!-- FeedbackModal.svelte -->
<script>
  import { GOOGLE_FORM_URL } from "../assets/constants/constants.js";
  let { showModal = $bindable() } = $props();

  const handleClose = () => {
    showModal = false;
  };

  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      handleClose();
    }
  };
</script>

<div
  class="modal-overlay"
  onclick={handleClose}
  onkeydown={handleKeydown}
  role="button"
  tabindex="0"
  aria-label="Close modal"
>
  <div class="modal-content" role="dialog" aria-modal="true" aria-label="Feedback Modal" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} tabindex="-1">
    <span
      class="modal-close"
      onclick={handleClose}
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === 'Enter' && handleClose()}
      aria-label="Close modal">&times;</span
    >
    <iframe src={GOOGLE_FORM_URL} width="100%" height="100%" title="Feedback form"></iframe>
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

  .modal-content {
    width: 80%;
    height: 80%;
    background-color: var(--text-color-light);
    padding: 20px;
    position: relative;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .modal-close {
    position: absolute;
    top: 10px;
    right: 15px;
    cursor: pointer;
    font-size: 1.5rem;
    color: #666;
  }
  
  .modal-close:hover {
    color: #000;
  }
</style>
