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
        max-width: 70%;
        flex-direction: column;
        align-items: center;
        justify-content: center; /* Center content vertically */
        flex-shrink: 0;
        display: flex;
        gap: 10px;
        background-repeat: no-repeat;
        background-size: cover;
        line-height: 1.4285em;
        background-position: 30% 0;
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

    img{
        background-repeat: no-repeat;
        background-size: cover;
        /* margin: 0 !important; */
        display: block;
        /* -webkit-text-size-adjust: 100%; */
        /* min-width: 320px; */
        line-height: 1.4285em;
        /* padding-right: 0px;
        padding-left: 0px; */
        width: 100%;
        /* height: 50%; */
        flex: 1 0 0;
        align-self: stretch;
        /* margin-top: 5%; */
        background-position: 30% 0;
        width: 20em;
        height: 12em;
        object-fit: cover;

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
