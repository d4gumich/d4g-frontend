<script>
    // Import the components from the components folder
    // import Card from '$lib/components/card.svelte';
    import CurrProjCard from '$lib/components/current_project_card.svelte';
    import PastProjCard from '$lib/components/past_project_card.svelte';
    import SectionTitle from "../../lib/components/section_title.svelte";
    import { base } from '$app/paths';
    import HangulLogo from '$lib/assets/hangul2 copy 2.png';
    import ChetahLogo from '$lib/assets/Updated_LOGO.png';
  
    // Define some data for the cards
    const current_project = [
      {
        name: 'Hangul',
        detail: 'Hangul is a tool that helps digital curators at ReliefWeb process more documents faster by extracting metadata such as title, date, language, and entities from text PDFs. It also aims to extract summaries and themes from the documents.',
        logo: HangulLogo,
        researchLink: base,
        tryLink: `${base}/projects/hangul`
      },
      {
        name: 'Chetah 2.0',
        detail: 'Chetah is a search engine for nonprofits reports published on the web. It summarizes reports with a state of the art deep learning algorithm. It is developed to help NGO program managers and policy makers to design programs and apply for grant funds. This tool aims to provide better answers for nonprofit work and eventually to help solve the crucial real problems that nonprofits are facing.',
        logo: ChetahLogo,
        researchLink: base,
        tryLink: `${base}/projects/chetah2.0`
      }
    ];

    const past_project = [
       {
        name: 'Chetah 1.0',
        detail: 'Chetah is a search engine that summarizes UN and NGOs reports using BERT, a deep learning algorithm. Users can search by UN Clusters and find evidence-based reports from IFRC, IWA and UNICEF.',
        researchLink: `${base}/projects/chetah1.0`,
        type: 'Project'
      },
      {
        name: 'Trends in the IT Sector of Non-Profit Organizations',
        detail: 'What do NPO IT leaders say about IT investment over the past 17 years? Visualize CIO4Good survey trends.',
        researchLink: base,
        type: 'Project'
      },
      {
        name: 'Digital Crisis Simulation Exercise (SimEx)',
        detail: 'The digital Crisis Simulation Exercise (SimEx) is the latest iteration of a multi-year training lab designed to simulate disaster response strategies and actions within a realistic crisis setting.',
        researchLink: base,
        type: 'Project'
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
      padding-top: 1.5%;
    }

    .horizontal-segment {
        display: flex;
        justify-content: center; /* Horizontally center the cards */
        gap: 50px; /* Adjust the gap between the cards */
        flex-direction: row;
        flex-flow: row wrap;
        padding-top: 1%;
        padding-bottom: 2%
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

    h1 {
      font-family: Work Sans;
      text-decoration: underline rgba(227, 184, 120, 1) 3px;
      text-underline-offset: 15px;

    }

    p{
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
    }
  </style>
  
  <div class="a">
    <!-- <Navbar /> -->

    <!-- <h1>Latest Projects</h1> -->
    <SectionTitle title="Latest Projects" />
    <div class="horizontal-segment">
        {#each current_project as project}
        <!-- Use a separate component for each card -->
          <CurrProjCard {...project} />
        {/each}
    </div>

    <SectionTitle title="Past Projects" />
    <div class="horizontal-segment">
      {#each past_project as project}
      <!-- Use a separate component for each card -->
        <PastProjCard {...project} />
      {/each}
    </div>

  </div>  