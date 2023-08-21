<script>
  // Import the components from the components folder
  // import Card from '$lib/components/card.svelte';
  // import ProjCard from '$lib/components/home_project_card.svelte';
  import Card from '$lib/components/new_home_project_card.svelte';
  import NewsCard from '$lib/components/news_card.svelte';
  import Button from "$lib/components/button.svelte";
  import { base } from '$app/paths';
  import ProjectIcon from '$lib/assets/icons8-project-100.png'
  import ResearchIcon from '$lib/assets/icons8-research-100.png'
  import Poster from '$lib/assets/UMSI Exposition - Sidra & Prithvi 17-Apr-23.jpg'

  // Define some data for the cards

  const category = [
    {
      text: 'Projects',
      link: `${base}/projects/`,
      icon: ProjectIcon
    },
    {
      text: 'Research',
      link: `${base}/research/`,
      icon: ResearchIcon
    }
  ];

  const latest_news = [
    {
      image: Poster,
      category: 'Exposition',
      title: "UMSI Exposition by Sidra and Prithvi on Hangul",
      date: 'April 17th 2023'
    }
  ]

</script>

<style>
  .a{
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--background, #F5F5F5);
    padding-bottom: 4%;
  }

  .hero {
    background-image: url('$lib/assets/final_2.png');
    background-repeat: no-repeat;
    background-size: cover;
    display: block;
    line-height: 1.4285em;
    width: 100%;
    flex: 1 0 0;
    align-self: stretch;
    background-position: 30% 0;
  }

  .contain-text{
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding-left: 12%;
    padding-top: 15%;
    padding-bottom: 15%;

  }

  .hero h1 {
    border: none;
    font-size: 4em;
    padding-top: 2%;
    text-align: initial;
    margin: calc(2rem - 0.14285714em) 0 1rem;
    font-family: Open Sans;
    font-weight: 700;
    font-style: normal;
    line-height: 1.28571429em;
    text-transform: none;
    color: #161616;
    margin-bottom: 0;
    letter-spacing: -0.7px;
  }

  .hero h2{
    font-size: 1.5rem;
    font-family: Open Sans;
    line-height: 1.28571429em;
    margin: 0;
    font-weight: 900;
    padding: 0;
    display: block;
    /* text-align: center; */
    width: 600px;
    overflow: hidden;  /* prevents extra lines from being visible */
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

  .odd-section {
    background: rgba(221, 208, 200, 0.50);
  }

  .section-title {
    color: #000;
    font-family: Work Sans;
    font-size: 40px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    padding-top: 1.5%;
    text-underline-offset: 15px;
    text-transform: uppercase;
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

  .news{
    gap: 0%;
  }

</style>

<div class="a">
  <div class="hero">
    <div class="contain-text">
      <h1>Data4Good: Empowering 
       <br> Nonprofits with Data</h1>
      <h2>Connecting data, research and implementation to help create stronger nonprofit organizations</h2>
    <Button text="Learn More" link="{base}/projects"/>
    </div>
  </div>

  <!-- Recent Works Section -->
  <div class="section odd-section">
    <div class="section-title">Recent Work</div>
    <div class="section-content">
      {#each category as types}
      <!-- Use a separate component for each card -->
      <Card {...types} />
      {/each}
    </div>
  </div>

  <!-- The Latest News Section -->
  <div class="section">
    <div class="section-title">The Latest News</div>
    <div class="section-content news">
      {#each latest_news as news}
        <!-- Use a separate component for each card -->
        <NewsCard {...news} />
      {/each}
    </div>
  </div>

</div>
