<script>
  import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
  import { onMount } from "svelte";

  import Button from "$lib/components/button.svelte";
  import HangulResult from "../../../lib/components/hangul_result.svelte";
  import PDFLogo from "$lib/assets/icons8-pdf-90.png";
  import HangulLogo from "$lib/assets/hangul2 copy 2.png";
  import LoadingBar from "../../../lib/components/loading_bar.svelte";
  import ConfirmationModal from "../../../lib/components/confirmation_modal.svelte";
  import ErrorModal from "../../../lib/components/error_modal.svelte";
  import CollapsibleButton from "../../../lib/components/collapsible_button.svelte";

  // Specify the URL to the worker script
  GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs";

  const DEFAULT_DROP_TEXT = "Drag & choose single PDF file here";
  const VERSIONS = [1, 2];
  const FORM_URL = "https://forms.gle/n51U4g2K9cafpZUu5";
  const PAGES_TO_TIME_RATIO = 0.9;
  const KEYWORD_NUM = 5;

  let width;
  let file;
  let result;
  let errorType;
  let showPopUp = false;
  let confirmResult;
  let showModal = false;
  let loadingProgress = 0;
  let numberOfPages = 0;
  let verbose = true;
  let hidden = true;
  let version = 2;
  let dropText = DEFAULT_DROP_TEXT;
  let showError = false;
  let showAnalyzeButton = false;
  let analyzing = false;
  let showResults = false;
  let loadingFastPass = false;
  let buttonSytleAdjustment = `padding: 1rem 4.2rem; margin: 0 0.2rem;`;
  let blockSliderStyle = ``;

  $: estimatedTimeToAnalyze = Math.round(PAGES_TO_TIME_RATIO * numberOfPages);
  $: console.log("Estimated Time (s):", estimatedTimeToAnalyze);
  $: loadingTimeRemaining = Math.round(
    estimatedTimeToAnalyze - loadingProgress
  );

  $: console.log("version:", version);

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const updateShowError = (value) => {
    showError = value;
    dropText = DEFAULT_DROP_TEXT;
  };

  async function getNumberOfPages(pdfFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async function (event) {
        const loadingTask = getDocument(new Uint8Array(event.target.result));
        const pdfDocument = await loadingTask.promise;
        resolve(pdfDocument.numPages);
      };

      reader.onerror = function (event) {
        reject(event.target.error);
      };

      reader.readAsArrayBuffer(pdfFile);
    });
  }

  // Simulate asynchronous tasks
  const simulateLoading = () => {
    const interval = setInterval(() => {
      loadingProgress += 0.25;

      if (loadingProgress >= estimatedTimeToAnalyze || !analyzing) {
        console.log("interval cleared");
        clearInterval(interval);
      }
    }, 250);
  };

  $: {
    if (analyzing) {
      onMount(simulateLoading());
    }
  }

  $: {
    if (analyzing) {
      blockSliderStyle = `background-color: #1b3350; box-shadow: -0.2rem -0rem 0.1rem #1b3350;`;
    } else {
      blockSliderStyle = ``;
    }
  }

  $: {
    if (width < 700) {
      buttonSytleAdjustment = `padding: .5rem 1rem; margin: 0 0.2rem;`;
    } else {
      buttonSytleAdjustment = `padding: 1rem 4.2rem; margin: 0 0.2rem;`;
    }
  }

  onMount(() => {
    width = window.innerWidth;

    window.addEventListener("resize", () => {
      width = window.innerWidth;
    });
  });

  async function handleButtonClick() {
    showPopUp = true;
    confirmResult = await new Promise((resolve) => {
      const modalInstance = new ConfirmationModal({
        target: document.body,
        props: {
          estimatedTime: estimatedTimeToAnalyze,
        },
      });
      modalInstance.$on("confirm", (event) => {
        resolve(event.detail);
        showPopUp = false;
        modalInstance.$destroy(); // Destroy the modal instance when closing
      });
    });
    return confirmResult;
  }

  const toggleVersion = (event) => {
    if (analyzing) {
      event.preventDefault();
      console.log("Click blocked because analyzing is true");
    } else {
      if (version === 1) {
        version = 2;
      } else {
        version = 1;
      }
    }
  };

  async function handleFileSelect(event) {
    event.preventDefault();

    dropText = DEFAULT_DROP_TEXT;

    if (event.dataTransfer) {
      file = event.dataTransfer.files[0];
    } else {
      file = event.target.files[0];
    }

    if (file) {
      if (file.type === "application/pdf") {
        showAnalyzeButton = true;
        dropText = file.name;

        try {
          numberOfPages = await getNumberOfPages(file);
        } catch (error) {
          console.error("Error loading PDF:", error);
        }
      } else {
        console.log("Error: file is NOT a PDF");
        dropText = "Please submit a PDF";
        errorType = 0;
        showError = true;
        showAnalyzeButton = false;
      }
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  const handleFeedbackClick = () => {
    showModal = true;
  };

  const handleModalKeydown = (event) => {
    if (event.key === "Escape") {
      showModal = false;
    }
  };

  async function handleAnalyzeClick() {
    let userProceedSelection;
    userProceedSelection = await handleButtonClick();

    if (userProceedSelection) {
      analyzing = true;
      const time = Date.now();
      const form = new FormData();
      form.append("file", file);
      form.append("kw_num", KEYWORD_NUM);
      const response = await fetch(
        `https://d4gumsi.pythonanywhere.com/api/v${version}/products/hangul`,
        {
          method: "POST",
          body: form,
          cors: "cors",
        }
      );
      try {
        result = await response.json();
        console.log(result);
        result.verbose = verbose;
        result.hangul_time = (Date.now() - time) / 1000;
        if (loadingProgress < estimatedTimeToAnalyze) {
          loadingProgress = estimatedTimeToAnalyze;
          loadingFastPass = true;
          console.log("completing loading bar animation");
          await sleep(500);
        }
        hidden = false;
        showResults = true;
        loadingFastPass = false;
        loadingProgress = 0;
      } catch (error) {
        console.log("Could not fetch from d4gumsi.pythonanywhere.com");
        errorType = 1;
        showError = true;
        showAnalyzeButton = false;
      }
      analyzing = false;
    } else {
      goBack(true);
    }
  }

  const goBack = (onHandleAnalyzeClickEnbl) => {
    analyzing = false;
    showResults = false;
    hidden = true;
    loadingProgress = 0;
    dropText = onHandleAnalyzeClickEnbl ? dropText : DEFAULT_DROP_TEXT;
    showAnalyzeButton = onHandleAnalyzeClickEnbl;
  };
</script>

<svelte:head>
  <title>Hangul {version}.0</title>
</svelte:head>

<div class="container">
  {#if !showResults}
    <div class="content-container">
      <img src={HangulLogo} alt="Hangul logo" class="hangul-logo" />
      <div class="text-container">
        <h1 class="text-container-heading">
          Analyze a PDF to find relevant meta and content details
        </h1>
        <p class="text">Welcome to Hangul</p>
        <div class="toggle-container">
          <p
            class="text"
            style={version === VERSIONS[0] ? `font-weight:800;` : ``}
          >
            Hangul {VERSIONS[0]}.0
          </p>
          <label class="switch">
            <input
              type="checkbox"
              on:change={toggleVersion}
              checked={version === 2}
            />
            <span class="slider round" style={blockSliderStyle} />
          </label>
          <p
            class="text"
            style={version === VERSIONS[1] ? `font-weight:800;` : ``}
          >
            Hangul {VERSIONS[1]}.0
          </p>
        </div>
      </div>
    </div>

    <!-- START -->

    {#if showPopUp}
      <ConfirmationModal estimatedTime={estimatedTimeToAnalyze} />
    {/if}
    {#if analyzing}
      <!-- Show loading icon when analyzing is true -->
      <div class="loading-icon">
        {#if loadingTimeRemaining > 0 || loadingFastPass}
          <p class="analyzing-text">
            estimated {loadingTimeRemaining} seconds remaining
          </p>
        {:else}
          <p class="analyzing-text">taking longer than expected, waiting...</p>
        {/if}
        <LoadingBar
          progress={(loadingProgress / estimatedTimeToAnalyze) * 100}
        />
      </div>
    {:else}
      <div
        class="rectangle"
        on:drop|preventDefault={handleFileSelect}
        on:dragover|preventDefault={handleDragOver}
      >
        <img src={PDFLogo} class="pdf-icon" alt="PDF icon" />
        <p class="drop-text">{dropText}</p>
        <input
          type="file"
          accept="application/pdf"
          id="file-input"
          on:change={handleFileSelect}
        />
        {#if showAnalyzeButton}
          <Button
            text="Analyze PDF"
            click={handleAnalyzeClick}
            styleAdjustment="margin-top: 1rem;"
          />
        {/if}
        {#if showError}
          <ErrorModal updateShowErrorFromParent={updateShowError} {errorType} />
        {/if}
      </div>
    {/if}
    {#if !analyzing}
      <div class="button-container-col">
        <div class="button-container-row">
          <Button
            text="View Research"
            link="https://drive.google.com/file/d/1U_wHtC6DtPsfIBXHCeESfQXlDsXe5lHv/view"
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
    {/if}

    {#if showModal}
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
            tabindex="0">&times;</span
          >
          <iframe
            src={FORM_URL}
            width="100%"
            height="100%"
            title="Feedback form"
          />
        </div>
      </div>
    {/if}

    <!-- END -->
  {:else}
    <HangulResult {...result} />
    <Button
      text="Go back"
      click={() => goBack(false)}
      styleAdjustment={`margin: 2rem 0;`}
    />
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .content-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 2rem auto;
    width: auto;
  }

  .hangul-logo {
    width: auto;
    height: 7rem;
    margin: 0;
    padding: 0;
  }

  .text-container {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-left: 2rem;
  }

  .text {
    margin: 0;
    color: black;
    font-family: "Open Sans";
    font-size: 0.9rem;
    font-weight: 400;
    line-height: 25px;
    transition: font-weight 300ms ease-in-out;
  }

  .text-container-heading {
    color: black;
    font-family: "Open Sans";
    font-size: 1.1rem;
    font-weight: 800;
    margin: 0 0 0.2rem 0;
  }

  /* CUT */
  .rectangle {
    width: 50%;
    height: 20rem;
    border: 0.3rem dashed rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    fill: var(--white, #fff);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 0 2rem 0;
  }

  .pdf-icon {
    font-size: 48px;
  }

  .drop-text {
    margin-top: 10px;
    color: rgba(0, 0, 0, 0.5);
    text-align: center;
    font-family: "Open Sans";
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 700;
    line-height: 30.857px; /* 154.285% */
  }

  #file-input {
    font-size: 0.9rem;
    width: 14rem;
  }

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
  }

  /* modal */
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

  /* loading icon */
  .loading-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .analyzing-text {
    font-family: "Open Sans";
    margin: 0 0 1.5rem 0;
  }

  /* switch */

  .toggle-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.5rem 0 0 0;
    border: dashed 0.2rem whitesmoke;
    border-radius: 0.2rem;
    width: max-content;
    padding: 0.5rem 0.7rem;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 2.7rem;
    height: 1.5rem;
    margin: 0 0.5rem;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(237, 236, 236);
    box-shadow: -0.2rem 0.05rem 0.1rem #d7d7d7;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.3rem;
    width: 1.3rem;
    left: -0.1rem;
    bottom: 0.05rem;
    background-color: #1b3350;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    box-shadow: 0.1rem 0rem 0.1rem #1b3350;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(1.25rem);
    -ms-transform: translateX(1.25rem);
    transform: translateX(1.25rem);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 1rem;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  /* file upload button */
  input[type="file"]::file-selector-button {
    border-radius: 4px;
    padding: 0 16px;
    height: 40px;
    cursor: pointer;
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.16);
    box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.05);
    margin-right: 16px;
    transition: background-color 200ms;
  }

  /* file upload button hover state */
  input[type="file"]::file-selector-button:hover {
    background-color: #f3f4f6;
  }

  /* file upload button active state */
  input[type="file"]::file-selector-button:active {
    background-color: #e5e7eb;
  }

  @media (max-width: 700px) {
    .text-container-heading {
      font-size: 0.9rem;
      width: 90%;
    }

    .drop-text {
      font-size: 1rem;
    }

    #file-input {
      font-size: 0.8rem;
      width: 11rem;
    }

    input[type="file"]::file-selector-button {
      border-radius: 4px;
      padding: 0 0.5rem;
      height: 2rem;
      margin-right: 0.5rem;
    }

    .text {
      font-size: 0.8rem;
    }

    .rectangle {
      width: 80%;
    }
  }
</style>
