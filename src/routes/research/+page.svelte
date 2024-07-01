<script>
    import { base } from "$app/paths";
    import CurrResearchCard from '$lib/components/current_project_card.svelte';
    import PastResearchCard from '$lib/components/past_project_card.svelte';
    import SectionTitle from "../../lib/components/section_title.svelte";
    import HangulLogo from '$lib/assets/hangul2 copy 2.png';
    import ChetahLogo from '$lib/assets/chetah_logo.png';
    import Navbar from '$lib/components/navbar.svelte';

    const currentPage = 'research';

    const current_research = [
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
  <title>Research</title>
</svelte:head>

  <style>
    .a{
      /* margin-top: 0px; */
      display: flex;
      flex-direction: column;
      align-items: center;
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
    <!-- <Navbar /> -->

    <!-- <h1>Latest Projects</h1> -->
    <SectionTitle title="Latest Research" />
    <div class="horizontal-segment">
        {#each current_research as research}
        <!-- Use a separate component for each card -->
          <CurrResearchCard {...research} />
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