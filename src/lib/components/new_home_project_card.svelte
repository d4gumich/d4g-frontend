<script>
    // Define the props for the card component
    export let text;
    export let link;
    export let icon;

</script>
  
<style>
    /* Add any styles specific to the card component */

    a {
        text-decoration: none;
    }

    .card{
        width: 260px;
        height: 326px;
        border-radius: 20px;
        border: 1px solid #000;
        background: #1B3350;
        justify-content: center;
        align-items: center;
        align-content: center;
        gap: 114px;
        flex-wrap: wrap;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        cursor: pointer; /* Add this to show pointer cursor on hover */

    }

    .content{
        display: inline-flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    h1{
        width: auto;
        color: #FAEFEF;
        text-align: center;
        font-family: Lato;
        font-size: 40px;
        font-style: normal;
        font-weight: 700;
        line-height: 50px; /* 140% */
        margin: 0;
        text-underline-offset: 15px;
        text-decoration: none;
    }

    @media (max-device-width: 912px) and (min-resolution: 2dppx) {
        .card{
            width: 130px;
            height: 200px;
        }

        /* Update the styles for the img element inside the .card element */
        .card img {
            height: 20%;
        }

        h1{
            font-size: 20px;
        }
    }

</style>

<a href="{link}" target="_blank">
    <div class="card">
        <img src={icon} alt="logo" height="30%"/>
        <div class="content">
            <h1>{text}</h1>
        </div>
    </div>
</a>
