<script>
    // Import the components from the components folder
    // import Card from '$lib/components/card.svelte';
    import CurrProjCard from '$lib/components/current_project_card.svelte';
    import PastProjCard from '$lib/components/past_project_card.svelte';
  
    // Define some data for the cards
    const current_project = [
      {
        name: 'Hangul',
        detail: 'Hangul is a tool that helps digital curators at ReliefWeb process more documents faster by extracting metadata such as title, date, language, and entities from text PDFs. It also aims to extract summaries and themes from the documents.',
        logo: './src/lib/assets/hangul2 copy 2.png',
        researchLink: 'https',
        tryLink: 'https'
      },
      {
        name: 'Chetah',
        detail: 'Chetah is a search engine that summarizes UN and NGOs reports using BERT, a deep learning algorithm. Users can search by UN Clusters and find evidence-based reports from IFRC, IWA and UNICEF. It is designed to help NGO program managers and policy makers with better results than Google and Bing.',
        logo: './src/lib/assets/Updated_LOGO.png',
        researchLink: 'https',
        tryLink: 'https'
      }
    ];

    const past_project = [
      {
        name: 'Trends in the IT Sector of Non-Profit Organizations',
        detail: 'What do NPO IT leaders say about IT investment over the past 17 years? Visualize CIO4Good survey trends.',
        researchLink: 'https',
        type: 'Project'
      },
      {
        name: 'Think Paper on Digital Identification',
        detail: 'Digital identification and biometric data has become increasingly popular in the private sector and have slowly been introduced and piloted in governmental and non-governmental organizations in the emerging world.',
        researchLink: 'https',
        type: 'Research'
      },
      {
        name: 'Refugee Demographic & Connectivity Trends in Greece and Serbia',
        detail: "What can we learn about refugees' access to the internet and mobile device ownership from a high level perspective?",
        researchLink: 'https',
        type: 'Research'
      },
      {
        name: 'Topic Extraction from Unstructured NGO Documents',
        detail: 'Insights about the different reports produced by NGOs.',
        researchLink: 'https',
        type: 'Research'
      },
      {
        name: 'Digital Crisis Simulation Exercise (SimEx)',
        detail: 'The digital Crisis Simulation Exercise (SimEx) is the latest iteration of a multi-year training lab designed to simulate disaster response strategies and actions within a realistic crisis setting.',
        researchLink: 'https',
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
    }

    .horizontal-segment {
        display: flex;
        justify-content: center; /* Horizontally center the cards */
        gap: 50px; /* Adjust the gap between the cards */
        flex-direction: row;
        flex-flow: row wrap;
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
    <!-- <Navbar /> -->

    <h1>Current Project</h1>

    <div class="horizontal-segment">
        {#each current_project as project}
        <!-- Use a separate component for each card -->
          <CurrProjCard {...project} />
        {/each}
    </div>

    <h1>Past Project</h1>
    <div class="horizontal-segment">
      {#each past_project as project}
      <!-- Use a separate component for each card -->
        <PastProjCard {...project} />
      {/each}
    </div>

  </div>  