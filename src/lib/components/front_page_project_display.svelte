<script>
  import HangulLogo from "$lib/assets/hangul2 copy 2.png";
  import Button from "./button.svelte";
  import { base } from "$app/paths";
</script>

<div class="hangul-content-container">
  <div class="hangul-logo-container">
    <div class="hangul-logo-dot">
      <img src={HangulLogo} alt="Hangul Logo" class="hangul-logo" />
    </div>
  </div>
  <div class="hangul-short-description-container">
    <h1>Hangul</h1>
    <div class="hangul-short-description">
      Process documents and extract summaries from ReliefWeb faster
    </div>
    <Button
      text="Try Hangul"
      link={`${base}/projects/hangul`}
      styleAdjustment={`margin: 1.25rem 0 0 0;`}
    />
  </div>
</div>

<style>
  h1 {
    font-family: "Open Sans";
    font-size: 3.5rem;
    color: #232323;
    margin: 0 0 0.5rem 0;
  }

  .hangul-logo {
    width: 10rem;
    height: auto;
  }

  .hangul-logo-container {
    position: relative;
    display: inline-block;
    margin: 150px 0 calc(var(--line-height) + 10px) 0;
  }

  .hangul-logo-container::before,
  .hangul-logo-container::after {
    content: "";
    position: absolute;
    width: 2px;
    background: #232323;
    border-radius: 15%;
  }

  .hangul-logo-container::before {
    height: var(--line-height);
    top: -130px;
    left: 50%;
    transform: translateX(-50%);
  }

  .hangul-logo-container::after {
    height: var(--line-height);
    bottom: calc(-1*calc(var(--line-height) + 10px));
    left: 50%;
    transform: translateX(-50%);
  }

  .hangul-logo-dot:before {
    content: "";
    display: block;
    border-top: 6px solid #232323;
    width: 6px;
    height: auto;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: -130px;
    transform: translateX(-50%);
  }

  .hangul-logo-dot::after {
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

  .hangul-short-description {
    font-family: "Open Sans";
    font-size: 1rem;
    color: #232323;
  }

  .hangul-content-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .hangul-short-description-container {
    display: flex;
    flex-direction: column;
    align-items: left;
    margin: 0 0 0 4rem;
  }

  @media (max-device-width: 912px) and (min-resolution: 2dppx) {
    h1 {
      font-size: 4rem;
    }

    .hangul-logo {
      width: 18rem;
    }

    .hangul-short-description-container {
      margin: -5rem 0 0 3rem;
      width: 50%;
      text-align: left;
    }

    .hangul-short-description {
      font-size: 2rem;
    }

    .hangul-logo-container {
      margin: 250px 0 calc(var(--line-height-mobile) + 10px) 0;
    }

    .hangul-logo-container::before,
    .hangul-logo-container::after {
      width: 5px;
    }

    .hangul-logo-container::before {
      height: var(--line-height-mobile);
      top: -270px;
      left: 50%;
      transform: translateX(-50%);
    }

    .hangul-logo-container::after {
      height: var(--line-height-mobile);
      bottom: calc(-1*calc(var(--line-height-mobile) + 10px));
    }

    .hangul-logo-dot:before {
      border-top: 20px solid #232323;
      width: 20px;
      height: auto;
      top: -270px;
    }

    .hangul-logo-dot::after {
      border-top: 20px solid #232323;
      width: 20px;
      height: auto;
      bottom: calc(-1*calc(var(--line-height-mobile) + 10px));
    }
  }
</style>
