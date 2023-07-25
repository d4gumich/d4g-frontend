<script>
    // No props needed as the content is static
    import { base } from '$app/paths';
</script>

<style>
    .footer {
      background-color: #DDD0C8;
      padding: 10%;
      display: flex;
      align-items: flex-start; /* Align items at the top of the footer */
      justify-content: space-between;
      flex-wrap: wrap;
      padding-top: 7%;
      padding-bottom: 5%;
    }
  
    .footer-logo {
      display: flex;
      align-items: center;
      /* gap: 100px; Adjusted gap between logo and text */
      margin-right: 10%; /* Add a gap between rows */
      margin-left: 7%;
    }
  
    .footer-title {
      font-weight: bold;
      font-family: 'Roboto', sans-serif;
    }

    .footer-column a {
    text-decoration: none; /* Remove link underline */
    font-family: 'Roboto', sans-serif; /* Set Roboto font */
    font-size: 14px; /* Set font size to 14px */
    font-weight: 400; /* Set regular font weight */
    line-height: 150%; /* Set line height to 150% */
    color: #000; /* Set link color */
  }

    .footer-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 40px; /* Add a gap between rows */
    }
  
    .footer-divider {
      width: 100%;
      height: 1px;
      background-color: #ccc;
      margin: 30px 0; /* Add a gap between rows */
      flex-basis: 100%; /* Ensure the divider spans the full width */
    }
  
    .footer-bottom-text {
      font-size: 12px;
      text-align: center;
      margin-top: 20px; /* Add a gap between rows */
      flex-basis: 100%; /* Ensure the bottom text spans the full width */
    }
  </style>
  

  
  <div class="footer">
    <!-- Left Side with Logo -->
    <div class="footer-logo">
      <img src="./src/lib/assets/D4G-Logo-2.png" alt="Data4Good Logo" height="90px">
      <!-- <div class="footer-title">Data4Good</div> -->
    </div>
  
    <!-- Column 1 -->
    <div class="footer-column">
      <div class="footer-title">Data4Good</div>
      <a href="{base}/about">About</a>
      <a href="{base}/news">News</a>
      <a href="{base}/project">Project</a>
      <a href="{base}/team">Team</a>
      <a href="{base}/faq">FAQ</a>
    </div>
  
    <!-- Column 2 -->
    <div class="footer-column">
      <div class="footer-title">Projects</div>
      <a href="#">Chetah</a>
      <a href="#">Hangul</a>
    </div>
  
    <!-- Column 3 -->
    <div class="footer-column">
      <div class="footer-title">Location</div>
      <div>School of Information</div>
      <div>University of Michigan</div>
      <div>4322 North Quad, 105 S State St.</div>
      <div>Ann Arbor, MI 48109-1285</div>
      <div>info@data4good.center</div>
    </div>
  
    <!-- Divider -->
    <div class="footer-divider"></div>
  
    <!-- Bottom Text -->
    <div class="footer-bottom-text">&copy; 2023 Data4Good All rights reserved.</div>
  </div>
  