<script>
    // Define the props for the card component
    export let name;
    export let detail;
    export let researchLink;
    export let type;
    import Button from "./button.svelte";
</script>

<div class="card">
    <div class="content">
        <div class="text">
            <h1>{name}</h1>
            <h3>{detail}</h3>
            <!-- two buttons from button component -->
        </div>
        <div class="button-container">
            <Button
                text="View {type}"
                link={researchLink}
                styleAdjustment={`margin: 0;`}
            />
        </div>
    </div>
</div>

<style>
    /* Add any styles specific to the card component */

    .card {
        display: flex;
        /* padding: 0px 86px; */
        flex-direction: column;
        align-items: center;
        justify-content: center; /* Center content vertically */
        gap: 47px;
        flex-shrink: 0;
        border-radius: 15px;
        border: 1px solid #000;
        width: 375px;
        height: 400px;
        flex-shrink: 0;
    }

    h1 {
        display: flex;
        width: 300px;
        height: auto;
        flex-direction: column;
        justify-content: center;
        flex-shrink: 0;
        color: #000;
        font-family: Work Sans;
        font-size: 23px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        margin: auto;
    }

    h3 {
        display: flex;
        width: 304px;
        height: 153px;
        flex-direction: column;
        justify-content: center;
        flex-shrink: 0;
        color: rgba(0, 0, 0, 0.87);
        font-family: Open Sans;
        font-size: 17px;
        font-style: normal;
        font-weight: 400;
        line-height: 25px; /* 147.059% */
    }

    .button-container {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
    }
</style>
