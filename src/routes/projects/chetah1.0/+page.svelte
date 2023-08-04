<script>
    import { base } from '$app/paths';
    import Button from '$lib/components/button.svelte';

    let searchQuery = '';
    let aboutCheetah = false;
    let version = 'Cheetah 1.0';
    const versions = ['Cheetah 1.0', 'Cheetah 2.0'];
    const handleVersionChange = (event) => {
        version = event.target.value;
        if (version === 'Cheetah 2.0') {
            window.location.href = '<URL>';
        }
    }

    let showModal = false;
    let formUrl = 'https://forms.gle/n51U4g2K9cafpZUu5';

    function handleFeedbackClick() {
        showModal = true;
    }
</script>

<style>
    .container {
        margin: auto;
        display: flex;
        padding: 10% 0;
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
    }

    .search-container {
        display: flex;
        align-items: center;
        width: 914.311px;
        height: 66px;
        flex-shrink: 0;
        fill: var(--white, #FFF);
        stroke-width: 0.5px;
        stroke: #000;
        border-radius: 10px;
    }
    .search-input {
        width: 100%;
        /* padding: 10px 20px; */
        font-size: 16px;
        fill: var(--white, #FFF);
        stroke-width: 0.5px;
        stroke: #000;
        color: rgba(0, 0, 0, 0.50);
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 30.857px;
        height: 90%;
        padding-left: 3%;
        border-radius: 10px 0 0 10px;
    }
    .search-button {
        width: 60px;
        height: 100%;
        border-radius: 0 10px 10px 0;
        border: none;
        background-color: #1B3350;
        color: white;
        font-size: 16px;
        cursor: pointer;
        background-image: url("/src/lib/assets/icons8-search-100.png");
        background-size: 65%;
        background-repeat: no-repeat;
        background-position: center;
    }
    .info-text {
        text-align: center;
        margin-bottom: 10px;
        color: rgba(0, 0, 0, 0.87);
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: 25px;
    }
    .version-select {
        margin-top: 5px;
        width: 200px;
        height: 35px;
        color: #000;
        border-radius: 10px;
        padding-left: 1%;

        /* Body 2 */
        font-family: Roboto;
        font-size: 17px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 120% */
    }

    .about-cheetah-container {
        display: flex;
        flex-direction: column;
    }

    .about-cheetah-text {
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
        /* width: 100%;
        max-width: 600px; */
        /* margin-top: 20px; */
    }
    .button {
        background-color: #1B3350;
        color: white;
        border-radius: 5px;
        border: none;
        padding: 10px 20px;
        cursor: pointer
    }

    h3{
        color: #FAEFEF;
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: 30.857px; /* 154.285% */
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
        <img class="logo" src="{base}/src/lib/assets/Updated_LOGO.png" alt="Cheetah Logo" height="115px" />
        <div class="text-container">
            <p class="info-text">Search a phrase below and receive a list of UN and NGO report links in order of relevancy.</p>
            <select class="version-select" bind:value={version} on:change={handleVersionChange}>
            {#each versions as version}
                <option value={version}>{version}</option>
            {/each}
            </select>
        </div>
    </div>
    
    <div class="search-container">
      <input class="search-input" type="text" placeholder="Enter Queries" bind:value={searchQuery} />
      <button class="search-button" height="10px"></button>
    </div>

    <div class="button-container">
        <Button text="About Cheetah" click={() => aboutCheetah = !aboutCheetah} />
        <Button text="View Research" link="<URL>"  />
        <Button text="Provide Feedback" click={handleFeedbackClick} />
    </div>
    <div class="about-cheetah-text">
        {#if aboutCheetah}
            <p>Chetah is a search engine for UN and NGOs reports and it summarizes reports with the state of the art deep learning algorithm, BERT. Users can search by applying filters of UN Clusters. This phase 1 product has reports from IFRC, IWA and UNICEF. It retrieves evidence-based program reports and annual reports. The results have been proven better than the Google and Bing for Non-profit sector, with an F1-score of 0.78. It is developed to help NGO program managers and policy makers to design programs and grant funds. This tool aims to provide better answers for nonprofit work and eventually to help solve the crucial real problems that NGO and UN are facing.
            </p>
        {/if}
    </div>
    {#if showModal}
    <div class="modal" on:click|self={() => showModal = false}>
        <div class="modal-content">
            <span class="modal-close" on:click|stopPropagation={() => showModal = false}>&times;</span>
            <iframe src={formUrl} width="100%" height="100%"></iframe>
        </div>
    </div>
    {/if}


</div>