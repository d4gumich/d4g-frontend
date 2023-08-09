<script>
    import { base } from "$app/paths";
    import { page } from '$app/stores';
    import ChetahResults from "../../../../lib/components/chetah_results.svelte";
    // import the searchQuery form the +page.svelte in previous directory

    let version = "Chetah 1.0";
    let results = null;
    let time = 0;
    let num_res = 0;
    const versions = ["Chetah 1.0", "Chetah 2.0"];
    const handleVersionChange = (event) => {
        version = event.target.value;
        if (version === "Chetah 2.0") {
            window.location.href = "<URL>";
        }
    };

    let searchQuery = "";
    $: {
        const urlParams = new URLSearchParams(page.query);
        searchQuery = urlParams.get('query');
    }

    async function doFetch(searchQuery) {
        console.log(response);
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
        console.log('Calling doFetch function');
        doFetch(cleanedQuery).then((data) => {
            results = data;
            num_res = results.length;
            time = Date.now() - time;

            // Redirect to the results page
            window.location.href = `/projects/chetah1.0/search_result?query=${encodeURIComponent(searchQuery)}`;
        });
    }

    function filterEnter(event){
        console.log('filterEnter function called');
        switch (event.keyCode) {
            case 13:
                search(searchQuery)
        }
    }

    $: {
    if (searchQuery) {
        doFetch(searchQuery).then((data) => {
            results = data;
            num_res = results.length;
        });
    }
    }

</script>

<div class="container">
    <div class="content-container">
        <img
            class="logo"
            src="{base}/src/lib/assets/Updated_LOGO.png"
            alt="Chetah Logo"
            height="115px"
        />
        <div class="text-container">
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
        {:else}
             <p style="margin: auto; width:100%; text-align:center; font-family: Open Sans;">
                    <strong>No results available.</strong>
             </p>
         {/if}
    </div>
</div>
