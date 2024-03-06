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
>
  <div class="modal-content">
    <span
      class="modal-close"
      on:click|stopPropagation={() => (showModal = false)}
      on:keydown|stopPropagation={handleModalKeydown}
      tabindex="-1">&times;</span
    >
    <iframe src={GOOGLE_FORM_URL} width="100%" height="100%" title="Feedback form" />
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
  }

  .modal-content {
    width: 80%;
    height: 80%;
    background-color: white;
    padding: 20px;
  }

  .modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
</style>
