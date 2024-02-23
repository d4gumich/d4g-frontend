<script>
    export let metadata;
    export let document_language;
    export let document_title;
    export let document_summary;
    export let content;
    export let report_type;
    export let locations;
    export let disasters;
    export let full_content;
    export let keywords;
    export let verbose;
    export let hangul_time;
    export let markdown_text; // currently unused
    console.log(verbose)
</script>

<div class="hangul-result">
    <p><strong>Time taken: </strong>{hangul_time} seconds</p>
    <h3 class="heading"><u>METADATA</u></h3>
    <div class="row-field">
        <p><strong>File name:</strong></p>
        <div class="selectable-content">
            <p>{metadata['File name']}</p>
        </div>
    </div>
    <div class="row-field">
        <p><strong>Number of pages: </strong></p>
        <div class="selectable-content">
            <p>{metadata['No.of Pages'] }</p>
        </div>
    </div>
    <div class="row-field">
        <p><strong>Document Creation Date: </strong></p>
        <div class="selectable-content">
            <p>{ metadata.doc_created_date }</p>
        </div>
    </div>
    {#if metadata.doc_saved_date}
        <div class="row-field">
            <p><strong>Document Saved Date: </strong></p>
            <div class="selectable-content">
                <p>{metadata.doc_saved_date }</p>
            </div>
        </div>
    {/if}
    <div class="row-field">
        <p><strong>Document Modified Date: </strong></p>
        <div class="selectable-content">
            <p>{metadata.doc_modified_date}</p>
        </div>
    </div>
    <h3 class="heading"><u>CONTENT-BASED INFORMATION</u></h3>
    {#if metadata.Author}
        <div class="row-field">
            <p><strong>Author: </strong></p>
            <div class="selectable-content">
                <p>{metadata.Author}</p>
            </div>
        </div>
    {/if}
    {#if metadata.doc_type}
        <div class="row-field">
            <p><strong>Document Type: </strong></p>
            <div class="selectable-content">
                <p>{metadata.doc_type}</p>
            </div>
        </div>
    {/if}
    {#if report_type}
        <div class="row-field">
            <p><strong>Report Type: </strong></p>
            <div class="selectable-content">
                <p>{report_type}</p>
            </div>
        </div>
    {/if}
    {#if document_language}
        <div class="row-field">
            <p><strong>Language: </strong></p>
            <div class="selectable-content">
                <p>{document_language.language} (score={document_language.score.toFixed(2)})</p>
            </div>
        </div>
    {/if}
    {#if document_title}
        <div class="row-field">
            <p><strong>Document Title: </strong></p>
            <div class="selectable-content">
                <p>{document_title}</p>
            </div>
        </div>
    {/if}
    {#if locations}
        <div class="row-field">
            <p><strong>Locations: </strong></p>
            <div class="selectable-content">
                <!--This is pipe because some countries have comma in their names-->
                <p>{Object.keys(locations).join(' | ')}</p>
            </div>
        </div>
    {/if}
    {#if disasters}
        <div class="row-field">
            <p><strong>Disasters: </strong></p>
            <div class="selectable-content">
                <p>{disasters.join(', ')}</p>
            </div>
        </div>
    {/if}
    <div class="row-field">
        <p>
            <strong>Identified Key Phrase Sequences</strong> (Higher score is a
            better keyphrase)<strong>: </strong>
        </p>
        <div class="selectable-content">
            <p style="white-space: pre-line">{keywords.join('\n')}</p>
        </div>
    </div>
    <!-- delete verbose -->
    {#if verbose} 
    <div class="row-field">
        <h3 class="heading"><u>VERBOSE OUTPUT</u></h3>
        <div class="scrollable-box">
            <pre class="prettyprint">
              {JSON.stringify({metadata, document_language, document_summary,document_title,content, report_type, locations, disasters, full_content, keywords}, null, 2)}
            </pre>
        </div>
    </div>
    {/if}
</div>

<style>
    .hangul-result {
        margin-top: 30px;
        padding-bottom: 2rem;
        width: 50%;
        display: flex;
        flex-direction: column;
        overflow-wrap: break-word;
        font-family: Open Sans;
        gap: 5%
    }

    .heading{
        margin: 1.5rem 0 0;
    }

    p {
        margin-bottom: 7px;
        padding-top: 2px;
        margin-top: 7px;
    }

    pre {
        white-space: pre-wrap;
        white-space: -moz-pre-wrap;
        white-space: -pre-wrap;
        white-space: -o-pre-wrap;
        word-wrap: break-word;
        overflow-x: auto;
    }

    .selectable-content {
        border: 1px solid;
        border-radius: 0.2rem;
        padding: 5px;
        padding-left: 10px;
        height: fit-content;
        display: flex;
        align-items: center;
    }

    .selectable-content:hover {
        border-color: #30598b;
    }

    .row-field {
        margin-top: 0.5rem;
    }

    .scrollable-box {
      height: 30rem;
      overflow-y: auto;
      margin-top: 1.25rem;
      padding: 10px;
      border: 1px solid;
      border-radius: 0.2rem;
    }
</style>
