<script>
    // No props needed as the content is static
    import { base } from '$app/paths';
    import logo from '$lib/assets/D4G-Logo-2.png'
</script>

<style>
    .footer {
      background-color: var(--background-color-dark);
      padding: 10%;
      display: flex;
      align-items: flex-start; /* Align items at the top of the footer */
      justify-content: space-between;
      flex-wrap: wrap;
      padding-top: 5%;
      padding-bottom: 3%;
      border-top: var(--text-color-main) 1px solid;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 1%px; /*Adjusted gap between logo and text */
      margin-right: 10%; /* Add a gap between rows */
      margin-left: 7%;
    }
  
    .footer-title {
      font-weight: 500;
      font-family: "Open Sans", sans-serif;
      color: var(--text-color-light);
    }

    .footer-column a {
      text-decoration: none; /* Remove link underline */
      font-family: "Open Sans", sans-serif; /* Set Roboto font */
      font-size: 14px; /* Set font size to 14px */
      font-weight: 400; /* Set regular font weight */
      line-height: 150%; /* Set line height to 150% */
      color: var(--text-color-light);
    }
    p {
      font-family: "Open Sans", sans-serif;
      font-size: 14px; /* Set font size to 14px */
      font-weight: 400;
      line-height: 150%;
      margin: 0;
      color: var(--text-color-light);
    }

    .footer-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 15px; /* Add a gap between rows */
    }
  
    .footer-divider {
      width: 100%;
      height: 1px;
      margin: 20px 0; /* Add a gap between rows */
      flex-basis: 100%; /* Ensure the divider spans the full width */
    }
  
    .footer-bottom-text {
      font-size: 12px;
      text-align: center;
      font-family: "Open Sans", sans-serif;
      flex-basis: 100%;
      color: var(--text-color-light);
    }

    @media (max-device-width: 912px) and (min-resolution: 2dppx) {
      img{
        height: 100px;
      }

      .footer-column:nth-child(4) {
        display:none;
      }

      .footer {
        justify-content: flex-start;
        padding: 5rem 0;
        margin: 0;
      }

      .footer-column a {
        font-size: 2rem;
      }

      .footer-column div {
        font-size: 2rem;
      }

      .footer-bottom-text {
        margin: 3rem 0 0 0;
        font-size: 1.5rem;
      }
    }

  </style>
  

  
  <div class="footer">
    <!-- Left Side with Logo -->
    <div class="footer-logo">
      <img src="{logo}" alt="Data4Good Logo" height="75px">
      <!-- <div class="footer-title">Data4Good</div> -->
    </div>

    <!-- Column 1 -->
    <div class="footer-column">
      <div class="footer-title">Data4Good</div>
      <a href={`${base}/about`}>About</a>
      <a href={`${base}/news`}>News</a>
      <a href={`${base}/products`}>Products</a>
      <a href={`${base}/archive`}>Archive</a>
      <a href={`${base}/team`}>Team</a>
      <a href={`${base}/faq`}>FAQ</a>
    </div>
  
    <!-- Column 2 -->
    <div class="footer-column">
      <div class="footer-title">Projects</div>
      <a href={`${base}/projects/chetah1.0`}>Chetah</a>
      <a href={`${base}/products/hangul`}>Hangul</a>
      <a href={`${base}/products/hangul_api`}>Hangul API</a>
    </div>
  
    <!-- Column 3 -->
    <div class="footer-column">
      <div class="footer-title">Location</div>
      <p>
        School of Information<br/>
        University of Michigan<br/>
        105 S. State Street<br/>
        Ann Arbor, MI 48109-1285<br/>
        info@data4good.center
      </p>
    </div>
  
    <!-- Divider -->
    <div class="footer-divider"></div>
  
    <!-- Bottom Text -->
    <div class="footer-bottom-text">&copy; 2024 Data4Good All rights reserved.</div>
  </div>
  