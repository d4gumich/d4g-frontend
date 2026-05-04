<script>
    import CurrProjCard from '$lib/components/current_project_card.svelte';
    import PastProjCard from '$lib/components/past_project_card.svelte';
    import SectionTitle from "../../lib/components/section_title.svelte";
    import { base } from '$app/paths';
    import HangulLogo from '$lib/assets/hangul2 copy 2.png';
    import ChetahLogo from '$lib/assets/chetah_logo.png';
    import OwlLogo from '$lib/assets/owl_logo.jpg';
    import Navbar from '$lib/components/navbar.svelte';
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    
    const currentPage = 'projects';

    const current_project = [
      {
        name: 'Socrates v2',
        detail: 'Socrates is a structured inquiry system designed to improve question quality, surface hidden assumptions, and generate action-oriented synthesis through a disciplined dialectic process.',
        logo: OwlLogo,
        buttonText: "View Documentation",
        researchLink: 'https://github.com/1O1-ORG/socrateos-platform/tree/main',
        tryLink: 'https://1o1.org/'
      },
      {
        name: 'Lighthouse',
        detail: 'Lighthouse provides high-fidelity automated extraction and comparison of professional profiles and job requirements.',
        logo: OwlLogo,
        researchLink: 'https://github.com/d4gumich/hugging-face-space-connection-test',
        tryLink: `${base}/products/lighthouse`,
        experimental: true,
        isDemo: true
      },
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

    $: secretKey = browser ? $page.url.searchParams.get('key') : null;

    // Derived projects list that appends the key to links if it exists
    $: projectsWithAuth = current_project.map(p => {
        if (p.experimental && secretKey) {
            const separator = p.tryLink.includes('?') ? '&' : '?';
            return { ...p, tryLink: `${p.tryLink}${separator}key=${secretKey}` };
        }
        return p;
    });

    const past_project = [
      {
        name: 'Socrates v1 (Archived Prototype)',
        detail: 'Initial experimental prototype of the Socrates dialectic engine. This version explored structured inquiry using sequential LLM nodes.',
        researchLink: `${base}/socrates-test`,
        type: 'Prototype'
      },
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
    ];
  
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
  
  <Navbar {currentPage} />
  <div class="a">
    <SectionTitle title="Latest Projects" />
    <div class="horizontal-segment">
        {#each projectsWithAuth as project}
          {#if !project.experimental || (secretKey && secretKey.length > 5)}
            <CurrProjCard {...project} />
          {/if}
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