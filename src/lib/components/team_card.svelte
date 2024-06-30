<script>
  // Define the props for the card component
  export let name;
  export let position;
  export let description;
  export let linkedin;
  export let image;

  import LinkedIn from "svelte-material-icons/LinkBox.svelte";
  import { PHONE_SCREEN_WIDTH } from "$lib/assets/constants/constants.js"
  import { onMount } from "svelte"

  let isMobile = false
  let linkedinIconSize = "1.8rem"

  $: linkedinIconSize = isMobile ? "10rem" : "1.8rem"

  onMount(() => {
    if (screenWidth <= PHONE_SCREEN_WIDTH) {
      isMobile = true
    }
    else {
      isMobile = false
    }
  })
</script>

<div class="card">
  <div class="logo-container">
    <img src={image} alt={name} />
  </div>
  <div class="text-container">
    <a href={linkedin} target="_blank"><h1>{name}</h1><LinkedIn size={linkedinIconSize} color="#0077B5"/></a>
    <h4>{position}</h4>
    <p>{description}</p>
  </div>
</div>

<style>
  h1 {
    margin: 0 0.5rem 0 0; 
  }
    .card {
        display: flex;
        flex-direction: row;
        border-radius: 20px;
        border: 2px solid var(--text-color-main);
        margin: 1rem 0;
        padding: 3rem 3rem;
    }
    .logo-container {
        display: flex;
        align-items: center;
    }
    img {
        width: 200px;
        border-radius: 10%;
    }
    .text-container {
        width: 70%;
        margin: 0 0 0 2rem;
        font-family: "Work Sans";
    }
    a {
        color: var(--text-color-main);
        text-decoration: none;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    h4{
        font-weight: 400;
    }

    @media (max-device-width: 912px) and (min-resolution: 2dppx) {
        .card {
            flex-direction: column;
            align-items: center;
            padding: 3rem 0.1rem;
        }

        h1{
            font-size: 3rem;
            margin: 0 0 1rem 0;
        }

        .text-container {
            width: 80%;
            margin: 3rem 0 0 0;
            align-items: center;
            text-align: center;
        }

        a {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h4 {
          font-size: 3rem;
        }

        .text-container p {
          font-size: 4rem;
        }
    }

</style>
