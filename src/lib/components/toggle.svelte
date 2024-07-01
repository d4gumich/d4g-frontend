<!-- Toggle.svelte -->
<script>
  import {
    PHONE_SCREEN_WIDTH,
    HANGUL_VERSIONS,
    HANGUL_PROJECT_NAME,
  } from "$lib/assets/constants/constants.js";

  export let version;
  export let analyzing;
  export let width;

  let blockSliderStyle = ``;

  $: {
    if (analyzing) {
      blockSliderStyle = `background-color: white; box-shadow: 0 0 0 white;`;
    } else {
      blockSliderStyle = ``;
    }
  }

  const toggleVersion = () => {
    if (version === 1) {
      version = 2;
    } else {
      version = 1;
    }
  };
</script>

<div class="toggle-container">
  <p
    class="text"
    style={(version === HANGUL_VERSIONS[0] && width > PHONE_SCREEN_WIDTH)
      ? `font-weight:800;`
      : ``}
  >
    {HANGUL_PROJECT_NAME}{HANGUL_VERSIONS[0]}.0
  </p>
  <label class="switch">
    <input
      type="checkbox"
      on:change={toggleVersion}
      checked={version === 2}
      disabled={analyzing}
    />
    <span class="slider round" style={blockSliderStyle} />
  </label>
  <p
    class="text"
    style={(version === HANGUL_VERSIONS[1] && width > PHONE_SCREEN_WIDTH)
      ? `font-weight:800;`
      : ``}
  >
    {HANGUL_PROJECT_NAME}{HANGUL_VERSIONS[1]}.0
  </p>
</div>

<style>
  .toggle-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.5rem 0 0 0;
    border: dashed 0.2rem #d7d7d7;
    border-radius: 0.2rem;
    width: max-content;
    padding: 0.5rem 0.7rem;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 2.7rem;
    height: 1.5rem;
    margin: 0 0.5rem;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--background-color-light);
    box-shadow: -0.2rem 0.05rem 0.1rem #d7d7d7;
    -webkit-transition: 0.4s;
    transition: 1s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.3rem;
    width: 1.3rem;
    left: -0.1rem;
    bottom: 0.05rem;
    background-color: var(--button-color);
    -webkit-transition: 0.4s;
    transition: 0.4s;
    box-shadow: 0.1rem 0rem 0.1rem rgb(177, 125, 47);
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(1.25rem);
    -ms-transform: translateX(1.25rem);
    transform: translateX(1.25rem);
  }

  .slider.round {
    border-radius: 1rem;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  .text {
    margin: 0;
    color: var(--text-color-main);
    font-family: "Open Sans";
    font-size: 0.9rem;
    font-weight: 400;
    line-height: 25px;
    transition: font-weight 300ms ease-in-out;
  }

  @media (max-device-width: 912px) and (min-resolution: 2dppx) {
    .toggle-container {
      padding: 2rem 1.5rem;
    }

    .text {
      margin: 0 0.5rem;
      font-size: 1.7rem;
    }

    .switch {
      width: 6rem;
      height: 3rem;
      margin: 0 0.5rem;
    }

    .slider {
      box-shadow: -0.4rem 0.1rem 0.1rem #d7d7d7;
    }

    .slider:before {
      height: 3rem;
      width: 3rem;
    }

    input:checked + .slider:before {
      -webkit-transform: translateX(3rem);
      -ms-transform: translateX(3rem);
      transform: translateX(3rem);
    }

    .slider.round {
      border-radius: 2rem;
    }
  }
</style>
