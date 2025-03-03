<script>
    // Define the props for the card component
    export let name;
    export let position;
    export let linkedin;
    export let startYear;
    export let endYear;

    import LinkedIn from "svelte-material-icons/LinkBox.svelte"
    import { PHONE_SCREEN_WIDTH } from "$lib/assets/constants/constants.js";
    import { onMount } from "svelte";

    let isMobile = false;
    let screenWidth;

    onMount(() => {
        if (typeof window !== "undefined") {
        screenWidth = window.screen.width;
        }

        if (screenWidth <= PHONE_SCREEN_WIDTH) {
        isMobile = true;
        } else {
        isMobile = false;
        }
    });
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
        align-items: center;
    }

    h5 {
        font-family: "Open Sans", sans-serif;
        margin: 0.2rem 0;
        padding: 0;
        font-size: 1rem;
        text-align: center;
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

    @media (max-device-width: 912px) and (min-resolution: 2dppx) {
        .card {
            width: 100%;
            padding: 1rem 0;
            margin: 1rem 0;
            }
            .text-container {
                font-size: 2rem;
            }
        h5 {
            font-size: 2rem;
            font-weight: 200;
            text-align: center;
        }

        p {
            font-size: 2rem;
        }
    }
</style>

<div class="card">
    <div class="text-container">
        <a href={linkedin} target="_blank">
            <h3>{name}</h3>
            {#if isMobile}
                <LinkedIn size="3rem" color="#0077B5"/>
            {:else}
                <LinkedIn size="1.5rem" color="#0077B5"/>
            {/if}
        </a>
        <h5>{position}</h5>
        <p>{startYear} - {endYear}</p>
    </div>
</div>

