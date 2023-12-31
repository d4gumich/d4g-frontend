<script>
    import { base } from "$app/paths";
    import Button from "$lib/components/button.svelte";
    import HangulResult from "../../../lib/components/hangul_result.svelte";
    import PDFLogo from '$lib/assets/icons8-pdf-90.png';
    import HangulLogo from '$lib/assets/hangul2 copy 2.png';

    let aboutHangul = false;
    let verbose = false;
    let hidden = true;
    let version = "Hangul 2.0";
    let file;
    let kw_num;
    let result;
    let dropText = "Drag & choose single PDF file here";
    let showAnalyzeButton = false;
    let analyzing = false;
    let showResults = false; // Track whether to show results
    const versions = ["Hangul 1.0", "Hangul 2.0"];

    const handleVersionChange = (event) => {
        version = event.target.value;
        if (version === "Hangul 1.0") {
            window.location.href = `${base}/projects/hangul`;
        }
    };

    function handleFileSelect(event) {
        event.preventDefault();
        if (event.dataTransfer) {
            file = event.dataTransfer.files[0];
        } else {
            file = event.target.files[0];
            showAnalyzeButton = true;
        }
        dropText = file.name;
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    let showModal = false;
    let formUrl = "https://forms.gle/n51U4g2K9cafpZUu5";

    function handleFeedbackClick() {
        showModal = true;
    }

    function handleModalKeydown(event) {
        if (event.key === "Escape") {
            showModal = false;
        }
    }

    async function handleAnalyzeClick() {
        // Replace this URL with the URL of your analysis page
        analyzing = true;
        const time = Date.now();
        const form = new FormData();
        form.append("file", file);
        form.append("kw_num", kw_num);
        const response = await fetch(
            "https://d4gumsi.pythonanywhere.com/api/v1/products/hangul",
            {
                method: "POST",
                body: form,
                cors: "cors",
            }
        );
        result = await response.json();
        result.verbose = verbose;
        result.hangul_time = (Date.now() - time) / 1000;
        hidden = false
        analyzing = false;
        showResults = true;
    }

    function goBack() {
        showResults = false; // Hide results and go back
        hidden = true; // Show the main page
    }

</script>

<svelte:head>
  <title>Hangul 2.0</title>
</svelte:head>

{#if !showResults && hidden}
<div class="container">
    <div class="content-container">
        <img
            src={HangulLogo}
            alt="Hangul logo"
            height="150px"
        />
        <div class="text-container">
            <div class="text">
                <h1>Currently Under Development. Check Back soon!</h1>
                <!-- <h1>Analyze a PDF to find relevant meta and content details</h1>
                <p class="text">
                    This product is currently in its beta release (v2.0).
                </p>
                <p class="text">
                    For best performance, please test with a PDF less than 25
                    pages
                </p> -->
            </div>
            <select
                class="version-select"
                bind:value={version}
                on:change={handleVersionChange}
                >
                    {#each versions as version}
                        <option value={version}>{version}</option>
                    {/each}
            </select>
        </div>
    </div>
    <div>
        <!-- {#if analyzing}
            <div class="loading-icon">
                <div class="spinner"></div>
                <p>Analyzing...</p>
            </div>
        {:else}
            <div
                class="rectangle"
                on:drop|preventDefault={handleFileSelect}
                on:dragover|preventDefault={handleDragOver}
            >
                <img
                    src={PDFLogo}
                    class="pdf-icon"
                    alt="PDF icon"
                />
                <p class="drop-text">{dropText}</p>
                <input
                    type="file"
                    accept="application/pdf"
                    id="file-input"
                    on:change={handleFileSelect}
                />
                {#if showAnalyzeButton}
                    <Button text="Analyze PDF" click={handleAnalyzeClick} style="margin-top: 10px;" />
                {/if}
            </div>
        {/if}

        <div class="filter">
            <label for="verbose">Verbose:</label>
            <input
                type="checkbox"
                id="verbose"
                name="verbose"
                bind:checked={verbose}
            />

            <label for="keyphrases">Number of keyphrases:</label>
            <select bind:value={kw_num} name="keyphrases" id="keyphrases">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
            </select>
        </div> -->
    </div>

    <div class="button-container">
        <Button
            text="About Hangul"
            click={() => (aboutHangul = !aboutHangul)}
        />
        <Button text="View Research" link="https://drive.google.com/file/d/1U_wHtC6DtPsfIBXHCeESfQXlDsXe5lHv/view" />
        <Button text="Provide Feedback" click={handleFeedbackClick} />
    </div>
    <div class="about-hangul-text">
        {#if aboutHangul}
            <p>
                Hangul is an NLP-based assistant for digital curators at
                ReliefWeb envisioned to enable curators to handle three times,
                four times the number of documents that they're processing. Once
                a text PDF is uploaded to the platform, relevant metadata is
                extracted from it. Current metadata includes the Document Title,
                the date the document is published, the number of pages in the
                document, the word length of the document, the language of the
                document, and the entities in the document. More complex
                features like extraction of abstract, conclusion, executive
                summary, and recognizing the theme(cluster) of the document are
                also in scope.
            </p>
        {/if}
    </div>

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
                    src={formUrl}
                    width="100%"
                    height="100%"
                    title="Feedback form"
                />
            </div>
        </div>
    {/if}
</div>
{/if}


{#if showResults}
    <!-- Show results when result is available -->
    <div class="container">
    <HangulResult {...result} />
    <!-- <Button text='Go back' click={goBack}/> -->
    <Button text='Go back' click={goBack}/>
    </div>
{/if}

<style>
    .container {
        margin: auto;
        display: flex;
        padding: 5% 0;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 45px;
    }

    .content-container {
        display: flex;
        width: auto;
        justify-content: center;
        align-items: center;
        align-content: center;
        gap: 0px 25px;
        flex-wrap: wrap;
    }

    .text-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 10px;
        padding-top: 5%;
        margin: auto;
    }

    .text {
        margin: auto;
        color: rgba(0, 0, 0, 0.87);
        font-family: Open Sans;
        font-size: 15px;
        font-style: normal;
        font-weight: 400;
        line-height: 25px;
    }

    .rectangle {
        width: 596px;
        height: 343.892px;
        flex-shrink: 0;
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.15);
        border-radius: 15px;
        fill: var(--white, #fff);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .pdf-icon {
        font-size: 48px;
    }
    .drop-text {
        margin-top: 10px;
        color: rgba(0, 0, 0, 0.5);
        text-align: center;
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: 30.857px; /* 154.285% */
    }

    #file-input {
        width: 30%;
    }

    h1 {
        color: rgba(0, 0, 0, 0.87);
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: 25px; /* 125% */
    }

    .about-hangul-text {
        width: 50%;
        text-align: left;
        margin-top: -3%;
        color: #000;
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: 30px; /* 150% */
    }

    .version-select {
        margin-top: 5px;
        width: 200px;
        height: 35px;
        color: #000;
        border-radius: 10px;
        padding-left: 1%;
        font-family: Open Sans;

        /* Body 2 */
        font-family: Roboto;
        font-size: 17px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 120% */
    }

    .button-container {
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .filter {
        padding-top: 3%;
        text-align: center;
        font-family: Open Sans;
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

  .spinner {
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 2s linear infinite;
    }

  @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
  }
</style>