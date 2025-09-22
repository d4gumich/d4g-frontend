<script>
    // Import the components from the components folder
    // import Card from '$lib/components/card.svelte';
    import NewsCard from '$lib/components/news_card.svelte';
    import SectionTitle from "../../lib/components/section_title.svelte";
    import Poster from '$lib/assets/UMSI Exposition - Sidra & Prithvi 17-Apr-23.jpg'
    import nethope from '$lib/assets/nethope_hero_image.png'
    import reliefweb from '$lib/assets/reliefweb_logo.jpg'
    import Navbar from '$lib/components/navbar.svelte';
  
    const currentPage = 'joinus';
  
</script>

<svelte:head>
  <title>Join Us</title>
</svelte:head>
  
<style>
    .section {
        margin-bottom: 100px;
    }
    .section-title {
        margin: 0 0 0 11rem;
        align-self: flex-start;
        color: var(--text-color-main);
        font-family: "Work Sans";
        font-size: 30px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        padding-top: 1.5%;
        text-decoration: underline;
        text-decoration-color: rgba(227, 184, 120, 1);
        text-decoration-thickness: 4px;
        text-underline-offset: 15px;
    }

    .section-content {
        flex: 1;
        color: var(--text-color-main);
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        line-height: 30px;
        padding: 0.5rem 3rem 0 3rem;
        display: flex;
        justify-content: center; /* Centers horizontally */
        align-items: center;
        flex-direction: column;
    }

    .section-text {
        width: 80%;
    }

    @media (max-device-width: 912px) and (min-resolution: 2dppx) {
        .section-title {
            width: 80px;
            font-size: 3rem;
            padding: 0;
            margin: 0 0 0 3rem;
        }

        .section-content {
            padding: 0 3rem;
            margin: 2rem 0;
            line-height: normal;
            font-size: 1rem !important;
            }

        .section-content p {
            font-size: 1rem !important;
            }

        .section {
            display: flex;
            flex-direction: column;
        }
    }

</style>

<Navbar {currentPage} />
<div class="a">
    <SectionTitle title="Join the Team" />
    <div class="section-content">
        <p class="section-text">We are always looking for students and professionals interested in making a difference in the non-profit space to join us. Fill out this short <a id="email-link" href="https://forms.gle/ZoigvyPURYDZuRmu7" target="_blank">form</a> or reach out to us at: <a id="email-link" href="mailto:info@data4good.center">info@data4good.center</a></p>
        <p class="section-text">Want to get involved in one of our projects? Here's what we are currently working on: </p>
    </div>
    <div class="section">
    <div class="section-title">Knowledge Capsules</div>
    <div class="section-content">
      <p class="section-text">Provide shared datasets and database management for the D4G family of products.</p>
    </div>
    <div class="section-title">Lighthouse</div>
    <div class="section-content">
      <p class="section-text">A job search, skill-matching and aspiration-alignment platform for displaced nonprofit professionals.</p>
    </div>
     <div class="section-title">Socrates</div>
    <div class="section-content">
      <p class="section-text">A chatbot that generates superior dialogue and investigation methods to develop better questions and critical thinking.</p>
    </div>
     <div class="section-title">Owl 2.0 & Documentation</div>
    <div class="section-content">
      <p class="section-text">Add knowledge capsules for shared datasets, and document chatbot creation for nonprofits use and reference.</p>
    </div>
     <div class="section-title">Chetah 3.0</div>
    <div class="section-content">
      <p class="section-text">Add knowledge capsules and significantly expand the Chetah search dataset.</p>
    </div>
    <div class="section-title">API 2.0</div>
    <div class="section-content">
      <p class="section-text">Add knowledge capsules to the D4G SPI for reading and updating our shared datasets.</p>
    </div>
    <div class="section-title">Victor</div>
    <div class="section-content">
      <p class="section-text">Add voice to the Personas family of chatbots to allow verbal AI dialog.</p>
    </div>
  </div>
</div>