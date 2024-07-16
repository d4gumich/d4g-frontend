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
  import { fetchSummary, fetchDataWithTimeout } from "$lib/components/utils/fetch_hangul_data.js";
  import { writable } from "svelte/store";

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

  const currentPage = 'hangul';
  const numberOfPages = writable(0);
  const size = writable(0);

  GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC_URL;

  let width;
  let file;
  let result;
  let summary_result;
  let errorType;
  let showPopUp = false;
  let confirmResult;
  let showModal = false;
  let loadingProgressMain = 0;
  let verbose = true;
  let hidden = true;
  let version = 2;
  let dropText = DEFAULT_DROP_TEXT;
  let fileName = "N/A";
  let showError = false;
  let showAnalyzeButton = false;
  let analyzing = false;
  let showResults = false;
  let loadingFastPass = false;

  $: console.log("Size of file: ", $size, "MB");
  $: console.log("Number of pages: ", $numberOfPages);

  $: estimatedTimeToAnalyze = calculateEstimatedTime($numberOfPages);
  $: console.log("Estimated Time (s):", estimatedTimeToAnalyze);
  $: loadingTimeRemaining = Math.round(
    estimatedTimeToAnalyze - loadingProgressMain
  );

  $: console.log("version:", version);

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

  $: {
    if (analyzing) {
      onMount(simulateLoadingMainBar());
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  onMount(() => {
    if (typeof window !== 'undefined') {
      width = window.screen.width
    }
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
    let userProceedSelection;
    userProceedSelection = await handleButtonClick();

    if (userProceedSelection) {
      analyzing = true;
      const main_start_time = Date.now();

      try {
        result = await fetchDataWithTimeout(file, version, (estimatedTimeToAnalyze*SECONDS_TO_MILLISECONDS + TIMEOUT_BUFFER));
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
        goBack(true);
        errorType = 1;
        showError = true;

        const emailParams = {
            to_name: "Szymon",
            file_name: result.fileName,
            fail_stage: "main API call",
            page_number: result.metadata["No.of Pages"],
            version: result.version,
            timestamp: new Date(Date.now()),
            first_duration: result.hangul_time,
            second_duration: "N/A",
            document_language: result.document_language.language,
            document_title: result.document_title,
            document_author: result.document_author,
            document_theme: result.document_theme,
            report_type: result.report_type,
        };

        emailjs.send("default_service", "template_8r3xfwe", emailParams)
              .then((response) => {
                  console.log('SUCCESS!', response.status, response.text);
              }, (error) => {
                  console.log('FAILED...', error);
        });
      }
      loadingProgressMain = 0;
      analyzing = false;

      if (showResults && version === 2) {
          console.log("fetching summary data");
          result.fetchingSummaryData = true;
          result.estimatedTimeToAnalyzeSummary = result.hangul_time * 1.5;
          const summary_start_time = Date.now();
          try {
            console.log(`waiting ${SUMMARY_API_CALL_DELAY * MILLISECONDS_TO_SECONDS} seconds to call summary data`);
            await sleep(SUMMARY_API_CALL_DELAY);
            console.log("fetching summary data");
            summary_result = await fetchSummary(result.document_summary_parameters,
                                                version);
            console.log("Document Summary:", summary_result);
            result.summary_generation_time = Math.round((Date.now() - summary_start_time) * MILLISECONDS_TO_SECONDS * 100) / 100;
            
            result.document_summary = summary_result;

            const emailParams = {
              file_name: result.fileName,
              page_number: result.metadata["No.of Pages"],
              version: result.version,
              timestamp: new Date(Date.now()),
              first_duration: result.hangul_time,
              second_duration: result.summary_generation_time,
              document_language: result.document_language.language,
              document_title: result.document_title,
              document_author: result.document_author,
              document_theme: result.document_theme,
              report_type: result.report_type,
              summary: result.document_summary,
            };

            emailjs.send("default_service", "template_x5kz5cs", emailParams)
                  .then((response) => {
                      console.log('SUCCESS!', response.status, response.text);
                  }, (error) => {
                      console.log('FAILED...', error);
            });

          } catch (error) {
            console.error("Could not fetch summary data", error);
            result.summary_generation_time = -1;
            result.document_summary = null;

            const emailParams = {
              file_name: result.fileName,
              fail_stage: "summary",
              page_number: result.metadata["No.of Pages"],
              version: result.version,
              timestamp: new Date(Date.now()),
              first_duration: result.hangul_time,
              second_duration: Math.round((Date.now() - summary_start_time) * MILLISECONDS_TO_SECONDS * 100) / 100,
              document_language: result.document_language.language,
              document_title: result.document_title,
              document_author: result.document_author,
              document_theme: result.document_theme,
              report_type: result.report_type,
            };

            emailjs.send("default_service", "template_8r3xfwe", emailParams)
                  .then((response) => {
                      console.log('SUCCESS Sending a summary fail!', response.status, response.text);
                  }, (error) => {
                      console.log('FAILED...', error);
            });
          }
          result.fetchingSummaryData = false;
        }
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
  <title>Hangul {version}.0</title>
</svelte:head>

<Navbar {currentPage} />
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
      <ConfirmationModal estimatedTime={estimatedTimeToAnalyze} />
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
