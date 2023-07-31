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
</style>


<div class="nav">
    <div class="nav-header">
      <div class="nav-title">
        <a href ='{base}/'><img class='logo' alt = 'Data4Good logo'src={logo}/></a>
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
  </div>