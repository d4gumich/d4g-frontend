<script>
  import logo from '$lib/assets/D4G-Logo-2.png'
  import { base } from '$app/paths';
  let showMenu = false;

  function toggleMenu() {
    showMenu = !showMenu;
    console.log('showMenu:', showMenu);
  }

</script>

<style>
    * {
  box-sizing: border-box;
}

.logo {
    width: 50px;
    height: auto;
}

.nav {
  width: 100%;
  /* border-bottom: 2px solid rgba(34,36,38,.15); */
  /* margin-left: auto!important;
  margin-right: auto!important; */

  padding: 15px 171px;
  /* gap: 10px; */
  /* position: absolute; */
  border-bottom: 2px solid rgba(34, 36, 38, 0.15);
  background: #DDD0C8;
  display: flex;
  /* justify-content: center; */
  align-items: center;
  gap: 50px;
}

.nav > .nav-header {
  display: contents;
  width: 100%;
  height: 100%;
}

.nav > .nav-header > .nav-title {
  display: inline-block;
  font-size: 22px;
  color: #fff;
}

.nav > .nav-links {
  display: inline;
  /* float: right; */
  font-size: 1.07142857rem;
  display: flex;
  height: 17px;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.nav > .nav-links > a {
  display: inline-block;
  padding: 10px 10px 10px 10px;
  text-decoration: none;
  color: black;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
}

.nav > .nav-links > a:hover {
  background-color: rgba(227, 184, 120, 1);
  color: #fff;
  border-radius: 20%;
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
  gap: 15px;
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  background-color: #ddd0c8;
  padding: 10px;
}

.nav-links-mobile > a {
  display: block;
  padding: 10px;
  text-decoration: none;
  color: black;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
}

.nav-links-mobile > a:hover {
  background-color: rgba(227, 184, 120, 1);
  color: #fff;
  border-radius: 20%;
}

  /* Use a media query to change the styles for smaller screens */
  @media (max-width: 670px) {
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
       display:flex
     }

     :global(.show-menu) .hamburger-line:nth-child(2) {
       opacity:0
     }

     :global(.show-menu) .hamburger-line:nth-child(1) {
       transform-origin:center center; 
       transform : rotate(45deg);
       position:relative; 
       top :8px
     }

     :global(.show-menu) .hamburger-line:nth-child(3) {
       transform-origin:center center; 
       transform : rotate(-45deg);
       position:relative; 
       top :-8px
     }
  }
</style>


<div class="nav" class:show-menu={showMenu}>
  <div class="nav-header">
     <div class="nav-title">
        <a href='{base}/'><img class='logo' alt='Data4Good logo' src={logo} /></a>
     </div>
  </div>

  <nav class="nav-links">
     <a href="{base}/about">About</a>
     <a href="{base}/news">News</a>
     <a href="{base}/projects">Projects</a>
     <a href="{base}/research">Research</a>
     <a href="{base}/team">Team</a>
     <a href="{base}/faq">FAQ</a>
  </nav>

  <!-- Add the hamburger menu -->
  <div class="hamburger" on:click|preventDefault={toggleMenu}>
    <div class="hamburger-line"></div>
    <div class="hamburger-line"></div>
    <div class="hamburger-line"></div>
  </div>

  <!-- Add the mobile navigation menu -->
  <nav class="nav-links-mobile">
     <a href="{base}/about">About</a>
     <a href="{base}/news">News</a>
     <a href="{base}/projects">Projects</a>
     <a href="{base}/research">Research</a>
     <a href="{base}/team">Team</a>
     <a href="{base}/faq">FAQ</a>
  </nav>
</div>