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

    export let index;
</script>

<div class="card-container">
    <div class="card">
        <img src={logo} alt="logo" height="80%" />
        <div class="content">
            <div class="text">
                <h1>{name}</h1>
                <h3>{detail}</h3>
                <!-- two buttons from button component -->
            </div>
            <div class="button-container">
                <Button
                    text="View Research"
                    link="{researchLink}}"
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
        width: 1120px;
        height: 450px;
        margin-top: 55px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 55px;
    }

    .card {
        width: 1120px;
        height: 450px;
        flex-shrink: 0;
        border-radius: 20px;
        border: 1px solid #000;
        background: var(--white, #fff);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        gap: 114px;
        flex-wrap: wrap;
    }

    .card:nth-child(even) {
        display: flex;
        flex-direction: row-reverse;
    }

    .content {
        display: inline-flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .text {
        display: inline-flex;
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

    h3 {
        width: 451px;
        color: rgba(0, 0, 0, 0.87);
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 25px; /* 125% */
    }

    .button-container {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
    }
</style>
