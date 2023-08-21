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
    flex-direction: row;
    justify-content: space-between;
    padding: 20px 0 20px 0;
    gap: 10%;
    width: 100%; /* Make the sections cover the whole width */
    align-items: center;

  }

  .odd-section {
    background: rgba(221, 208, 200, 0.50);
  }

  .section-title {
    width: 120px; /* Fixed width for section title */
    margin-left: 20%;
    align-self: flex-start;
    color: #000;
    font-family: Work Sans;
    font-size: 40px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    padding-top: 1.5%;
    text-decoration: underline rgba(227, 184, 120, 1) 4px;
    text-underline-offset: 15px;
  }

  .section-content {
    flex: 1;
    color: rgba(0, 0, 0, 0.87);
    font-family: Open Sans;
    font-size: 20px;
    font-style: normal;
    line-height: 30px; /* 150% */
    padding-right: 15%;
    display: flex;
    flex-direction: column;
    align-items: flex-end; /* Align content to the right-hand side */
  }

  .form-group {
    margin-bottom: 20px;
    align-self: flex-start;
    /* padding-top: 3%; */
  }

  .form-group:first-child{
    padding-top: 4%;
  }

  label {
    font-weight: bold;
  }

  input,
  textarea {
    width: 300px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  textarea {
    resize: vertical;
  }

  .submit-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    align-self: flex-start;

  }

  .contact-form {
    padding: 20px 0 20px 0;
    width: 100%;
  }
</style>


<div class="about-container">
  <!-- Mission Section -->
  <div class="section odd-section">
    <div class="section-title">Mission</div>
    <div class="section-content">
      <!-- Mission content goes here -->
      <p>The UMSI Data4Good (D4G) center brings together non-profit organizations' data into larger datasets for benchmarking and trend analysis. Putting data in the hands of nonprofits contributes to the body of knowledge about a broad scope of development and relief programs, which in turn will lead to better decision-making in nonprofit work.</p>
    </div>
  </div>

  <!-- Values Section -->
  <div class="section">
    <div class="section-title">Values</div>
    <div class="section-content">
      <!-- Values content goes here -->
      <p>The Data4Good center values transparency and equal access to information and data analysis that has the potential to impact lives through nonprofit organizations.</p>
    </div>
  </div>

  <!-- History Section -->
  <div class="section odd-section">
    <div class="section-title">History</div>
    <div class="section-content">
      <!-- History content goes here -->
      <p>The D4G center is a student-led initiative at UMSI that started in 2017 with the idea of using data to help nonprofit organizations. The center’s mission is to collect, analyze, and share data from nonprofits to improve their programs and decision-making. The center also develops pro bono products and solutions for nonprofit needs. The center is led by Kelly Kowatch and Edward Happ, who provide guidance and expertise to the students. The D4G Consulting team is a group of students who work on various projects for nonprofit partners, using data analytics and visualization skills. The D4G center aims to have a positive impact on nonprofit work and provide students with a valuable learning experience.</p>
    </div>
  </div>

  <!-- Contact Section -->
  <!-- <div class="section">
    <div class="section-title">Contact</div>
    <div class="section-content">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" placeholder="Enter your name" />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" placeholder="Enter your email" />
      </div>
      <div class="form-group">
        <label for="phone">Phone Number:</label>
        <input type="tel" id="phone" placeholder="Enter your phone number" />
      </div>
      <div class="form-group">
        <label for="message">Message:</label>
        <textarea id="message" rows="4" placeholder="Enter your message"></textarea>
      </div>
      <button class="submit-button">Submit</button>
    </div>
  </div> -->
</div>

