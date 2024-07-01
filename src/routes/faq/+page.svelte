<script>
  import { base } from "$app/paths"
  import { PHONE_SCREEN_WIDTH } from "$lib/assets/constants/constants.js"
  import Collapsible from "$lib/components/collapsible.svelte"
  import { onMount } from "svelte"
  import StudentIcon from "svelte-material-icons/AccountSchool.svelte"
  import ChairIcon from "svelte-material-icons/ChairSchool.svelte"
  import ChartIcon from "svelte-material-icons/ChartScatterPlot.svelte"
  import ResumeIcon from "svelte-material-icons/FileAccount.svelte"
  import BuildingIcon from "svelte-material-icons/TownHall.svelte"
  import CashIcon from "svelte-material-icons/CashMultiple.svelte"
  import PeopleIcon from "svelte-material-icons/AccountGroup.svelte"
  import PersonIcon from "svelte-material-icons/Account.svelte"
  import StartArrow from "svelte-material-icons/RayStartArrow.svelte"
  import Navbar from "$lib/components/navbar.svelte"

  const currentPage = 'faq';

  let headingFontSize;
  let isMobile = false
  let iconSize = "30px"
  let screenWidth

  $: collapsibleStyle = isMobile ? `width:90%;` : `width:70%;`
  $: headingFontSize = isMobile ? `font-size: 2rem; max-width: 90%;` : `font-size: 1.1rem;`
  $: sectionContentAdjustment = isMobile ? `font-size: 1.5rem;` : `font-size: 1rem;`

  onMount(() => {
    if (typeof window !== 'undefined') {
      screenWidth = window.screen.width
    }

    if (screenWidth <= PHONE_SCREEN_WIDTH) {
      isMobile = true
    }
    else {
      isMobile = false
    }
  })
</script>

<svelte:head>
  <title>FAQ</title>
</svelte:head>

<Navbar {currentPage} />
<div class="about-container">
  <Collapsible
    heading="What is Data4Good?"
    styleAdjustment={collapsibleStyle}
    headingFontSize={headingFontSize}
  >
    <div slot="text" class="section-content" >
      UMSI Data4Good center brings together non-profit organizations' data into
      larger datasets for benchmarking and trend analysis.
    </div>
  </Collapsible>

  <Collapsible
    heading="What projects are we working on at Data4Good?"
    styleAdjustment={collapsibleStyle}
    headingFontSize={headingFontSize}
  >
    <div slot="text" class="section-content">
      Find our most recent work on the <a href={`${base}/projects`}>Projects</a> page,
      and click on each project listed for more details.
    </div>
  </Collapsible>

  <Collapsible
    heading="How can I provide feedback on Data4Good's website or projects?"
    styleAdjustment={collapsibleStyle}
    headingFontSize={headingFontSize}
  >
    <div slot="text" class="section-content">
      Fill out our <a href="https://forms.gle/n51U4g2K9cafpZUu5"
        >Google Feedback</a
      > form with any suggestions. We'd be happy to hear from you!
    </div>
  </Collapsible>

  <Collapsible
    heading="What's the benefit of joining Data4Good team?"
    styleAdjustment={collapsibleStyle}
    headingFontSize={headingFontSize}
  >
    <div slot="text" class="section-content">
      <p style={`margin: 0 0 1rem 0;`}>
        Here are some of the benefits that are being realized and will grow:
      </p>
      <div class="team-bullets-container">
        {#if isMobile}
          <p>></p>
        {:else}
          <StudentIcon size={iconSize} />
        {/if}
        
        <p class="team-bullets">
          Engages students who desire nonprofit and consulting experience
        </p>
      </div>
      <div class="team-bullets-container">
        {#if isMobile}
          <p>></p>
        {:else}
          <ChairIcon size={iconSize} />
        {/if}
        <p class="team-bullets">
          Builds participatory, hands-on learning
        </p>
      </div>
      <div class="team-bullets-container">
        {#if isMobile}
          <p>></p>
        {:else}
          <ChartIcon size={iconSize} />
        {/if}
        <p class="team-bullets">
          Provides real-world experience in data science and analytics
        </p>
      </div>
      <div class="team-bullets-container">
        {#if isMobile}
          <p>></p>
        {:else}
          <ResumeIcon size={iconSize} />
        {/if}
        <p class="team-bullets">
          Contributes to student credential building
        </p>
      </div>
      <div class="team-bullets-container">
        {#if isMobile}
          <p>></p>
        {:else}
          <BuildingIcon size={iconSize} />
        {/if}
        <p class="team-bullets">
          Contributes to UMSI brand
        </p>
      </div>
      <div class="team-bullets-container">
        {#if isMobile}
          <p>></p>
        {:else}
          <CashIcon size={iconSize} />
        {/if}
        <p class="team-bullets">
          Will help attract students and potential new funding
        </p>
      </div>
      <div class="team-bullets-container">
        {#if isMobile}
          <p>></p>
        {:else}
          <PeopleIcon size={iconSize} />
        {/if}
        <p class="team-bullets">
          Provides a platform for students to engage with non-profits
        </p>
      </div>
      <div class="team-bullets-container">
        {#if isMobile}
         <p>></p>
        {:else}
          <PersonIcon size={iconSize} />
        {/if}
        <p class="team-bullets">
          Non-profits gain a potential IT staffing pipeline
        </p>
      </div>
    </div>
  </Collapsible>

  <Collapsible
    heading="How else can I get in touch with Data4Good?"
    styleAdjustment={collapsibleStyle}
    headingFontSize={headingFontSize}
  >
    <div slot="text" class="section-content">
      <p>
        Reach us at: <a href="mailto:info@data4good.center"
          >info@data4good.center</a
        >
      </p>
      <p class="address-start">School of Information</p>
      <p>University of Michigan</p>
      <p>105 S. State Street</p>
      <p>Ann Arbor, MI 48109-1285</p>
    </div>
  </Collapsible>
</div>

<style>
  .about-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin: 1rem 0 5rem 11rem;
  }

  .team-bullets-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.5rem 0 0.5rem 0.7rem;
  }

  .team-bullets {
    margin: 0 0 0 0.5rem;
  }

  a {
    color: var(--text-color-main);
    text-decoration: underline rgba(227, 184, 120, 1) 2px;
    text-underline-offset: 7px;
  }

  .section-content {
    color: var(--text-color-main);
    font-family: Open Sans;
    font-size: 1.05rem;
    width: 95%;
    margin: 1.5rem 0 1.5rem 0.5rem;
  }

  p {
    margin: 0.5rem 0;
  }

  .address-start {
    margin: 1.5rem 0 0 0;
  }

  @media (max-device-width: 912px) and (min-resolution: 2dppx) {
    .about-container {
      margin: 1rem 0 30rem 0;
      align-items: center;
    }

    .section-content {
      padding: 0;
      font-size: 25px;
    }

    p {
      font-size: 25px;
    }

    a {
      font-size: 25px;
    }

    .team-bullets {
      margin: 0 0 0 1rem;
    }

    .address-start {
      margin-top: 2rem;
    }
  }
</style>
