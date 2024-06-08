<script>
  import { PHONE_SCREEN_WIDTH } from "$lib/assets/constants/constants.js"
  import { onMount } from "svelte"
  import NewsCard from "$lib/components/news_card.svelte"
  import Button from "$lib/components/button.svelte"
  import { base } from "$app/paths"
  import Poster from "$lib/assets/UMSI Exposition - Sidra & Prithvi 17-Apr-23.jpg"
  import FrontPageProjectDisplay from "$lib/components/front_page_project_display.svelte"
  import FrontPageProjectDisplayMirror from "$lib/components/front_page_project_display_mirror.svelte"

  let isMobile = false;
  let screenWidth;

  const latest_news = [
    {
      image: Poster,
      category: "Exposition",
      title: "UMSI Exposition by Sidra and Prithvi on Hangul",
      date: "April 17th 2023",
    },
  ];

  const scrollToBottom = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }

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

  $: console.log("isMobile", isMobile)
</script>

<svelte:head>
  <title>Data4Good</title>
</svelte:head>

<div class="home">
  <div class="hero">
    <div class="hero-container">
      <div class="contain-text">
        <h3>Empowering nonprofits with data</h3>
        <h1>Data4Good</h1>
      </div>
      <button class="main-title-button" on:click={scrollToBottom}>
        Learn More
      </button>
    </div>

  </div>
  <div class="about-container">
    <h2>Connecting data, research and implementation to help create stronger nonprofit organizations</h2>
    <Button
          text="About Us"
          link="{base}/about"
          styleAdjustment={`margin:1rem 0 0 0;`}
        />
  </div>

  <div class="section">
    <div class="section-title">Latest Work</div>
    <FrontPageProjectDisplay />
    <FrontPageProjectDisplayMirror />
    {#if !isMobile}
      <div class="button-container-dot-left"></div>
    {/if}
    <div class="button-container">
      <Button
        text="See All Projects"
        link="{base}/projects"
        styleAdjustment={`margin:0 5% 0 0;`}
      />
      <Button
        text="See All Research"
        link="{base}/research"
        styleAdjustment={`margin:0 0 0 0;`}
      />
    </div>
    {#if !isMobile}
      <div class="button-container-dot-right"></div>
    {/if}
  </div>

  <div class="section">
    <div class="section-title">The Latest News</div>
    <div class="section-content news">
      {#each latest_news as news}
        <NewsCard {...news} />
      {/each}
    </div>
  </div>
</div>

<style>
  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 4%;
    background: var(--background-color-light);
  }

  .hero {
    display: block;
    background-image: url("$lib/assets/d4g-background-edit-2.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;
    width: 100%;
    align-self: stretch;
    height: calc(100vh + 20px);
    transform: translateY(-100px);
    margin-bottom: -0px;
  }

  .contain-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: flex-start;
    justify-content: center;
    width: max-content;
    height: 100%;
  }

  .hero h1 {
    position: relative;
    font-size: 6.1rem;
    text-align: initial;
    font-family: century-gothic, sans-serif;
    font-weight: 600;
    font-style: normal;
    text-transform: uppercase;
    width: max-content;
    margin: 1rem 0;
    padding: 0;
    color: rgba(255, 252, 243, 0.9);
    text-shadow: 0.5rem 0.4rem 0rem rgba(35,35,35,0.7);
  }

  .hero h3 {
    font-size: 1.65rem;
    font-family: century-gothic, sans-serif;
    font-weight: 300;
    text-transform: uppercase;
    color: rgba(35,35,35,0.7);
    text-shadow: none;
    margin: 0 0 0 0.5rem;
    padding: 0;
  }

  .main-title-button {
    background-color: rgba(255, 255, 255, 0.2);
    border: solid 2px rgba(255, 255, 255, 0);
    border-radius: 3rem;
    box-sizing: border-box;
    color: var(--text-color-light);
    cursor: pointer;
    line-height: normal;
    outline: none;
    padding: 1.5rem 3rem;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
    font-family: century-gothic, sans-serif;
    width: max-content;
    margin: 1rem 0 0 0.1rem;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 700;
    transition: all 500ms ease;
  }

  .main-title-button:hover {
    background-color: rgba(255, 255, 255, 0.5);
    border: solid 2px rgba(255, 255, 255, 0.8);
  }

  .about-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 50%;
    margin: 0 0 3rem 0;
  }

  .about-container h2 {
    font-size: 1.5rem;
    margin: 0 0 2rem 0;
    padding: 0;
  }

  .section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 0 20px 0;
    gap: 10%;
    width: 100%; /* Make the sections cover the whole width */
    align-items: center;
  }

  .section-title {
    color: var(--text-color-main);
    font-family: "Open Sans";
    font-size: 3.5rem;
    font-style: normal;
    font-weight: 700;
    margin: 2rem 0 0 0;
  }

  .section-content {
    flex: 1;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: flex-start;
    gap: 4%;
    padding-top: 2%;
    padding-bottom: 2%;
  }

  .news {
    gap: 0%;
  }

  .hero-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: flex-start;
    justify-content: space-between;
    width: max-content;
    margin: calc(100vh * 0.35) 0 0 11rem;
  }

  .button-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 0;
    padding: 2rem 0;
  }

  .button-container-dot-left {
    width: 6px;
    height: 6px;
    background-color: var(--text-color-main);
    border-radius: 50%;
    position: relative;
    margin: 3rem 0 0 0;
    left: -120px;
  }

  .button-container-dot-left::before {
    content: "";
    position: absolute;
    height: 2px;
    width: 1000px;
    background-color: black;
    top: 50%;
    left: -1000px;
    transform: translateY(-50%);
  }

  .button-container-dot-right {
    width: 6px;
    height: 6px;
    background-color: var(--text-color-main);
    border-radius: 50%;
    position: relative;
    margin: 0 0 1rem 0;
    right: -120px;
  }

  .button-container-dot-right::before {
    content: "";
    position: absolute;
    height: 2px;
    width: 1000px;
    background-color: black;
    top: 50%;
    right: -1000px;
    transform: translateY(-50%);
  }

  @media (max-device-width: 912px) and (min-resolution: 2dppx) {
  /* Styles for small, high-resolution mobile devices in portrait mode */
    .section-title {
      margin: 0;
    }

    .hero {
      margin: 0;
    }

    .hero-container {
      margin: 10rem;
      padding: 0;
    }

    .about-container {
      width: 95%;
      margin: 0 0 3rem 0;
    }

    .section-title {
      font-size: 3rem;
      margin: 2rem 0 2rem 0 ;
    }

    .button-container {
      margin: 10rem 0 0 0;
      background-color: transparent;
      border: none;
      width: 95%;
      border-radius: 0.5rem;
      box-shadow: var(--text-color-main) 4px 4px 0px;
    }
  }
</style>
