<script>
  // Import the components from the components folder
  // import Card from '$lib/components/card.svelte';
  // import ProjCard from '$lib/components/home_project_card.svelte';
  import Card from '$lib/components/new_home_project_card.svelte';
  import NewsCard from '$lib/components/news_card.svelte';
  import Button from "$lib/components/button.svelte";
  import { base } from '$app/paths';

  // Define some data for the cards
  // const current_project = [
  //     {
  //       name: 'Chetah',
  //       detail: 'Chetah is a search engine that summarizes UN and NGOs reports using BERT, a deep learning algorithm. Users can search by UN Clusters and find evidence-based reports from IFRC, IWA and UNICEF. It is designed to help NGO program managers and policy makers with better results than Google and Bing.',
  //       logo: './src/lib/assets/Updated_LOGO.png',
  //       researchLink: 'https',
  //       tryLink: 'https'
  //     },
  //     {
  //       name: 'Hangul',
  //       detail: 'Hangul is a tool that helps digital curators at ReliefWeb process more documents faster by extracting metadata such as title, date, language, and entities from text PDFs. It also aims to extract summaries and themes from the documents.',
  //       logo: './src/lib/assets/hangul2 copy 2.png',
  //       researchLink: 'https',
  //       tryLink: 'https'
  //     }
  //   ];

  const category = [
    {
      text: 'Projects',
      link: 'facebook.com',
      icon: './src/lib/assets/icons8-project-100.png'
    },
    {
      text: 'Research',
      link: '',
      icon: './src/lib/assets/icons8-research-100.png'
    }
  ];

  const latest_news = [
    {
      image: '',
      category: 'Search Engine',
      title: "UMSI Data4Good center brings together non-profit organizations' data into larger datasets for benchmarking and trend analysis.",
      date: 'July 25th 2023'
    },
    {
      image: '',
      category: 'Artificial Intelligence',
      title: "UMSI Data4Good center brings together non-profit organizations' data into larger datasets for benchmarking and trend analysis.",
      date: 'July 25th 2023'
    }
  ]

</script>

<style>
  .a{
    /* margin-top: 0px; */
    display: flex;
    flex-direction: column;
    align-items: center;
    /* align-content: center; */
    /* gap: 55px; */
    background: var(--background, #F5F5F5);
    padding-bottom: 4%;
  }

  .hero {
    /* height: 10%; */
    background-image: url('$lib/assets/final_1.png');
    background-repeat: no-repeat;
    background-size: cover;
    /* margin: 0 !important; */
    display: block;
    /* -webkit-text-size-adjust: 100%; */
    /* min-width: 320px; */
    line-height: 1.4285em;
    /* padding-right: 0px;
    padding-left: 0px; */
    width: 100%;
    /* height: 50%; */
    flex: 1 0 0;
    align-self: stretch;
    /* margin-top: 5%; */
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
    font-weight: initial;
    padding: 0;
    display: block;
    /* text-align: center; */
    overflow-x: hidden;
    width: 600px;
    height: 3em;       /* height is 2x line-height, so two lines will display */
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

  .vertical-container {
    /* width: 1127px; */
    margin: auto
  }

  .vertical-segment{
    width: 100%;
    gap: 50px;
  }

  .horizontal.divider {
    /* place the header at the middle of the page */
    margin-top: 0;
    margin-bottom: 0;
    /* make the header span the entire width of the page */
    width: 100%;
    /* center the text */
    text-align: center;
  }

  .header:first-child {
    margin-top: 1em;
  }

  .header{
    font: 1.28571429rem;
    padding-top: 2%;
    border: none;
    margin: calc(2rem - .14285714em) 0 1rem;
    padding: 0 0;
    /* font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif; */
    font-weight: 700;
    line-height: 1.28571429em;
    text-transform: none;
    color:rgba(0, 0, 0, .87);
    font-family: 'Roboto', sans-serif;
  }

  p{
    font-family: 'Roboto', sans-serif;
    font-size: 1rem;
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
    <div class="section-title">Recent Works</div>
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
