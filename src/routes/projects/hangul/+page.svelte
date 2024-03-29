<script>
  import {
    PDF_WORKER_SRC_URL,
    DEFAULT_DROP_TEXT,
    PAGES_TO_TIME_RATIO,
    KEYWORD_COUNT,
    INTERVAL,
    SECONDS_TO_MILLISECONDS,
    MILLISECONDS_TO_SECONDS,
    TIMEOUT_BUFFER
  } from "$lib/assets/constants/constants.js";
  import { sleep } from "$lib/components/utils/helper_functions.js";
  import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
  import { onMount } from "svelte";
  import { fetchDataWithTimeout } from "$lib/components/utils/fetch_hangul_data.js";

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

  GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC_URL;

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

  $: estimatedTimeToAnalyze = Math.round(PAGES_TO_TIME_RATIO * numberOfPages);
  $: console.log("Estimated Time (s):", estimatedTimeToAnalyze);
  $: loadingTimeRemaining = Math.round(
    estimatedTimeToAnalyze - loadingProgress
  );

  $: console.log("version:", version);

  const updateShowError = (value) => {
    showError = value;
    dropText = DEFAULT_DROP_TEXT;
  }

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

  const simulateLoading = () => {
    const interval = setInterval(() => {
      loadingProgress += (INTERVAL / 1000);

      if (loadingProgress >= estimatedTimeToAnalyze || !analyzing) {
        console.log("interval cleared");
        clearInterval(interval);
      }
    }, INTERVAL);
  };

  $: {
    if (analyzing) {
      onMount(simulateLoading());
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault();
  };

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

  // async function fetchData() {
  //   const form = new FormData();
  //   form.append("file", file);
  //   form.append("kw_num", KEYWORD_COUNT);

  //   const response = await fetch(
  //     `https://d4gumsi.pythonanywhere.com/api/v${version}/products/hangul`,
  //     {
  //       method: "POST",
  //       body: form,
  //       cors: "cors",
  //     }
  //   );
  //   if (!response.ok) {
  //     console.log("Network response was not ok");
  //     throw new Error('Network response was not ok');
  //   }
  //   return response.json();
  // }

  // async function fetchDataWithTimeout(timeout=(estimatedTimeToAnalyze*1000) + 5000) {
  //   // Use Promise.race() to await the first promise to settle (either success or timeout)
  //   try {
  //       const result = await Promise.race([fetchData(), new Promise((resolve, reject) => {
  //           setTimeout(() => {
  //               reject(new Error('Request timed out'));
  //           }, timeout);
  //       })]);
        
  //       return result;
  //   } catch (error) {
  //       console.error('Error fetching data:', error);
  //       throw error; // Propagate the error
  //   }
  // }

  async function handleAnalyzeClick() {
    let userProceedSelection;
    userProceedSelection = await handleButtonClick();

    if (userProceedSelection) {
      analyzing = true;
      const time = Date.now();
      // const form = new FormData();
      // form.append("file", file);
      // form.append("kw_num", KEYWORD_COUNT);
      try {
        // const response = await fetch(
        //   `https://d4gumsi.pythonanywhere.com/api/v${version}/products/hangul`,
        //   {
        //     method: "POST",
        //     body: form,
        //     cors: "cors",
        //   }
        // );
        // if (!response.ok) {
        //   console.log("Network response was not ok");
        //   throw new Error('Network response was not ok');
        // }
        // result = await response.json();
        result = await fetchDataWithTimeout(file, version, (estimatedTimeToAnalyze*SECONDS_TO_MILLISECONDS + TIMEOUT_BUFFER));
        if (result !== null) {
          console.log('Result:',result);
        }
        result.verbose = verbose;
        result.hangul_time = (Date.now() - time) * MILLISECONDS_TO_SECONDS;
        if (loadingProgress < estimatedTimeToAnalyze) {
          loadingProgress = estimatedTimeToAnalyze;
          loadingFastPass = true;
          console.log("completing loading bar animation");
          await sleep(500);
        }
        hidden = false;
        showResults = true;
        loadingFastPass = false;
      } catch (error) {
        console.error("Could not fetch from d4gumsi.pythonanywhere.com", error);
        errorType = 1;
        showError = true;
        showAnalyzeButton = false;
      }
      loadingProgress = 0;
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

    .analyzing-text {
      font-size: 0.8rem;
    }

    .rectangle {
      width: 80%;
    }
  }
</style>
