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
    <p><a href={link} target="_blank" class="title">{title}</a> - {date}</p>
    <!-- <p>{date}</p> -->
    <p><strong>Clusters: </strong>{cluster}</p>
    <p>{summary_full.substring(0, 250)} ... <button on:click={toggleModal}>+More</button>
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
        margin: 1%;
    }
    .result {
        width: 70%;
        word-wrap: normal;
        margin: auto;
        margin-left: 0;
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
