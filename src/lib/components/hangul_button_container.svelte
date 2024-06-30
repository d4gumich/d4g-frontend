<!-- HangulButtonContainer.svelte -->
<script>
  import { HANGUL_CURATION_ASSISTANT_PDF_LINK, PHONE_SCREEN_WIDTH } from "$lib/assets/constants/constants.js";
  import CollapsibleButton from "./collapsible_button.svelte";
  import Button from "./button.svelte";

  export let showModal;
  export let width;

  let buttonSytleAdjustment = `padding: 1rem 0; margin: 0 0.2rem; width: 15.7rem;`;

  $: {
    if (width < PHONE_SCREEN_WIDTH) {
      buttonSytleAdjustment = `padding: 1.5rem 2rem; margin: 0 0.2rem; width: 23rem;`;
    } else {
      buttonSytleAdjustment = `padding: 1rem 0; margin: 0 0.2rem; width: 15.7rem;`;
    }
  }

  const handleFeedbackClick = () => {
    showModal = true;
  }
</script>

<div class="button-container-col">
  <div class="button-container-row">
    <Button
      text="View Research"
      link={HANGUL_CURATION_ASSISTANT_PDF_LINK}
      styleAdjustment={buttonSytleAdjustment}
    />
    <Button
      text="Provide Feedback"
      click={handleFeedbackClick}
      styleAdjustment={buttonSytleAdjustment}
    />
  </div>
  <CollapsibleButton heading="About Hangul">
    <div slot="text" class="about-hangul-text">
      <p style={`margin:0;`}>
      Hangul is an NLP-based assistant for digital curators at ReliefWeb
      envisioned to enable them to handle three to four times the
      number of documents currently being processed. Once a text PDF is
      uploaded to the platform, relevant metadata is extracted from it.
      </p>
      <p>
      Current metadata includes the document title, the date the document
      was published and modified, the number of pages in the document, the word length
      of the document, the language of the document, and the entities in
      the document. More complex features like extraction of abstract,
      conclusion, executive summary, and recognizing the theme (cluster) of
      the document are also in scope.
      </p>
    </div>
  </CollapsibleButton>
</div>

<style>
  .about-hangul-text {
    font-family: "Open Sans";
    font-size: 0.9rem;
    padding: 1rem 0.9rem 0 1.2rem;
  }

  .button-container-row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .button-container-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 3rem;
    width: 100%;
  }

  @media (max-device-width: 912px) and (min-resolution: 2dppx) {
    .about-hangul-text {
      font-size: 2rem;
    }

    .button-container-row {

    }

    .button-container-col {
      width: 100%;
    }
  }
</style>