<script>
    import { base } from "$app/paths";
</script>

<div class="about-container">
    <!-- Mission Section -->
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

    <!-- Values Section -->
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

    <!-- History Section -->
    <div class="section odd-section">
        <div class="section-title">
            How can I provide feedback on Data4Good's website or projects?
        </div>
        <div class="section-content">
            <!-- History content goes here -->
            <p>
                Fill out our Google Feedback form with any suggestions. We'd be
                happy to hear from you!
            </p>
        </div>
    </div>

    <!-- History Section -->
    <div class="section">
        <div class="section-title">
            How else can I get in touch with Data4Good?
        </div>
        <div class="section-content">
            <!-- History content goes here -->
            <p>Reach us at: <strong>info@data4good.center</strong>
            <br/>
                <address>
                Data4Good Center<br/>
                School of Information<br/>
                4322 North Quad<br/>
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
        width: 100%; /* Fixed width for section title */
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
        width: 100%;
        font-size: 20px;
        font-style: normal;
        line-height: 30px; /* 150% */
        padding-left: 30%;
        max-width: 100%; /* Make sure the content doesn't exceed the screen width */
        white-space: pre-line; /* Allow the text to wrap and break lines as needed */
    }
</style>
