<script>
  import logo from "$lib/assets/D4G-Logo-2.png"
  import { PHONE_SCREEN_WIDTH } from "$lib/assets/constants/constants.js"
  import { base } from "$app/paths"
  import { onMount } from "svelte"

  let isMobile = false
  let isHambugerChecked = false
  let enableNavBarBackground = false
  let navBarTransparency = 0;
  let navBarBorder = `border-bottom: none;`
  let hamburgerColor = `background-color: var(--text-color-light);`
  let screenWidth
  let onHomePage = true

  $: navBarColor = `background-color: rgba(255, 252, 243, ${navBarTransparency});`

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

    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navBarTransparency = 1
      } else {
        if (!isHambugerChecked && !enableNavBarBackground) {
          navBarTransparency = 0
        }
        
      }
    });
    
  })

  const fadeOutNavBar = () => {
    setTimeout(() => {
      navBarTransparency = 0
      enableNavBarBackground = false
    }, 300)
  }

  const handleHambugerItemClick = () => {
    fadeOutNavBar();
    isHambugerChecked = false;
    onHomePage = false;
  }

  const handleD4GLogoItemClick = () => {
    fadeOutNavBar();
    isHambugerChecked = false;
    onHomePage = true;
  }

  $: console.log("onHomePage", onHomePage)

  const handleHamburgerClick = () => {
    if (!enableNavBarBackground) {
      navBarTransparency = 1

      setTimeout(() => {
        enableNavBarBackground = true
      }, 300)
    }
    else {
      fadeOutNavBar()
    }
  }

  $: {
    if (navBarTransparency > 0 || isHambugerChecked) {
      navBarBorder = `border-bottom: var(--text-color-main) 0.1rem solid;`
      hamburgerColor = `background-color: var(--text-color-main);`
    }
    else {
      navBarBorder = `border-bottom: none;`
      if (onHomePage) {
        hamburgerColor = `background-color: var(--text-color-light);`
      }
    }

    if (!onHomePage) {
      hamburgerColor = `background-color: var(--text-color-main);`
    }
  }

</script>

<div class="nav" style={navBarColor + navBarBorder}>
  <div class="nav-header">
    <a href="{base}/" style={`margin:0; padding:0;`} on:click={handleD4GLogoItemClick}>
      <img class="logo" alt="Data4Good Logo" src={logo} />
    </a>
  </div>

  {#if !isMobile}
    <nav class="nav-links">
      <a href="{base}/about">About</a>
      <a href="{base}/news">News</a>
      <a href="{base}/projects">Projects</a>
      <a href="{base}/research">Research</a>
      <a href="{base}/team">Team</a>
      <a href="{base}/faq">FAQ</a>
      <div class="dot" />
    </nav>
  {/if}

  {#if isMobile}
    <section class="p-menu1">
      <nav id="navbar" class="navigation">
        <input id="toggle1" type="checkbox" bind:checked={isHambugerChecked} on:click={handleHamburgerClick}/>
        <label class="hamburger1" for="toggle1">
          <div class="top" style={hamburgerColor}/>
          <div class="meat" style={hamburgerColor}/>
          <div class="bottom" style={hamburgerColor}/>
        </label>

        <nav class="menu1">
          <a class="link1" href="{base}/about" on:click={handleHambugerItemClick}>About</a>
          <a class="link1" href="{base}/news" on:click={handleHambugerItemClick}>News</a>
          <a class="link1" href="{base}/projects" on:click={handleHambugerItemClick}>Projects</a>
          <a class="link1" href="{base}/research" on:click={handleHambugerItemClick}>Research</a>
          <a class="link1" href="{base}/team" on:click={handleHambugerItemClick}>Team</a>
          <a class="link1" href="{base}/faq" on:click={handleHambugerItemClick}>FAQ</a>
        </nav>
      </nav>
    </section>
  {/if}
</div>

<style>
  * {
    box-sizing: border-box;
    font-family: "Open Sans";
    color: var(--text-color-main);
  }

  .logo {
    margin: 5px 0 0 0;
    width: 3.5rem;
    height: auto;
  }

  .nav {
    position: sticky;
    top: 0;
    z-index: 900;
    width: 100%;
    padding: 0.5rem 0 0.5rem 10rem;
    display: flex;
    align-items: center;
    transition: all 0.2s ease;
  }

  .nav .nav-header {
    margin-right: 1.5rem;
  }

  .nav-links {
    display: flex;
    height: 17px;
    width: 100%;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .nav-links a {
    text-decoration: none;
    font-size: 1.1rem;
    font-weight: 500;
    display: inline-block;
    position: relative;
    bottom: 0.05rem;
    margin: 0 1.25rem;
    /* width: 80px; */
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.1s ease-in-out;
  }

  .nav-links a:hover {
    font-weight: 800;
  }

  .nav-links a::after {
    content: "";
    position: absolute;
    bottom: -7px;
    left: 0;
    width: 100%;
    height: 3px;
    background: rgba(227, 184, 120, 1);
    transform: scaleX(0);
    transition: transform 0.2s ease-in-out;
  }

  .nav-links a:hover::after {
    transform: scaleX(1);
  }

  a {
    color: var(--text-color-main);
    text-decoration: none;
  }

  .p-menu1 {
    width: 100%;
    height: 100%;
  }

  .hamburger1 {
    height: 5rem;
    margin: 30px;
    display: -ms-grid;
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    justify-items: right;
    z-index: 120;
  }

  .hamburger1 div {
    background-color: var(--text-color-light);
    position: relative;
    width: 5rem;
    height: 8px;
    margin-top: 10px;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }

  #toggle1 {
    display: none;
  }

  #toggle1:checked + .hamburger1 div {
    background-color: var(--text-color-main);
  }

  #toggle1:checked + .hamburger1 .top {
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    margin-top: 22.5px;
  }

  #toggle1:checked + .hamburger1 .meat {
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    margin-top: -5px;
  }

  #toggle1:checked + .hamburger1 .bottom {
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  #toggle1:checked ~ .menu1 {
    height: 600px;
  }

  .menu1 {
    width: 100%;
    background-color: var(--background-color-light);
    margin: 0 1rem 0 0;
    display: -ms-grid;
    display: grid;
    grid-template-rows: 1fr repeat(4, 0.5fr);
    grid-row-gap: 25px;
    padding: 0;
    list-style: none;
    clear: both;
    width: auto;
    text-align: right;
    height: 0px;
    overflow: hidden;
    transition: height 0.4s ease;
    z-index: 120;
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;
  }

  .menu1 a:first-child {
    margin-top: 1rem;
  }

  .menu1 a:last-child {
    margin-bottom: 100px;
  }

  .link1 {
    width: 100%;
    margin: 0;
    padding: 0 1rem 0 0;
    font-size: 3rem;
  }

  .link1:hover {
    background-color: none;
    color: var(--text-color-main);
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;
  }

  @media (max-device-width: 912px) {
    .nav {
      padding: 15px;
      justify-content: space-between;
      gap: initial;
      transition: background-color 0.2s ease;
      margin-top: 2rem;
    }

    .nav-links {
      display: none !important;
    }

    .nav-header {
      margin: 0;
    }

    .logo {
      margin: 10px 0 0 1rem;
      width: 8rem;
      height: auto;
    }
  }
</style>
