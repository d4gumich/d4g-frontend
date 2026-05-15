<script>
    let {
        error,
        report_title,
        report_author,
        organization_name,
        doc_creation_date,
        doc_modified_date,
        year_of_report,
        report_type,
        pages_in_report,
        language_of_doc,
        locations_report,
        themes,
        summary,
        file_name
    } = $props();

    let showModal = $state(false);

    function toggleModal(){
        showModal = !showModal
    }

</script>

{#if !error}
    <div class="result">
        {#each report_title.slice(0,3) as title,i}
            <p style="font-size: {1.5-i*0.2}rem;">{title}</p>
        {/each}
        <p>
            <strong>Year of Report: </strong>{year_of_report||"No identified Author"}<br/>
            <strong>Report Author: </strong>{report_author||"No identified Author"}<br/>
            <strong>Organization: </strong>{organization_name||"No identified Organization"}<br/>
            <strong>Themes: </strong>{themes||"No identified Themes"}<br/>
            <strong>Report Type: </strong>{report_type||"No identified report type"}<br/>
            <strong>Locations: </strong>{locations_report||"No identified locations"}<br/>
            <strong>Pages: </strong>{pages_in_report||"No identified number of pages"}<br/>
            <strong>Language: </strong>{language_of_doc||"Language of report not identified"}<br/>
            <strong>Document created: </strong>{doc_creation_date||"No identified creation date"}<br/>
            <strong>Report modified: </strong>{doc_modified_date||"No identified modified date"}<br/>
            <strong>Report modified: </strong>{file_name||"No identified filename"}<br/>
            <strong>Hangul Summary: </strong>{summary?.substring(0, 350)||"No hangul summary available"} ... <button onclick={toggleModal}>+More</button><br/>
        </p>

        {#if showModal}
            <div 
                class="modal" 
                onclick={() => (showModal = false)} 
                onkeydown={(e) => (e.key === 'Escape') && (showModal = false)}
                role="button" 
                aria-label="Close modal"
                tabindex="0"
            >
                <div class="modal-content" role="dialog" aria-modal="true" aria-label="Summary Modal" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} tabindex="-1">
                    <span
                        class="modal-close"
                        onclick={() => (showModal = false)}
                        role="button"
                        tabindex="0"
                        onkeydown={(e) => e.key === 'Enter' && (showModal = false)}
                        aria-label="Close modal"
                        >&times;</span
                    >
                    <p>{summary}</p>
                </div>
            </div>
        {/if}
    </div>
{/if}

<style>
    p {
        font-family: Open Sans;
        margin: 1%;
    }
    .result {
        width: 70%;
        word-wrap: normal;
        margin: auto;
        margin-left: 5%;
        margin-bottom: 1%;
        margin-top: 2%;
        border-radius: 3%;
    }

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
        z-index: 1000;
    }
    .modal-content {
        width: 80%;
        height: 80%;
        background-color: var(--text-color-light);
        padding: 20px;
        overflow-y: auto;
        padding: 2%;
    }
    .modal-close {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
    }
    button{
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        background: #1B3350;
        margin: 5px;
        color: var(--text-color-light);
        font-family: Open Sans;
    }
</style>