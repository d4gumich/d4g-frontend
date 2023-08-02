<script>
    // Define the props for the card component
    export let image;
    export let category;
    export let title;
    export let date;

</script>
  
  <style>
    /* Add any styles specific to the card component */
    .card-container{
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        flex-wrap: wrap;
    }

    .card{
        width: auto;
        max-width: 65%;
        flex-direction: column;
        align-items: center;
        justify-content: center; /* Center content vertically */
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .content{
        display: inline-flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .text{
        display: inline-flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    h1{
        width: auto;
        color: rgba(0, 0, 0, 0.87);
        text-align: center;
        font-family: Lato;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        margin: 0;
        text-decoration: underline rgba(227, 184, 120, 1) 3px;
        text-underline-offset: 10px;

        color: #000;
        font-family: Roboto;
        font-style: normal;
        font-weight: 700;
        line-height: 30px;
    }

    h2{
        color: rgba(0, 0, 0, 0.87);
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 25px;
        margin: 0;
    }

    h3{
        color: rgba(0, 0, 0, 0.87);
        font-family: Open Sans;
        font-style: normal;
        margin: 0;

        color: rgba(0, 0, 0, 0.75);
        font-family: Roboto;
        font-size: 15px;
        font-style: normal;
        font-weight: 200;
        line-height: 10px; /* 66.667% */
    }

  </style>

<div class="card-container">
    <div class="card">
        <img src={image} alt="logo" height="30%"/>
        <div class="content">
            <div class="text">
                <h1>{category}</h1>
                <h2>{title}</h2>
                <h3>{date}</h3>
                <!-- two buttons from button component -->
            </div>
        </div>
    </div>
</div>
