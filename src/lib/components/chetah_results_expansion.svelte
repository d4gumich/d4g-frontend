<script>
    export let error;
    export let report_title;
    export let report_author;
    export let organization_name;
    export let doc_creation_date;
    export let doc_modified_date;
    export let year_of_report;
    export let report_type;
    export let pages_in_report;
    export let language_of_doc;
    export let locations_report;
    export let themes;
    export let summary;
    export let file_name;
    /* export let cleaned_text_content;
    export let key_phrases_words; */

    let showModal = false;

    function toggleModal(){
        showModal = !showModal
    }

</script>

{#if !error}
    <div class="result">
        <!-- <h3><span class="title">{report_title}</span> - {year_of_report}</h3> -->
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
            <strong>Hangul Summary: </strong>{summary?.substring(0, 350)||"No hangul summary available"} ... <button on:click={toggleModal}>+More</button><br/>
        </p>

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

    .title{
        /* color: #446FDB; */
        font-family: Work Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: -0.4px;
        text-transform: capitalize;
    }

    a {
        text-decoration: none;
        color: #1a0dab;
    }
    

    a:visited {
        color: #4c2c92;
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