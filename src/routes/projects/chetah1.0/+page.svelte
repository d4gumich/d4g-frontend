<script>
    import { base } from "$app/paths";
    import Button from "$lib/components/button.svelte";
    import ChetahResults from "../../../lib/components/chetah_results.svelte";

    let searchQuery = "";
    let aboutChetah = false;
    let version = "Chetah 1.0";
    let results = null;
    let time = 0;
    let num_res = 0;
    const versions = ["Chetah 1.0", "Chetah 2.0"];
    const handleVersionChange = (event) => {
        version = event.target.value;
        if (version === "Chetah 2.0") {
            window.location.href = "/projects/chetah2.0";
        }
    };

    let showModal = false;
    let formUrl = "https://forms.gle/n51U4g2K9cafpZUu5";

    function handleFeedbackClick() {
        showModal = true;
    }

    async function doFetch(searchQuery) {
        const url = "http://127.0.0.1:8000/api/v1/products/chetah";
        const data = { query: searchQuery };
        const response = await fetch(url, {
            method: "POST",
            cors: "cors",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    function search(searchQuery) {
        time = Date.now();
        num_res = 0;
        const cleanedQuery = searchQuery.trim();
        doFetch(cleanedQuery).then((data) => {
            results = data;
            num_res = results.length;
            time = Date.now() - time;
        });
    }

    function filterEnter(event){
        switch (event.keyCode) {
            case 13:
                search(searchQuery)
        }
    }

    let showUNClustersModal = false;

    function handleUNClustersClick() {
        showUNClustersModal = true;
    }

</script>

<div class="container">
    <div class="content-container {results ? 'flex-row' : ''}">
        <div class="logo-container">
            <img
                class="logo"
                src="{base}/src/lib/assets/Updated_LOGO.png"
                alt="Chetah Logo"
                height="115px"
            />
            <div class="text-container">
                {#if !results}
                    <p class="info-text">
                        Search a phrase below and receive a list of UN and NGO report
                        links in order of relevancy.
                    </p>
                    <select
                    class="version-select"
                    bind:value={version}
                    on:change={handleVersionChange}
                    >
                        {#each versions as version}
                                <option value={version}>{version}</option>
                        {/each}
                    </select>
                {/if}
            </div>
        </div>
        
        <div class="search-container">
            <input
                class="search-input"
                type="text"
                placeholder="Enter Queries"
                bind:value={searchQuery}
                on:keypress={filterEnter}
            />
            {#if searchQuery && searchQuery != ""}
                <button
                    class="search-button"
                    height="10px"
                    on:click={search(searchQuery)}
                />
            {:else}
                <button class="search-button" height="10px" disabled />
            {/if}
        </div>

        {#if !results}
            <div class="button-container">
                <Button
                    text="About Chetah"
                    click={() => (aboutChetah = !aboutChetah)}
                />
                <Button text="View Research" link="https://drive.google.com/file/d/13Jij3MG6P_P5OGGMLNIbGdgpCUaDVGce/view" />
                <Button text="Provide Feedback" click={handleFeedbackClick} />
            </div>
        {:else}
            <div class="button-container">
                <Button text="UN Clusters" click={handleUNClustersClick} />
            </div>
            {#if showUNClustersModal}
                <div class="modal">
                    <div class="modal-content">
                        <span class="modal-close" on:click={() => (showUNClustersModal = false)}>×</span>
                        <h2>Select UN Cluster</h2>
                        <form>
                            <label><input type="checkbox" name="cluster" value="Health"> Health</label><br>
                            <label><input type="checkbox" name="cluster" value="Education"> Education</label><br>
                            <label><input type="checkbox" name="cluster" value="Nutrition"> Nutrition</label><br>
                            <label><input type="checkbox" name="cluster" value="Protection"> Protection</label><br>
                            <label><input type="checkbox" name="cluster" value="Water"> Water</label><br>
                            <label><input type="checkbox" name="cluster" value="Camp"> Camp</label><br>
                            <label><input type="checkbox" name="cluster" value="Early Recovery"> Early Recovery</label><br>
                            <label><input type="checkbox" name="cluster" value="Emergency Telecom"> Emergency Telecom</label><br>
                            <label><input type="checkbox" name="cluster" value="Food Security"> Food Security</label><br>
                            <label><input type="checkbox" name="cluster" value="Humanitarian"> Humanitarian</label><br>
                            <label><input type="checkbox" name="cluster" value="Logistics"> Logistics</label><br>
                        </form>
                    </div>
                </div>
            {/if}


            <!-- here add the provide feedback icon and have it stick to the bottom of the page -->
        {/if}

        <div class="about-chetah-text">
            {#if aboutChetah}
                <p>
                    Chetah is a search engine for UN and NGOs reports and it
                    summarizes reports with the state of the art deep learning
                    algorithm, BERT. Users can search by applying filters of UN
                    Clusters. This phase 1 product has reports from IFRC, IWA and
                    UNICEF. It retrieves evidence-based program reports and annual
                    reports. The results have been proven better than the Google and
                    Bing for Non-profit sector, with an F1-score of 0.78. It is
                    developed to help NGO program managers and policy makers to
                    design programs and grant funds. This tool aims to provide
                    better answers for nonprofit work and eventually to help solve
                    the crucial real problems that NGO and UN are facing.
                </p>
            {/if}
        </div>

        <div class="results-container">
            {#if results}
                {#if num_res === 0}
                    <p style="margin: auto; width:100%; text-align:center; font-family: Open Sans;">
                        <strong>No results available.</strong>
                    </p>
                {:else}
                    <p
                        style="margin: auto; width:100%; text-align:center; font-family: Open Sans;"
                    >
                        <strong>{num_res} results in {time} ms.</strong>
                    </p>
                {/if}
                {#each results as result}
                    <ChetahResults {...result} />
                {/each}
            {/if}
        </div>
    </div>

    {#if showModal}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="modal" on:click|self={() => (showModal = false)}>
            <div class="modal-content">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <span
                    class="modal-close"
                    on:click|stopPropagation={() => (showModal = false)}
                    >&times;</span
                >
                <!-- svelte-ignore a11y-missing-attribute -->
                <iframe src={formUrl} width="100%" height="100%" />
            </div>
        </div>
    {/if}
</div>

<style>

    /* new */
    /* .search-container {
        display: flex;
        align-items: center;
    } */

    .logo-container {
        display: flex;
        align-items: center;
    }

    .logo-container img {
        margin-right: 20px;
    }

    .results-container {
        margin-top: 20px;
    }




    .container {
        margin: auto;
        display: flex;
        padding: 7% 0;
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
        flex-direction: column;
    }

    .content-container.flex-row{
      flex-direction: row; 
    }

    .text-containe r{
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
        fill: var(--white, #fff);
        stroke-width: 0.5px;
        stroke: #000;
        border-radius: 10px;
        padding: 2%;
    }
    .search-input {
        width: 100%;
        /* padding: 10px 20px; */
        font-size: 16px;
        fill: var(--white, #fff);
        stroke-width: 0.5px;
        stroke: #000;
        color: rgba(0, 0, 0, 0.5);
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
        background-color: #1b3350;
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
        font-family: Open Sans;

        /* Body 2 */
        font-family: Roboto;
        font-size: 17px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 120% */
    }

    .about-chetah-container {
        display: flex;
        flex-direction: column;
    }

    .about-chetah-text {
        width: 50%;
        text-align: left;
        /* margin-top: 1%; */
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
        text-align: center;
    }
    .button {
        background-color: #1b3350;
        color: white;
        border-radius: 5px;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
    }

    h3{
        color: #faefef;
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

<!-- when the user click search, it will direct them to a page that have a different layout/format of the webpage that displays the result below the search bar without the three buttons of 'about chetah', 'view research' and 'provide feedback'. the search bar will move to the top of the page with the logo at the left side of the search bar. this is the code for the main page -->

<!-- please update the code here so that when the user entered their query, the three buttons will disappear, the info-text will disappear and the search bar will be at the right side of the logo (while the whole thing will move to the top of the page). the result will display underneath the search bar, and there's a filter button called 'UN Clusters' that allow the user to filter their results. -->