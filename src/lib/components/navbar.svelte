<script>
  import logo from "$lib/assets/D4G-Logo-2.png";
  import { base } from "$app/paths";
  let showMenu = false;

  function toggleMenu() {
    showMenu = !showMenu;
    console.log("showMenu:", showMenu);
  }

  function resetMenu() {
    showMenu = false;
  }
</script>

<div class="nav" class:show-menu={showMenu}>
  <div class="nav-header">
    <a href="{base}/" on:click={resetMenu} style={`margin:0; padding:0;`}>
      <img class="logo" alt="Data4Good Logo" src={logo} />
    </a>
  </div>

  <nav class="nav-links">
    <a href="{base}/about">About</a>
    <a href="{base}/news">News</a>
    <a href="{base}/projects">Projects</a>
    <a href="{base}/research">Research</a>
    <a href="{base}/team">Team</a>
    <a href="{base}/faq">FAQ</a>
    <div class="dot" />
  </nav>

  <!-- Add the hamburger menu -->
  <div class="hamburger" on:click|preventDefault={toggleMenu}>
    <div class="hamburger-line" />
    <div class="hamburger-line" />
    <div class="hamburger-line" />
  </div>

  <!-- Add the mobile navigation menu -->
  <nav class="nav-links-mobile">
    <a href="{base}/about" on:click={resetMenu}>About</a>
    <a href="{base}/news" on:click={resetMenu}>News</a>
    <a href="{base}/projects" on:click={resetMenu}>Projects</a>
    <a href="{base}/research" on:click={resetMenu}>Research</a>
    <a href="{base}/team" on:click={resetMenu}>Team</a>
    <a href="{base}/faq" on:click={resetMenu}>FAQ</a>
  </nav>
</div>

<style>
  * {
    box-sizing: border-box;
    font-family: "Open Sans";
    color: black;
  }

  .logo {
    width: 3.5rem;
    height: auto;
  }

  .nav {
    position: sticky;
    top: 0;
    z-index: 900;
    width: 100%;
    padding: 0.5rem 0 0.5rem 10rem;
    background: #DDD0C8;
    display: flex;
    align-items: center;
    box-shadow: 0.1rem 0.1rem 0.5rem rgba(0, 0, 0, 0.1);
  }

  .nav .nav-header {
    margin-right: 1.5rem;
  }

  .nav-links {
    display: flex;
    height: 17px;
    justify-content: center;
    align-items: center;
  }

  .nav-links a {
    text-decoration: none;
    font-size: 1.1rem;
    text-transform: uppercase;
    font-weight: 500;
    display: inline-block;
    position: relative;
    bottom: 0.05rem;
    margin-right: 1.5rem;
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

  /* Add styles for the hamburger menu */
  .hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
  }

  .hamburger-line {
    width: 25px;
    height: 3px;
    background-color: black;
    margin: 5px;
  }

  /* Add styles for the mobile navigation menu */
  .nav-links-mobile {
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background-color: #ddd0c8;
    padding: 1.5rem;
  }

  .nav-links-mobile > a {
    display: block;
    padding: 10px;
    text-decoration: none;
    color: black;
    font-family: "Roboto", sans-serif;
    font-weight: 400;
  }

  .nav-links-mobile > a:hover {
    font-weight: 800;
  }

  /* Use a media query to change the styles for smaller screens */
  @media (max-width: 780px) {
    .nav {
      padding: 15px;
      justify-content: space-between;
      gap: initial;
    }

    .nav-links {
      display: none !important;
    }

    .hamburger {
      display: flex;
    }

    /* Show the mobile navigation menu when showMenu is true */
    :global(.show-menu) .nav-links-mobile {
      display: flex;
    }

    :global(.show-menu) .hamburger-line:nth-child(2) {
      opacity: 0;
    }

    :global(.show-menu) .hamburger-line:nth-child(1) {
      transform-origin: center center;
      transform: rotate(45deg);
      position: relative;
      top: 8px;
    }

    :global(.show-menu) .hamburger-line:nth-child(3) {
      transform-origin: center center;
      transform: rotate(-45deg);
      position: relative;
      top: -17px;
    }
  }
</style>
