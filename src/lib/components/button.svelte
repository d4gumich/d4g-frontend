<script>
    export let text;
    export let link
    export let click;
</script>

<style>

    .button{
        display: inline-flex;
        padding: 0 25px;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        background: #1B3350;
        margin: 5px;
        margin-top: 2%;
    }

    .button:hover {
        background: #30598b;
    }

    .text{
        color: #FAEFEF;
        font-family: Open Sans;
        font-size: 15px;
        font-style: normal;
        font-weight: 700;
        line-height: 20px; /* 154.285% */
        margin: 0;
    }

    @media (max-width: 600px) {
        .button{
            padding: 0 15px;
        }

        .text{
            font-size: 10px;
        }

    }

</style>


<a href={link} class="button" on:click={click}>
    <div class="text">
        <h3>{text}</h3>
    </div>
</a>