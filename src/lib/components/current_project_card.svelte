<script>
    // Define the props for the card component
    export let name;
    export let detail;
    // export let link_research;
    // export let link_try;
    export let logo;
    export let researchLink;
    export let tryLink;
    import Button from "./button.svelte";
</script>

<div class="card-container">
    <div class="card">
        <img src={logo} alt="logo" height="30%" />
        <div class="content">
            <div class="text">
                <h1>{name}</h1>
                <h3>{detail}</h3>
                <!-- two buttons from button component -->
            </div>
            <div class="button-container">
                <Button
                    text="View Research"
                    link={researchLink}
                    styleAdjustment={`margin: 0;`}
                />
                <Button text="Try {name}" link={tryLink} />
            </div>
        </div>
    </div>
</div>

<style>
    /* Add any styles specific to the card component */
    .card-container {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: 68px;
    }

    .card {
        display: flex;
        width: auto;
        max-width: 400px;
        height: 800px;
        padding: 0px 86px;
        flex-direction: column;
        align-items: center;
        justify-content: center; /* Center content vertically */
        gap: 47px;
        flex-shrink: 0;
        border-radius: 15px;
        border: 1px solid #000;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    h1 {
        width: auto;
        color: rgba(0, 0, 0, 0.87);
        text-align: center;
        font-family: Lato;
        font-size: 50px;
        font-style: normal;
        font-weight: 700;
        line-height: 70px; /* 140% */
        margin: 0;
        text-decoration: underline rgba(227, 184, 120, 1) 3px;
        text-underline-offset: 15px;
    }

    .button-container {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        margin-bottom: 2rem;
    }

    h3 {
        /* width: 451px; */
        color: rgba(0, 0, 0, 0.87);
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 25px; /* 125% */
        width: auto;
    }

    @media (max-width: 600px) {
        .card {
            max-width: 50%;
            height: auto;
            padding: 0px 60px;
        }

        .content {
            width: 120%;
        }

        img {
            height: 10em;
            padding-top: 10%;
        }

        h1 {
            font-size: 25px;
        }

        h3 {
            font-size: 10px;
        }
    }
</style>
