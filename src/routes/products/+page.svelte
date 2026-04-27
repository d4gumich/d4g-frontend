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
    
    const currentPage = 'products';

    const current_project = [
      {
        name: 'Hangul',
        detail: 'Hangul is a tool that helps digital curators at ReliefWeb process more documents faster by extracting metadata such as title, date, language, and entities from text PDFs. It also aims to extract summaries and themes from the documents.',
        logo: HangulLogo,
        buttonText: "View Research",
        researchLink: 'https://drive.google.com/file/d/1U_wHtC6DtPsfIBXHCeESfQXlDsXe5lHv/view',
        tryLink: `${base}/products/hangul`
      },
      {
        name: 'Chetah 2.0',
        detail: 'Chetah is a search engine for nonprofits reports published on the web. It summarizes reports with a state of the art deep learning algorithm. It is developed to help NGO program managers and policy makers to design programs and apply for grant funds. This tool aims to provide better answers for nonprofit work and eventually to help solve the crucial real problems that nonprofits are facing.',
        logo: ChetahLogo,
        buttonText: "View Research",
        researchLink: 'https://drive.google.com/file/d/13Jij3MG6P_P5OGGMLNIbGdgpCUaDVGce/view',
        tryLink: `${base}/products/chetah2.0`
      },
      {
        name: 'Hangul API',
        detail: 'The Hangul API is an extension of the Hangul product that has the ability to process a given PDF document based on the specified payload parameters, and conditionally provide a summary and keywords based on the parameters.',
        logo: HangulLogo,
        buttonText: "View Documentation",
        researchLink: '../products/api_documentation/',
        tryLink: `${base}/products/hangul_api`
      },
      {
        name: 'Owl',
        detail: 'Owl is an AI-powered Question and Answer bot designed to provide accurate and efficient responses to user queries. Built with Python, it leverages advanced natural language processing techniques to understand and generate human-like answers.',
        logo: OwlLogo,
        buttonText: "View Documentation",
        researchLink: 'https://github.com/d4gumich/owl',
        tryLink: `${base}/products/owl`
      },
      {
        name: 'Socrates v2',
        detail: 'Socrates is a structured inquiry system designed to improve question quality, surface hidden assumptions, and generate action-oriented synthesis through a disciplined dialectic process.',
        logo: OwlLogo,
        buttonText: "View Documentation",
        researchLink: 'https://github.com/d4gumich/data4good-umich',
        tryLink: `${base}/socrates-test`,
        experimental: true
      }
    ];

    $: secretKey = $page.url.searchParams.get('key');
    
    // Derived projects list that appends the key to links if it exists
    $: projectsWithAuth = current_project.map(p => {
        if (p.experimental && secretKey) {
            const separator = p.tryLink.includes('?') ? '&' : '?';
            return { ...p, tryLink: `${p.tryLink}${separator}key=${secretKey}` };
        }
        return p;
    });
  
  </script>

<svelte:head>
  <title>Products</title>
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
    <SectionTitle title="Latest Products" />
    <div class="horizontal-segment">
        {#each projectsWithAuth as project}
          {#if !project.experimental || (secretKey && secretKey.length > 5)}
            <CurrProjCard {...project} />
          {/if}
        {/each}
    </div>

  </div>  