<script>
    export let content;
</script>

<style>

    .button{
        display: inline-flex;
        padding: 20px 27px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-radius: 10px;
        background: #1B3350;
        margin: 0;
    }

    .text{
        color: #FAEFEF;
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: 30.857px; /* 154.285% */
        margin: 0;
    }

</style>


<div class="button"> 
    <div class="text">
        <h3>{content}</h3>
    </div>
</div>