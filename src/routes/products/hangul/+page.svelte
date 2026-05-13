<script>
  import {
    PDF_WORKER_SRC_URL,
    DEFAULT_DROP_TEXT,
    INTERVAL,
    SECONDS_TO_MILLISECONDS,
    MILLISECONDS_TO_SECONDS,
    TIMEOUT_BUFFER,
    SUMMARY_API_CALL_DELAY,
    BYTES_TO_MB
  } from "$lib/assets/constants/constants.js";
  import { sleep, calculateEstimatedTime } from "$lib/components/utils/helper_functions.js";
  import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { fetchDataWithTimeout } from "$lib/components/utils/fetch_hangul_data.js";
  import { writable } from "svelte/store";
  import { checkboxes } from "$lib/store.js";
  import { aiStatus, aiActions } from '$lib/aiSetupStore.js';

  import Button from "$lib/components/button.svelte";
  import HangulResult from "$lib/components/hangul_result.svelte";
  import PDFLogo from "$lib/assets/icons8-pdf-90.png";
  import HangulLogo from "$lib/assets/hangul2 copy 2.png";
  import LoadingBar from "$lib/components/loading_bar.svelte";
  import ConfirmationModal from "$lib/components/confirmation_modal.svelte";
  import ErrorModal from "$lib/components/error_modal.svelte";
  import Toggle from "$lib/components/toggle.svelte";
  import FeedbackModal from "$lib/components/feedback_modal.svelte";
  import HangulButtonContainer from "$lib/components/hangul_button_container.svelte";
  import TextCarousel from "$lib/components/text_carousel.svelte";
  import Navbar from "$lib/components/navbar.svelte";
  import AIBanner from "$lib/components/AIBanner.svelte";

  const currentPage = 'hangul';
  const numberOfPages = writable(0);
  const size = writable(0);

  if (browser) {
    GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC_URL;
  }

  let width = $state(1000);
  let file = $state(null);
  let result = $state(null);
  let summary_result = $state(null);
  let errorType = $state(0);
  let showPopUp = $state(false);
  let resolveConfirm = $state(null);
  let showModal = $state(false);
  let loadingProgressMain = $state(0);
  let verbose = $state(true);
  let hidden = $state(true);
  let version = $state(2);
  let dropText = $state(DEFAULT_DROP_TEXT);
  let fileName = $state("N/A");
  let showError = $state(false);
  let showAnalyzeButton = $state(false);
  let analyzing = $state(false);
  let showResults = $state(false);
  let loadingFastPass = $state(false);
  let showAISetup = $state(false);

  // Use $derived for values that depend on other state
  let loadingTimeRemaining = $derived(Math.round(60 - loadingProgressMain));
  let estimatedTimeToAnalyze = 60;

  const updateShowError = (value) => {
    showError = value;
    goBack(false);
  }

  async function getDocumentPagesAndSize(pdfFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async function (event) {
        const loadingTask = getDocument(new Uint8Array(event.target.result));
        const pdfDocument = await loadingTask.promise;
        resolve({
          page_count_: pdfDocument.numPages,
          size_: pdfFile.size // size in bytes
        });
      };

      reader.onerror = function (event) {
        reject(event.target.error);
      };

      reader.readAsArrayBuffer(pdfFile);
    });
  }

  const simulateLoadingMainBar = () => {
    const interval = setInterval(() => {
      loadingProgressMain += (INTERVAL * MILLISECONDS_TO_SECONDS);

      if (loadingProgressMain >= estimatedTimeToAnalyze || !analyzing) {
        console.log("main interval cleared");
        clearInterval(interval);
      }
    }, INTERVAL);
  };

  function selectAll() {
    checkboxes.update(items => 
      items.map(checkbox => ({ ...checkbox, checked: true }))
    );
  }

  $effect(() => {
    if (analyzing) {
      simulateLoadingMainBar();
    }
  });

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  onMount(() => {
    if (browser) {
      width = window.innerWidth;
    }
    selectAll();
    aiActions.fetchStatus();
  });

  async function handleButtonClick() {
    showPopUp = true;
    return new Promise((resolve) => {
      resolveConfirm = resolve;
    });
  }

  function onConfirm(resultValue) {
    showPopUp = false;
    if (resolveConfirm) resolveConfirm(resultValue);
    resolveConfirm = null;
  }

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
          getDocumentPagesAndSize(file).then(({ page_count_, size_ }) => {
            numberOfPages.set(page_count_);
            size.set((size_ * BYTES_TO_MB).toFixed(2));
          });
          fileName = dropText.replace(/\.pdf$/, '');
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

  async function handleAnalyzeClick() {
    if ($aiStatus.status !== 'active') {
      showAISetup = true;
      return;
    }

    let userProceedSelection;
    userProceedSelection = await handleButtonClick();

    if (userProceedSelection) {
      analyzing = true;
      const main_start_time = Date.now();

      try {
        result = await fetchDataWithTimeout(file, version, (estimatedTimeToAnalyze*SECONDS_TO_MILLISECONDS + TIMEOUT_BUFFER), false);
        if (result && result.error) {
          throw new Error(result.error);
        }
        
        if (result !== null) {
          console.log('Result:',result);
        }
        result.verbose = verbose;
        result.hangul_time = Math.round((Date.now() - main_start_time) * MILLISECONDS_TO_SECONDS * 100) / 100;
        result.fileName = fileName;
        result.version = version;
        result.document_size = $size;
        if (loadingProgressMain < estimatedTimeToAnalyze) {
          loadingProgressMain = estimatedTimeToAnalyze;
          loadingFastPass = true;
          console.log("completing loading bar animation");
          await sleep(500);
        }
        hidden = false;
        showResults = true;
        loadingFastPass = false;

      } catch (error) {
        console.error("Could not fetch from d4gumsi.pythonanywhere.com", error);
        const errorMsg = error.message || "Engine Error";
        if (errorMsg.includes("API key expired") || errorMsg.includes("400") || errorMsg.includes("401")) {
          aiActions.setError(true, "API Key Expired/Invalid");
        } else {
          aiActions.setError(true, "Analysis Failed");
        }
        goBack(true);
        errorType = 1;
        showError = true;
      }
      loadingProgressMain = 0;
      analyzing = false;
    } else {
      goBack(true);
    }
  }

  const goBack = (onHandleAnalyzeClickEnbl) => {
    analyzing = false;
    showResults = false;
    hidden = true;
    loadingProgressMain = 0;
    dropText = onHandleAnalyzeClickEnbl ? dropText : DEFAULT_DROP_TEXT;
    showAnalyzeButton = onHandleAnalyzeClickEnbl;
  };
</script>

<svelte:head>
  <title>Hangul {version}.2</title>
</svelte:head>

<Navbar {currentPage} />
<AIBanner />
<div class="container">
  {#if !showResults}
    <div class="content-container">
      <img src={HangulLogo} alt="Hangul Logo" class="hangul-logo" />
      <div class="text-container">
        <h1 class="text-container-heading">
          Analyze a PDF to find relevant meta and content details
        </h1>
        <p class="text">Welcome to Hangul</p>
        <Toggle bind:version {analyzing} {width} />
      </div>
    </div>

    {#if showPopUp}
      <ConfirmationModal estimatedTime={estimatedTimeToAnalyze} onConfirm={onConfirm} />
    {/if}

    {#if showError}
      <ErrorModal updateShowErrorFromParent={updateShowError} {errorType} />
    {/if}

    {#if analyzing}
      <div class="loading-icon">
        {#if loadingTimeRemaining > 0 || loadingFastPass}
          <p class="analyzing-text">
            estimated {loadingTimeRemaining} seconds remaining
          </p>
        {:else}
          <TextCarousel />
        {/if}
        <LoadingBar
          progress={(loadingProgressMain / estimatedTimeToAnalyze) * 100}
        />
        <div style={'margin: 0 0 3rem 0;'}></div>
      </div>
    {:else}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="rectangle drop-zone-container"
        ondrop={handleFileSelect}
        ondragover={handleDragOver}
        onclick={() => { if (browser) document.getElementById('file-input').click() }}
        role="button"
        tabindex="0"
        aria-label="File upload drop zone. Click or drag and drop a PDF here."
      >
        <img src={PDFLogo} class="pdf-icon" alt="PDF icon" />
        <p class="drop-text">{dropText}</p>
        <input
          type="file"
          accept="application/pdf"
          id="file-input"
          onchange={handleFileSelect}
          style="display: none;"
        />
        {#if showAnalyzeButton}
          <div onclick={(e) => e.stopPropagation()} role="none">
            <Button
              text="Analyze PDF"
              click={handleAnalyzeClick}
              styleAdjustment="margin-top: 1rem;"
            />
          </div>
        {/if}
      </div>
    {/if}

    {#if !analyzing}
      <HangulButtonContainer bind:showModal {width} />
    {/if}

    {#if showModal}
      <FeedbackModal bind:showModal />
    {/if}
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
    background-color: var(--background-color-light);
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
    color: var(--text-color-main);
    font-family: "Open Sans";
    font-size: 0.9rem;
    font-weight: 400;
    line-height: 25px;
    transition: font-weight 300ms ease-in-out;
  }

  .text-container-heading {
    color: var(--text-color-main);
    font-family: "Open Sans";
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0 0 0.2rem 0;
  }

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

  .drop-zone-container {
    background: transparent;
    cursor: pointer;
    font-family: inherit;
    padding: 0;
  }

  .drop-zone-container:focus {
    outline: 2px solid var(--button-color);
    outline-offset: 2px;
  }

  .drop-text {
    margin-top: 10px;
    color: rgba(0, 0, 0, 0.5);
    text-align: center;
    font-family: "Open Sans";
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 500;
    line-height: 30.857px; /* 154.285% */
  }

  #file-input {
    font-size: 0.9rem;
    width: 14rem;
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

  /* file upload button */
  input[type="file"]::file-selector-button {
    border-radius: 4px;
    padding: 0 16px;
    height: 40px;
    cursor: pointer;
    background-color: var(--background-color-light);
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

  @media (max-device-width: 912px) and (min-resolution: 2dppx) {
    .hangul-logo {
      width: auto;
      height: 15rem;
    }
    
    .text-container-heading {
      font-size: 2rem;
      width: 25rem;
      margin: 0 0 1rem 0;
    }

    .drop-text {
      font-size: 2rem;
      font-weight: 200;
      margin: 2rem 0;
    }

    #file-input {
      font-size: 2rem;
      width: 11rem;
    }

    input[type="file"]::file-selector-button {
      border-radius: 4px;
      padding: 0 1rem;
      height: 4rem;
      margin: 0 0.5rem 1rem 0;
      font-size: 1.5rem;
      width: 100%;
    }

    .text {
      font-size: 2rem;
      margin: 0 0 1rem 0;
    }

    .analyzing-text {
      font-size: 2rem;
    }

    .rectangle {
      height: 30rem;
      width: 80%;
    }

    .loading-icon {
      margin: 10rem 0 22rem 0;
    }
  }
</style>
