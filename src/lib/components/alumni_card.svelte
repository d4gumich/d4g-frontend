<script>
    // Define the props for the card component
    export let name;
    export let position;
    export let linkedin;
    export let startYear;
    export let endYear;
</script>

<style>
    .card {
        display: flex;
        flex-direction: row;
        gap: 2%;
        border-radius: 20px;
        border: 2px solid #000;
        margin-bottom: 2%;
        width: 250px;
    }
    .text-container {
        width: 100%;
        margin: 2%;
        font-family: Work Sans;
        font-size: 10 px;
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 1%;
    }
    a {
        color: #000;
    }
</style>

<div class="card">
    <div class="text-container">
        <a href={linkedin} target="_blank"><h3>{name}</h3></a>
        <h5>{position}</h5>
        <p>{startYear} - {endYear}</p>
    </div>
</div>

