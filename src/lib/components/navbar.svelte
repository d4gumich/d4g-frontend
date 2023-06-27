<script>
    import logo from '$lib/assets/D4G-Logo-2.png'
    import { base } from '$app/paths';
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
  position: relative;
  margin-left: 0;
  margin-right: 0;
  margin-top: 1%;
  border-bottom: 2px solid rgba(34,36,38,.15);
  width: 1127px;
  margin-left: auto!important;
  margin-right: auto!important;
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
  margin: 0 0 -2px;
  padding: 0.85714286em 1.14285714em;
}

.nav > .nav-links {
  display: inline;
  /* float: right; */
  font-size: 1.07142857rem;  
  padding-right:200px ;
}

.nav > .nav-links > a {
  display: inline-block;
  padding: 13px 10px 13px 10px;
  text-decoration: none;
  color: black;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
}
/* 
.nav > .nav-links > a:hover {
  background-color: #54246c;
  color: #fff;
} */
</style>


<div class="nav">
    <div class="nav-header">
      <div class="nav-title">
        <a href ='{base}/'><img class='logo' alt = 'Data4Good logo'src={logo}/></a>
      </div>
    </div>
    
    <nav class="nav-links">
        <a href="{base}/">About</a>
        <a href="{base}/project">Projects</a>
        <a href="{base}/faq">FAQ</a>
    </nav>
  </div>