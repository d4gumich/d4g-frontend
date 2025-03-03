<script>
    import CurrProjCard from '$lib/components/current_project_card.svelte';
    import PastProjCard from '$lib/components/past_project_card.svelte';
    import CurrResearchCard from '$lib/components/current_project_card.svelte';
    import PastResearchCard from '$lib/components/past_project_card.svelte';
    import SectionTitle from "../../lib/components/section_title.svelte";
    import { base } from '$app/paths';
    import HangulLogo from '$lib/assets/hangul2 copy 2.png';
    import ChetahLogo from '$lib/assets/chetah_logo.png';
    import Navbar from '$lib/components/navbar.svelte';
    
    const currentPage = 'archive';

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
    const past_research = [
        {
            name: 'Chetah 1.0',
            detail: 'Chetah is a search engine that summarizes UN and NGOs reports using BERT, a deep learning algorithm. Users can search by UN Clusters and find evidence-based reports from IFRC, IWA and UNICEF.',
            researchLink: 'https://drive.google.com/file/d/13Jij3MG6P_P5OGGMLNIbGdgpCUaDVGce/view',
            type: 'Research'
        },
        {
            name: 'Think Paper on Digital Identification',
            detail: 'Digital identification and biometric data has become increasingly popular in the private sector and have slowly been introduced and piloted in governmental and non-governmental organizations in the emerging world.',
            researchLink: 'https://drive.google.com/file/d/17sz0ih_1RQ91IcyMTRn3Tmb4LUgw65wt/view',
            type: 'Research'
        },
        {
            name: 'Refugee Demographic & Connectivity Trends in Greece and Serbia',
            detail: "What can we learn about refugees' access to the internet and mobile device ownership from a high level perspective?",
            researchLink: 'https://drive.google.com/file/d/1k5KTfw5x5wjicFecdyaE0qWkXwsbbNgY/view',
            type: 'Research'
        },
        {
            name: 'Topic Extraction from Unstructured NGO Documents',
            detail: 'Insights about the different reports produced by NGOs.',
            researchLink: 'https://drive.google.com/file/d/1e3EYJDc6IuXzD7b16Q4lkxmTo0zcW-dW/view',
            type: 'Research'
        }
    ]
  
  </script>

<svelte:head>
  <title>Archive</title>
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
  
  <Navbar {currentPage} />
  <div class="a">

    <SectionTitle title="Past Projects" />
    <div class="horizontal-segment">
      {#each past_project as project}
      <!-- Use a separate component for each card -->
        <PastProjCard {...project} />
      {/each}
    </div>

    <SectionTitle title="Past Research" />
    <div class="horizontal-segment">
      {#each past_research as research}
      <!-- Use a separate component for each card -->
        <PastResearchCard {...research} />
      {/each}
    </div>

  </div>  