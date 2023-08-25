<script>
    import { base } from "$app/paths";
</script>

<svelte:head>
  <title>FAQ</title>
</svelte:head>

<div class="about-container">
    
    <div class="section odd-section">
        <div class="section-title">What is Data4Good?</div>
        <div class="section-content">
            <!-- Mission content goes here -->
            <p>
                UMSI Data4Good center brings together non-profit organizations'
                data into larger datasets for benchmarking and trend analysis.
            </p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">
            What projects are we working on at Data4Good?
        </div>
        <div class="section-content">
            <!-- Values content goes here -->
            <p>
                Find our most recent work on the <a href="{base}/projects"
                    >Projects</a
                > page, and click on each project listed for more details.
            </p>
        </div>
    </div>

    <div class="section odd-section">
        <div class="section-title">
            How can I provide feedback on Data4Good's website or projects?
        </div>
        <div class="section-content">
            <!-- History content goes here -->
            <p>
                Fill out our <a href="https://forms.gle/n51U4g2K9cafpZUu5">Google Feedback</a> form with any suggestions. We'd be happy to hear from you!
            </p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">
            What's the benefit of joining Data4Good team?
        </div>
        <div class="section-content">
            <p>
                Here are some of the benefits that are being realized and will grow:
                <ul>
                    <li>Engages students who desire nonprofit and consulting experience</li>
                    <li>Builds participatory, hands-on learning</li>
                    <li>Interdisciplinary team building (web, database, API, data science -- analytics, visualization)</li>
                    <li>Contributes to student credential building</li>
                    <li>Contributes to UMSI brand</li>
                    <li>Will help attract students and potential new funding (as students publish research)</li>
                    <li>Non-profit IT leaders and program managers gain important decision-making tools</li>
                    <li>Non-profits gain a potential IT staffing pipeline</li>
                </ul>
        </div>
    </div>

    <div class="section odd-section">
        <div class="section-title">
            How else can I get in touch with Data4Good?
        </div>
        <div class="section-content">
            <p>Reach us at: <strong>info@data4good.center</strong>
                <br/>
                    <address>
                    School of Information<br/>
                    University of Michigan<br/>
                    105 S. State Street<br/>
                    Ann Arbor, MI 48109-1285<br/>
                </address>
        </div>
    </div>
</div>

<style>
    /* ... Add your global styles here ... */
    .about-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        /* padding: 80px 162px; */
        /* align-items: flex-start; */
    }

    .section {
        display: flex;
        flex-direction: column;
        align-items: left;
        padding: 20px 0 20px 0;
        gap: 10%;
        width: 100%; /* Make the sections cover the whole width */
        align-items: center;
        max-width: 100%;
    }

    .odd-section {
        background: rgba(221, 208, 200, 0.5);
    }

    .section-title {
        margin-left: 15%;
        align-self: flex-start;
        color: #000;
        font-family: Work Sans;
        font-size: 25px;
        font-style: normal;
        line-height: 1.5;
        padding-top: 1.5%;
        font-weight: 600;
        text-decoration: underline rgba(227, 184, 120, 1) 2px;
        text-underline-offset: 10px;
    }

    a {
        color: #000;
        text-decoration: underline rgba(227, 184, 120, 1) 2px;
        text-underline-offset: 10px;
    }

    .section-content {
        color: rgba(0, 0, 0, 0.87);
        font-family: Open Sans;
        width: 70%;
        font-size: 20px;
        font-style: normal;
        line-height: 30px; /* 150% */
        white-space: pre-line; /* Allow the text to wrap and break lines as needed */
    }

    @media (max-width: 900px) {

        ul{
            width: 70%;
        }

        .section-content{
            width: 80%;
            padding-left: 10%;
        }

        .section-title{
            width: 70%;
        }
    }

</style>
