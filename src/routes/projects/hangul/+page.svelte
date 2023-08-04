<script>
    import { base } from '$app/paths';
    import Button from '$lib/components/button.svelte';
    let aboutHangul = false;

    let file;
    let dropText = 'Drag & choose single PDF file here';
    let showAnalyzeButton = false;

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
    let formUrl = 'https://forms.gle/n51U4g2K9cafpZUu5';

    function handleFeedbackClick() {
        showModal = true;
    }

    function handleModalKeydown(event) {
        if (event.key === 'Escape') {
            showModal = false;
        }
    }

    function handleAnalyzeClick() {
        // Replace this URL with the URL of your analysis page
        const analysisUrl = '<URL>';
        window.location.href = analysisUrl;
    }
</script>

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

    .content-container{
        display: flex;
        width: auto;
        justify-content: center;
        align-items: center;
        align-content: center;
        gap: 0px 25px;
        flex-wrap: wrap;
    }

    .text-container{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 10px;
        padding-top: 10%;
        margin:auto;
    }

    .text{
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
        border: 1px solid rgba(0, 0, 0, 0.10);
        box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.15);
        border-radius: 15px;
        fill: var(--white, #FFF);
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
        color: rgba(0, 0, 0, 0.50);
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

    h1{
        color: rgba(0, 0, 0, 0.87);
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: 25px; /* 125% */
    }

    .about-hangul-text {
        width: 50%;
        text-align: center;
        margin-top: -3%;
        color: #000;
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: 30px; /* 150% */
    }

    .button-container {
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .analyze-button{
        padding-top: 1%;
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

</style>

<div class="container">
    <div class="content-container">
        <img src="{base}/src/lib/assets/hangul2 copy 2.png" alt="Hangul logo" height="150px" />
        <div class="text-container">
            <div class="text">
                <h1>Analyze a PDF to find relevant meta and content details</h1>
                <p class="text">This product is currently in its beta release (v0.2.0).</p>
                <p class="text">For best performance, please test with a PDF less than 25 pages</p>
            </div>

        </div>
    </div>
    <div class="rectangle" on:drop|preventDefault={handleFileSelect} on:dragover|preventDefault={handleDragOver}>
        <img src="{base}/src/lib/assets/icons8-pdf-90.png" class="pdf-icon" alt="PDF icon" />
        <p class="drop-text">{dropText}</p>
        <input type="file" id="file-input" on:change={handleFileSelect} />
        {#if showAnalyzeButton}
            <Button class="analyze-button" text="Analyze PDF" click={handleAnalyzeClick} />
        {/if}
    </div>

    <div class="button-container">
        <Button text="About Hangul" click={() => aboutHangul = !aboutHangul} />
        <Button text="View Research" link="<URL>" />
        <Button text="Provide Feedback" click={handleFeedbackClick} />
    </div>
    <div class="about-hangul-text">
        {#if aboutHangul}
            <p>Chetah is a search engine for UN and NGOs reports and it summarizes reports with the state of the art deep learning algorithm, BERT. Users can search by applying filters of UN Clusters. This phase 1 product has reports from IFRC, IWA and UNICEF. It retrieves evidence-based program reports and annual reports. The results have been proven better than the Google and Bing for Non-profit sector, with an F1-score of 0.78. It is developed to help NGO program managers and policy makers to design programs and grant funds. This tool aims to provide better answers for nonprofit work and eventually to help solve the crucial real problems that NGO and UN are facing.
            </p>
        {/if}
    </div>

    {#if showModal}
        <div class="modal" on:click|self={() => showModal = false} on:keydown={handleModalKeydown} tabindex="-1">
            <div class="modal-content">
                <span class="modal-close" on:click|stopPropagation={() => showModal = false} on:keydown|stopPropagation={handleModalKeydown} tabindex="0">&times;</span>
                <iframe src={formUrl} width="100%" height="100%" title="Feedback form"></iframe>
            </div>
        </div>
    {/if}

</div>