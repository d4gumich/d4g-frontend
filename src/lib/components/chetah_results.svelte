<script>
    export let title;
    export let date;
    export let link;
    export let cluster;
    export let summary_full;
    let showModal = false;

    function toggleModal(){
        showModal = !showModal
    }

</script>

<div class="result">
    <p><strong>Report Title: </strong>{title}</p>
    <p><strong>Date Published: </strong>{date}</p>
    <p>
        <strong>Link: </strong><a href={link} target="_blank">Go to report</a>
    </p>
    <p><strong>Clusters: </strong>{cluster}</p>
    <p>
        <strong>Summary: </strong>{summary_full.substring(0, 200)}... <button on:click={toggleModal}>+More</button>
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
                <p>{summary_full}</p>
            </div>
        </div>
    {/if}
</div>

<style>
    p {
        font-family: Open Sans;
    }
    .result {
        width: 60%;
        word-wrap: normal;
        background-color: #ddd0c8;
        padding: 2%;
        margin: auto;
        margin-bottom: 2%;
        border-radius: 3%;
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
        padding: 1%;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        background: #1B3350;
        margin: 5px;
        color: white;
        font-family: Open Sans;
    }
</style>
