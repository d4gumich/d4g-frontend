<script>
    import CurrProjCard from '$lib/components/current_project_card.svelte';
    import PastProjCard from '$lib/components/past_project_card.svelte';
    import SectionTitle from "../../lib/components/section_title.svelte";
    import { base } from '$app/paths';
    import HangulLogo from '$lib/assets/hangul2 copy 2.png';
    import ChetahLogo from '$lib/assets/chetah_logo.png';

    // Define some data for the cards
    const current_project = [
      {
        name: 'Hangul',
        detail: 'Hangul is a tool that helps digital curators at ReliefWeb process more documents faster by extracting metadata such as title, date, language, and entities from text PDFs. It also aims to extract summaries and themes from the documents.',
        logo: HangulLogo,
        researchLink: 'https://drive.google.com/file/d/1U_wHtC6DtPsfIBXHCeESfQXlDsXe5lHv/view',
        tryLink: `${base}/projects/hangul`
      },
      {
        name: 'Chetah 2.0',
        detail: 'Chetah is a search engine for nonprofits reports published on the web. It summarizes reports with a state of the art deep learning algorithm. It is developed to help NGO program managers and policy makers to design programs and apply for grant funds. This tool aims to provide better answers for nonprofit work and eventually to help solve the crucial real problems that nonprofits are facing.',
        logo: ChetahLogo,
        researchLink: 'https://drive.google.com/file/d/13Jij3MG6P_P5OGGMLNIbGdgpCUaDVGce/view',
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
        researchLink: `${base}/projects/cio4good`,
        type: 'Project'
      },
      {
        name: 'Digital Crisis Simulation Exercise (SimEx)',
        detail: 'The digital Crisis Simulation Exercise (SimEx) is the latest iteration of a multi-year training lab designed to simulate disaster response strategies and actions within a realistic crisis setting.',
        researchLink: `${base}/projects/simex`,
        type: 'Project'
      }

    ]
  
  </script>

<svelte:head>
  <title>Projects</title>
</svelte:head>
  
  <style>
    .a{
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--background-color-light);
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