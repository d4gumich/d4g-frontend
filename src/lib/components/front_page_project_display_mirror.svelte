<script>
  import HangulLogo from "$lib/assets/chetah_logo.png";
  import Button from "./button.svelte";
  import { base } from "$app/paths";
</script>

<div class="cheetah-content-container">
  <div class="cheetah-short-description-container">
    <h1>Chetah</h1>
    <div class="cheetah-short-description">
      Search nonprofit reports published on the web and summarize them
    </div>
    <Button
      text="Try Chetah"
      link={`${base}/projects/chetah1.0`}
      styleAdjustment={`margin: 1.25rem 0 0 0;`}
    />
  </div>
  <div class="cheetah-logo-container">
    <div class="cheetah-logo-dot">
      <img src={HangulLogo} alt="Hangul Logo" class="cheetah-logo" />
    </div>
  </div>
</div>

<style>
  h1 {
    font-family: "Open Sans";
    font-size: 3.5rem;
    color: #232323;
    margin: 0 0 0.5rem 0;
  }

  .cheetah-logo {
    width: 10rem;
    height: auto;
  }

  .cheetah-logo-container {
    position: relative;
    display: inline-block;
    margin: 100px 0 calc(var(--line-height) + 10px) 0;
  }

  .cheetah-logo-container::before,
  .cheetah-logo-container::after {
    content: "";
    position: absolute;
    width: 2px; 
    background: #232323; 
    border-radius: 15%;
  }

  .cheetah-logo-container::before {
    height: var(--line-height); 
    top: calc(-1*var(--line-height)); 
    left: 50%;
    transform: translateX(-50%);
  }

  .cheetah-logo-container::after {
    height: var(--line-height); 
    bottom: calc(-1*calc(var(--line-height) + 10px)); 
    left: 50%;
    transform: translateX(-50%);
  }

  .cheetah-logo-dot:before {
    content: "";
    display: block;
    border-top: 6px solid #232323;
    width: 6px;
    height: auto;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: calc(-1*var(--line-height));
    transform: translateX(-50%);
  }

  .cheetah-logo-dot::after {
    content: "";  
    display: block;
    border-top: 6px solid #232323;
    width: 6px;
    height: auto;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    bottom: calc(-1*calc(var(--line-height) + 10px));
    transform: translateX(-50%);
  }

  .cheetah-short-description {
    font-family: "Open Sans";
    font-size: 1rem;
    color: #232323;
  }

  .cheetah-content-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .cheetah-short-description-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin: -5rem 4rem 0 0;
  }

  @media (max-device-width: 912px) and (min-resolution: 2dppx) {
    h1 {
      font-size: 4rem;
    }

    .cheetah-logo {
      width: 18rem;
    }

    .cheetah-short-description-container {
      margin: 5rem 3rem 0 0;
      width: 50%;
      text-align: right;
    }

    .cheetah-short-description {
      font-size: 2rem;
    }

    .cheetah-logo-container {
      margin: 500px 0 calc(var(--line-height-mobile) + 10px) 0;
    }

    .cheetah-logo-container::before,
    .cheetah-logo-container::after {
      width: 5px;
      border-radius: 15%;
    }

    .cheetah-logo-container::before {
      height: var(--line-height-mobile);
      top: calc(-1*var(--line-height-mobile));
    }

    .cheetah-logo-container::after {
      height: var(--line-height-mobile);
      bottom: calc(-1*calc(var(--line-height-mobile) + 10px));
    }

    .cheetah-logo-dot:before {
      border-top: 20px solid #232323;
      width: 20px;
      height: auto;
      top: calc(-1*var(--line-height-mobile));
    }

    .cheetah-logo-dot::after {
      border-top: 20px solid #232323;
      width: 20px;
      height: auto;
      bottom: calc(-1*calc(var(--line-height-mobile) + 10px));
    }
  }

</style>
