<script>
    // Import the components from the components folder
    // import Card from '$lib/components/card.svelte';
    import { base } from "$app/paths";
    import CurrResearchCard from '$lib/components/current_project_card.svelte';
    import PastResearchCard from '$lib/components/past_project_card.svelte';
    import SectionTitle from "../../lib/components/section_title.svelte";
    import HangulLogo from '$lib/assets/hangul2 copy 2.png';
    import ChetahLogo from '$lib/assets/Updated_LOGO.png';
  
    // Define some data for the cards
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
            researchLink: base,
            type: 'Research'
        },
        {
            name: 'Refugee Demographic & Connectivity Trends in Greece and Serbia',
            detail: "What can we learn about refugees' access to the internet and mobile device ownership from a high level perspective?",
            researchLink: base,
            type: 'Research'
        },
        {
            name: 'Topic Extraction from Unstructured NGO Documents',
            detail: 'Insights about the different reports produced by NGOs.',
            researchLink: base,
            type: 'Research'
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