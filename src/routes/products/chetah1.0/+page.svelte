<script>
    import Navbar from "$lib/components/navbar.svelte";
    import Button from "$lib/components/button.svelte";
    import ChetahResults from "$lib/components/chetah_results.svelte";
    import SearchLogo from '$lib/assets/icons8-search-100.png';
    import ChetahLogo from '$lib/assets/chetah_logo.png';
    import { onMount } from "svelte";
    import { base } from '$app/paths';

    const currentPage = 'chetah1.0';

    let results = $state([]);
    let time = $state(0);
    let num_res = $state(0);
    let searchQuery = $state("");
    let isSearchLoading = $state(false);
    let showModal = $state(false);
    let showUNClustersModal = $state(false);
    let formUrl = 'https://forms.gle/n51U4g2K9cafpZUu5';

    function handleFeedbackClick() {
        showModal = true;
    }

    function handleUNClustersClick() {
        showUNClustersModal = true;
    }

    async function search(query) {
        if (!query.trim()) return;
        isSearchLoading = true;
        const start = Date.now();
        try {
            const response = await fetch(`https://d4gumsi.pythonanywhere.com/api/v1/products/chetah?query=${query}`);
            const data = await response.json();
            results = data;
            num_res = results.length;
            time = Date.now() - start;
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            isSearchLoading = false;
        }
    }

    function handleSearchClick() {
        search(searchQuery);
    }

    function filterEnter(event) {
        if (event.key === "Enter") {
            search(searchQuery);
        }
    }

    function handleUNClustersSubmit(event) {
        // Handled by the inline script for now
    }
</script>

<svelte:head>
    <title>Chetah 1.0</title>
</svelte:head>

<Navbar {currentPage} />
<div class="container">
    <div class="content-container">
        <div class="logo-container">
            <img src={ChetahLogo} alt="Chetah Logo" class="chetah-logo" />
            <div class="text-container">
                <h1 class="chetah-heading">
                    Chetah 1.0
                </h1>
                <p class="info-text">
                    The Search Engine for the NGO community.
                </p>
            </div>
        </div>
<div class="search-container">
    <input
        class="search-input"
        type="text"
        placeholder="Search..."
        bind:value={searchQuery}
        onkeypress={filterEnter}
    />
    {#if searchQuery && searchQuery !== ""}
        <button
            class="search-button"
            style="background-image: url({SearchLogo});"
            onclick={handleSearchClick}
            aria-label="Submit Search"
        ></button>
    {:else}
        <button class="search-button" style="background-image: url({SearchLogo});" disabled aria-label="Search disabled"></button>
    {/if}
</div>

            {/if}
        </div>

        <div class="button-container">
            <Button text="About Chetah" link="https://github.com/d4gumich/chetah" />
            <Button text="Chetah 2.0" link="{base}/products/chetah2.0" />
            <Button text="Provide Feedback" click={handleFeedbackClick} />
        </div>

        <div class="results">
            {#if isSearchLoading}
                <p style="margin: auto; width:100%; text-align:center; font-family: Open Sans;">
                    <strong>Searching...</strong>
                </p>
            {:else if results.length === 0 && searchQuery !== ""}
                <p style="margin: auto; width:100%; text-align:center; font-family: Open Sans;">
                    <strong>No results available.</strong>
                </p>
            {:else if results.length > 0}
                <p style="margin: auto; width:100%; text-align:center; font-family: Open Sans;">
                    <strong>{num_res} out of 238 results in {time} ms.</strong>
                </p>
                <div class="res-container">
                    <div class="filter-container">
                        <Button text="UN Clusters" click={handleUNClustersClick} />
                    </div>
                    {#if showUNClustersModal}
                        <div 
                            class="modal" 
                            onclick={() => (showUNClustersModal = false)} 
                            onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (showUNClustersModal = false)}
                            role="button" 
                            aria-label="Close UN Clusters modal"
                            tabindex="0"
                        >
                            <div class="modal-content" role="dialog" aria-modal="true" aria-label="UN Clusters Selection" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} tabindex="-1">
                                <span 
                                    class="modal-close" 
                                    onclick={() => (showUNClustersModal = false)}
                                    role="button"
                                    tabindex="0"
                                    onkeydown={(e) => e.key === 'Enter' && (showUNClustersModal = false)}
                                    aria-label="Close modal"
                                >&times;</span>
                                <div class="modal-header">
                                    <h2 class="selected">UN Clusters</h2>
                                </div>
                                <div class="modal-body">
                                    <form onsubmit={(e) => { e.preventDefault(); }}>
                                        <fieldset>
                                            <legend>Select UN Cluster</legend>
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
                                        </fieldset>
                                        <div class="modal-footer">
                                            <button type="button" onclick={() => (showUNClustersModal = false)}>Cancel</button>
                                            <button type="submit" onclick={(e) => {
                                                e.preventDefault();
                                                const clusterInputs = document.querySelectorAll('input[name="cluster"]:checked');
                                                const selectedClusters = Array.from(clusterInputs).map(input => input.value);
                                                searchQuery = `${selectedClusters.join(':')}:${searchQuery}`;
                                                showUNClustersModal = false;
                                                search(searchQuery);
                                            }}>Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    {/if}
                    <div class="res">
                        {#each results as result}
                            <ChetahResults {...result} />
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>

    {#if showModal}
        <div 
            class="modal" 
            onclick={() => (showModal = false)} 
            onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (showModal = false)}
            role="button" 
            aria-label="Close Feedback modal"
            tabindex="0"
        >
            <div class="modal-content" role="dialog" aria-modal="true" aria-label="Feedback Form" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} tabindex="-1">
                <span
                    class="modal-close"
                    onclick={() => (showModal = false)}
                    role="button"
                    tabindex="0"
                    onkeydown={(e) => e.key === 'Enter' && (showModal = false)}
                    aria-label="Close modal"
                    >&times;</span
                >
                <iframe src={formUrl} width="100%" height="100%" title="Feedback Form"></iframe>
            </div>
        </div>
    {/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        background-color: var(--background-color-light);
        min-height: 100vh;
        padding: 2rem 0;
    }

    .content-container {
        width: 80%;
        max-width: 1000px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .logo-container {
        display: flex;
        align-items: center;
        margin-bottom: 2rem;
    }

    .chetah-logo {
        height: 6rem;
        width: auto;
    }

    .text-container {
        margin-left: 2rem;
    }

    .chetah-heading {
        font-family: "Outfit", sans-serif;
        font-size: 2.5rem;
        margin: 0;
        color: var(--blue-color-main);
    }

    .info-text {
        font-family: "Open Sans";
        font-size: 1.1rem;
        margin: 0.2rem 0 0 0;
        color: #666;
    }

    .search-container {
        display: flex;
        align-items: center;
        width: 100%;
        height: 50px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 2rem;
    }

    .search-input {
        flex: 1;
        border: none;
        padding: 0 1.5rem;
        font-family: "Open Sans";
        font-size: 1.1rem;
        outline: none;
    }

    .search-button {
        width: 60px;
        height: 100%;
        border: none;
        background-color: #1b3350;
        cursor: pointer;
        background-size: 40%;
        background-repeat: no-repeat;
        background-position: center;
        transition: background-color 0.2s;
    }

    .search-button:hover:not(:disabled) {
        background-color: #2c4a70;
    }

    .search-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .button-container {
        display: flex;
        gap: 1rem;
        margin-bottom: 3rem;
    }

    .res-container {
        width: 100%;
    }

    .filter-container {
        margin-bottom: 1rem;
        display: flex;
        justify-content: flex-start;
    }

    .res {
        width: 100%;
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        width: 80%;
        height: 80%;
        position: relative;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }

    .cluster-modal-content {
        height: auto;
        max-height: 90vh;
        overflow-y: auto;
    }

    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1.5rem;
        cursor: pointer;
        font-size: 2rem;
        color: #666;
        transition: color 0.2s;
    }

    .modal-close:hover {
        color: #000;
    }

    .modal-header h2 {
        margin-top: 0;
        color: var(--blue-color-main);
    }

    .modal-body fieldset {
        border: none;
        padding: 0;
        margin: 1.5rem 0;
    }

    .modal-body legend {
        font-weight: 700;
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }

    .modal-body label {
        display: inline-block;
        margin: 0.4rem 0;
        cursor: pointer;
        font-family: "Open Sans";
    }

    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
    }

    .modal-footer button {
        padding: 0.6rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-family: inherit;
        font-weight: 600;
        transition: all 0.2s;
    }

    .modal-footer button[type="button"] {
        background: #f0f0f0;
        border: 1px solid #ccc;
    }

    .modal-footer button[type="submit"] {
        background: var(--button-color);
        border: none;
        color: var(--text-color-main);
    }

    @media (max-width: 640px) {
        .content-container {
            width: 95%;
        }
        .logo-container {
            flex-direction: column;
            text-align: center;
        }
        .text-container {
            margin-left: 0;
            margin-top: 1rem;
        }
        .button-container {
            flex-direction: column;
            width: 100%;
        }
    }
</style>
