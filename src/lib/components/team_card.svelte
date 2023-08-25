<script>
    // Define the props for the card component
    export let name;
    export let position;
    export let description;
    export let linkedin;
    export let image;
</script>

<style>
    .card {
        display: flex;
        flex-direction: row;
        gap: 2%;
        border-radius: 20px;
        border: 2px solid #000;
        margin-bottom: 2%;
    }
    .logo-container {
        display: flex;
        align-items: center;
        padding: 2%;
    }
    img {
        width: 200px;
        border-radius: 10%;
    }
    .text-container {
        width: 70%;
        margin: 2%;
        font-family: Work Sans;
    }
    a {
        color: #000;
    }

    h4{
        font-weight: 400;
    }

    @media (max-width: 850px) {
        .card {
            flex-direction: column;
            align-items: center;
        }
        h1{
            font-size: 1.5em;
        }
        img{
            padding-top: 5%;
        }
    }

</style>

<div class="card">
    <div class="logo-container">
        <img src={image} alt="{name}"/>
    </div>
    <div class="text-container">
        <a href={linkedin} target="_blank"><h1>{name}</h1></a>
        <h4>{position}</h4>
        <p>{description}</p>
    </div>
</div>

