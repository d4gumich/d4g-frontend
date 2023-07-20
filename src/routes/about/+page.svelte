<script>
    // Import the components from the components folder
    import Card from '$lib/components/card.svelte';
    import Navbar from '$lib/components/navbar.svelte';
    import Hero from '$lib/components/hero.svelte';
  
    // Define some data for the cards
    const team = [
        {
          name: 'Ed Happ',
          link: 'https://www.linkedin.com/in/edward-g-happ/',
          role: 'Executive Fellow',
          bio: 'Edward G. Happ is an Executive Fellow at the University of Michigan School of Information, where he is teaching and conducting research. His 40 years of professional experience include all facets of managing information services and high technology businesses, including general management with P&L responsibility, operations, product management, sales, marketing, customer service, human resources management, technical consulting, manufacturing, and both software and hardware development.'
        },
        {
          name: 'Sidra Effendi',
          link: 'https://www.linkedin.com/in/sidraeffendi/',
          role: 'Consultant and Data Scientist',
          bio: "Sidra is a Master's student at the University of Michigan - School of Information, specializing in Data Science. She has an undergraduate degree in Computer Engineering. Her has previously worked as an Edge Hacker for Zenatix Solutions and also co-founded a company called Pixli, where she worked on Software Development, UX/UI and Marketing"
        },
        {
          name: 'Prithvijit Dasgupta',
          link: 'https://www.linkedin.com/in/prithvijit-dasgupta/',
          role: 'Web Developer and Systems Specialist',
          bio: "Prithvijit is a current Master's student in the University of Michigan-School of Information aiming to specialize in the Big Data Analytics track. He has experience working on distributed cloud Systems and building RESTful APIs. He has an undergraduate degree in Mechanical Engineering."
        },
        {
          name: 'Leo Yeh',
          link: 'https://www.linkedin.com/in/leoyeh/',
          role: 'UX Designer & Web Developer',
          bio: ""
        }
      ];
  
      const alumni = [
        {
          name: 'Harrison Hall',
          link: 'https://www.linkedin.com/in/harrison-joseph-hall/',
          role: 'Project Manager & Data Scientist',
          bio: ''
        },
        {
          name: 'Kensuke Suzuki',
          link: 'https://www.linkedin.com/in/kensukesuzuki/',
          role: 'Consultant',
          bio: ''
        },
        {
          name: 'Anuya Karnik',
          link: 'https://www.linkedin.com/in/anuya-karnik/',
          role: 'Web Developer',
          bio: ''
        },
        {
          name: 'HoJoon Kim',
          link: 'https://www.linkedin.com/in/hojoon-kim-88ba17aa/',
          role: 'Project Manager & Data Scientist',
          bio: ''
        },
        {
          name: 'Mariah Jacobs',
          link: 'https://www.linkedin.com/in/mariah-jacobs/',
          role: 'Web Developer',
          bio: ''
        },
        {
          name: 'Shivika Bisen',
          link: 'https://www.linkedin.com/in/shivika-k-bisen/',
          role: 'Data Scientist',
          bio: ''
        },
        {
          name: 'Gordon Nenadovic',
          link: 'https://www.linkedin.com/in/gordon-nenadovic-4281b61a3/',
          role: 'UX Designer & Game Designer',
          bio: ''
        }
      ];
  </script>
  
  <style>
  
  
    .a{
      margin-top: 0px;
    }
  
    .hero {
      /* height: 10%; */
      background-image: url('$lib/assets/landing_hero.jpg');
      background-repeat: no-repeat;
      background-size: cover;
      /* margin: 0 !important; */
      display: block;
      /* -webkit-text-size-adjust: 100%; */
      /* min-width: 320px; */
      line-height: 1.4285em;
      padding-bottom: 10%;
      
    }
  
    .hero-contain{
      max-width: 1050px;
      margin: auto;
    }
  
    .contain-text{
      text-align: center;
      padding-top: 5%;
  
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
      margin: calc(2rem - 0.14285714em) 0 1rem;
      font-weight: initial;
      padding: 0;
      display: block;
      text-align: center;
      overflow-x: hidden;
  
      margin-block-start: 0.83em;
      margin-block-end: 0.83em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
  
      /* line-height: 1.5em; */
      height: 3em;       /* height is 2x line-height, so two lines will display */
      overflow: hidden;  /* prevents extra lines from being visible */
    }
  
    .vertical-container {
      width: 1127px;
      margin-left: auto!important;
      margin-right: auto!important;
    }
  
    /* .vertical-segment{
      background-color: white;
      width: 100%;
    } */
  
    .ui {
      width: 80vw !important;
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
  
  <!-- <div class="vertical-container" id="about"> -->
  <div class="a">
    <div class="hero">
      <Navbar />
      <!-- make a hero component -->
      <div class="hero-contain">
        <div class="contain-text">
          <h1>Data4Good</h1>
          <h2>Connecting data, training and implementation to help create stronger nonprofit organizations.</h2>
        </div>
        </div>
      </div>
    <div class="vertical-container">
    
    <div class="vertical-segment">
    <h2 class="header horizontal divider">About</h2>
      <h3 class="header">Data4Good's Mission</h3>
      <p>
        The UMSI Data4Good center brings together non-profit organizations' data
        into larger datasets for benchmarking and trend analysis. Putting data in
        the hands of nonprofits contributes to the body of knowledge about a
        broad scope of development and relief programs, which in turn will lead
        to better decision-making in nonprofit work.
      </p>
      <h3 class="header">Data4Good's Values</h3>
      <p>
        The Data4Good center values transparency and equal access to information
        and data analysis that has the potential to impact lives through
        nonprofit organizations.
      </p>
      <h3 class="header">Data4Good's Team</h3>
      <div class="ui">
        {#each team as member}
          <!-- Use a separate component for each card -->
          <Card {...member} />
        {/each}
        
      </div>
      <h3 class="header">Alumni</h3>
      <div class="ui">
        {#each alumni as member}
          <!-- Use a separate component for each card -->
          <Card {...member} />
        {/each}
      </div>
    </div>
  </div>
  </div>
  <!-- </div> -->
  