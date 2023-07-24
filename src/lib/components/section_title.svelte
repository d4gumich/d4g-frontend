<script>
    export let title;
</script>

<div class="container">
    <h1>{title}</h1>
</div>

<style>
    h1 {
        width: auto;
        color: rgba(0, 0, 0, 0.87);
        text-align: center;
        font-family: Lato;
        font-size: 40px;
        font-style: normal;
        font-weight: 700;
        line-height: 70px; /* 140% */
        margin: 0;
        text-decoration: underline rgba(227, 184, 120, 1) 3px;
        text-underline-offset: 15px;
    }
    .container {
        height: 100%;
        display: flex;
        justify-content: center;
        padding: 20px;
    }
</style>