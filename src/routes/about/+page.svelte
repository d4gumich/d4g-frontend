<svelte:head>
  <title>About</title>
</svelte:head>

<style>
  .about-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 0 0 2rem 0;
  }

  .section {
    display: flex;
    flex-direction: row;
    padding: 20px 0 20px 0;
    width: 100%;
    align-items: center;

  }

  .section-title {
    width: 120px;
    margin: 0 0 0 11rem;
    align-self: flex-start;
    color: var(--text-color-main);
    font-family: "Work Sans";
    font-size: 40px;
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
    padding: 0.5rem 10rem 0 3rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
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
      padding: 0;
    }

    .about-container {
      margin: 6rem 0;
    }
  }
</style>

<script>
  import Navbar from '$lib/components/navbar.svelte';
  
  const currentPage = 'about';
</script>

<Navbar {currentPage} />
<div class="about-container">
  <div class="section">
    <div class="section-title">Mission</div>
    <div class="section-content">
      <p>The UMSI Data4Good (D4G) center brings together non-profit organizations' data into larger datasets for benchmarking and trend analysis. Putting data in the hands of nonprofits contributes to the body of knowledge about a broad scope of development and relief programs, which in turn will lead to better decision-making in nonprofit work.</p>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Values</div>
    <div class="section-content">
      <!-- Values content goes here -->
      <p>The Data4Good center values transparency and equal access to information and data analysis that has the potential to impact lives through nonprofit organizations.</p>
    </div>
  </div>

  <div class="section">
    <div class="section-title">History</div>
    <div class="section-content">
      <!-- History content goes here -->
      <p>The D4G center is a student-led initiative at UMSI that started in 2017 with the idea of using data to help nonprofit organizations. The center’s mission is to collect, analyze, and share data from nonprofits to improve their programs and decision-making. The center also develops pro bono products and solutions for nonprofit needs. The center is led by Kelly Kowatch and Edward Happ, who provide guidance and expertise to the students. The D4G Consulting team is a group of students who work on various projects for nonprofit partners, using data analytics and visualization skills. The D4G center aims to have a positive impact on nonprofit work and provide students with a valuable learning experience.</p>
    </div>
  </div>
</div>