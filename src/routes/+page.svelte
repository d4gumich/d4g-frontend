<script>
  // Import the components from the components folder
  // import Card from '$lib/components/card.svelte';
  import Navbar from '$lib/components/navbar.svelte';
  import Hero from '$lib/components/hero.svelte';
  import ProjCard from '$lib/components/project_card.svelte';
  // import Footnote from '$lib/components/footnote.svelte'


  // Define some data for the cards
  const current_project = [
      {
        name: 'Chetah',
        detail: 'Chetah is a search engine that summarizes UN and NGOs reports using BERT, a deep learning algorithm. Users can search by UN Clusters and find evidence-based reports from IFRC, IWA and UNICEF. It is designed to help NGO program managers and policy makers with better results than Google and Bing.',
        logo: './src/lib/assets/Updated_LOGO.png'
      },
      {
        name: 'Hangul',
        detail: 'Hangul is a tool that helps digital curators at ReliefWeb process more documents faster by extracting metadata such as title, date, language, and entities from text PDFs. It also aims to extract summaries and themes from the documents.',
        logo: './src/lib/assets/hangul2 copy 2.png'
      }
    ];

    const button_text = [
      {}
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
  }

  .hero-contain{
    max-width: 100%;
    margin: auto;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 40px;
  }

  .contain-text{
    /* text-align: center;
    padding-top: 5%; */
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
    margin-top: -0.14285714em;
    padding-top: 2%;
    text-align: center;
    padding-top: 10%;
    margin: calc(2rem - 0.14285714em) 0 1rem;
    font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
    font-weight: 700;
    line-height: 1.28571429em;
    text-transform: none;
    color: rgba(0,0,0,.87);
  }

  .hero h2{
    font-size: 1.71428571rem;
    font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
    line-height: 1.28571429em;
    margin: 0;
    font-weight: initial;
    padding: 0;
    display: block;
    /* text-align: center; */
    overflow-x: hidden;
    width: 600px;

    /* margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px; */

    /* line-height: 1.5em; */
    height: 3em;       /* height is 2x line-height, so two lines will display */
    overflow: hidden;  /* prevents extra lines from being visible */
  }

  .vertical-container {
    /* width: 1127px; */
    margin: auto
  }

  .vertical-segment{
    width: 100%;
    gap: 50px;
  }

  .ui {
    width: 80vw;
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
  <Navbar />
  <div class="hero">
    <!-- make a hero component -->
    <!-- <div class="hero-contain"> -->
      <div class="contain-text">
        <h1>Data4Good</h1>
        <h2>Connecting data, training and implementation to help create stronger nonprofit organizations.</h2>
      <!-- </div> -->
      </div>
    </div>
  <div class="vertical-container">
  
  <div class="vertical-segment">
    <div class="ui">
      {#each current_project as project}
        <!-- Use a separate component for each card -->
        <ProjCard {...project} />
      {/each}
    </div>
  </div>
</div>
</div>