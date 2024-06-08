<script>
    // Define the props for the card component
    export let name;
    export let position;
    export let linkedin;
    export let startYear;
    export let endYear;

    import LinkedIn from "svelte-material-icons/linkedin.svelte"
</script>

<style>
    .card {
        display: flex;
        flex-direction: row;
        border-radius: 20px;
        border: 2px solid var(--text-color-main);
        width: 300px;
        margin: 1rem 0;
    }
    .text-container {
        width: 100%;
        font-family: "Open Sans";
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
    }
    a {
        color: #000;
        text-decoration: none;
        margin: 0;
        display: flex;
        flex-direction: row;
    }

    h5 {
        font-family: "Open Sans", sans-serif;
        margin: 0.2rem 0;
        padding: 0;
        font-size: 1rem;
    }

    p {
        font-family: "Open Sans", sans-serif;
        margin: 0; 
        font-size: 1rem; 
    }

    h3 {
        margin: 0 0.2rem 0 0;
        padding: 0;
    }
</style>

<div class="card">
    <div class="text-container">
        <a href={linkedin} target="_blank"><h3>{name}</h3><LinkedIn size="1.5rem" color="#0077B5"/></a>
        <h5>{position}</h5>
        <p>{startYear} - {endYear}</p>
    </div>
</div>

