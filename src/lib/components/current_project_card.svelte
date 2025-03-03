<script>
  export let name;
  export let detail;
  export let logo;
  export let buttonText;
  export let researchLink;
  export let tryLink;
  import { PHONE_SCREEN_WIDTH } from "$lib/assets/constants/constants.js"
  import Button from "./button.svelte"
  import { onMount } from "svelte"

  let isMobile = false
  let screenWidth

  onMount(() => {
    if (typeof window !== 'undefined') {
      screenWidth = window.screen.width
    }

    if (screenWidth <= PHONE_SCREEN_WIDTH) {
      isMobile = true
    }
    else {
      isMobile = false
    }
  })
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
        <div class="button">
          <Button
            text={buttonText}
            link={researchLink}
            styleAdjustment={`margin: 0;`}
          />
        </div>
        <div class="button">
          <Button
            text="Try {name}"
            link={tryLink}
            styleAdjustment={isMobile ? `margin: 1rem 0 0 0;` : 'margin: 0 0 0 1rem;'}
          />
        </div>
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
    font-weight: 500;
    line-height: 70px; /* 140% */
    margin: 0;
    text-decoration: underline rgba(227, 184, 120, 1) 3px;
    text-underline-offset: 15px;
  }

  .button-container {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    margin-bottom: 2rem;
  }

  .button{
    text-align: center;
    display:table-cell;
    vertical-align:middle;
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

  @media (max-device-width: 912px) and (min-resolution: 2dppx) {
    .card {
      max-width: calc(80% - 6rem);
      height: auto;
      padding: 3rem;
    }

    .content {
      width: 100%;
    }

    img {
      height: 20rem;
      padding-top: 10%;
    }

    h1 {
      font-size: 3rem;
      margin: 0;
      padding: 0;
    }

    h3 {
      font-size: 2rem;
      line-height: 3rem;
      padding: 0;
      margin: 1rem 0;
    }

    .text {
      gap: 0;
    }

    .button-container {
      flex-direction: column;
    }
  }
</style>
