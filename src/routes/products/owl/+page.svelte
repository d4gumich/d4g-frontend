<script>
    import Navbar from "$lib/components/navbar.svelte";
    import Button from "$lib/components/button.svelte";
    import SearchLogo from '$lib/assets/icons8-search-100.png';
    import LoadingBar from "$lib/components/loading_bar.svelte";
    import ChevronDown from "$lib/assets/icons/chevron-down-solid.svelte";
    import ChevronUp from "$lib/assets/icons/angle-up-solid.svelte";

    const currentPage = 'owl';

    let query = "";
    let aboutOwl= false;
    let answer = "";
    let documents = [];
    let model = "gemini-1.5-flash";
    let temperature = 0.5;
    let k = 5;
    let loading = false;
    let progress=0;
    let retrievalTime = null;
    let error = "";
    let showResults = false;

    let progressInterval;
  
    // make this a component
    let showModal = false;
    let formUrl = 'https://forms.gle/n51U4g2K9cafpZUu5';
    function handleFeedbackClick() {
        showModal = true;
    }
  
    async function submitQuestion() {
      if (!query.trim()) {
        error = "Please enter a question.";
        return;
      }
      loading = true;
      progress = 0;
      error = "";
      answer = "";
      documents = [];
      retrievalTime = null;
      showResults = false;

       // Simulate loading bar (you could tie this to actual steps if desired)
      progressInterval = setInterval(() => {
        if (progress < 90) {
          progress += 1;
        }
      }, 30); // adjust speed here

      const startTime = performance.now();

      try {
        const response = await fetch('https://d4gumsi.pythonanywhere.com/api/owl', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            k,
            temperature,
            model
          })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Something went wrong.");
        }

        answer = result.answer;
        documents = result.documents;

        const endTime = performance.now(); // ⏱️ End timer
        retrievalTime = ((endTime - startTime) / 1000).toFixed(2);
        showResults = true;
      } catch (err) {
        error = err.message;
      } finally {
        clearInterval(progressInterval);
        setTimeout(() => {
          loading = false;
          progress = 0;
        }, 800); // allow user to see 100% before reset
      }
    }
    function filterEnter(event) {
      if (event.key === "Enter" && query.trim().length > 0) {
        event.preventDefault();
        submitQuestion(event);
      }
    }
    const goBack = () => {
      loading = false;
      showResults = false;
      progress = 0;
      window.location.reload();
    };

    let expandedDocs = [];

    function toggleDoc(index) {
      expandedDocs[index] = !expandedDocs[index];
    }
  </script>
  <svelte:head>
    <title>Owl Q&A</title>
  </svelte:head>
  <Navbar {currentPage} />
  <div class="container">
    <div class="content-container">
        <div class="heading-container">
          <h1 class="owl-heading">
            🦉 Owl Q&A
          </h1>
          <p class="info-text">
            Unlock Insights with AI-Powered Assistance.
          </p>
        </div>
      <div class="search-container">
        <input
          class="search-input"
          type="text"
          placeholder="Ask a question about nonprofits reports..."
          bind:value={query}
          on:keypress={filterEnter}
        />
        {#if query && query != ""}
          <button
              class="search-button"
              style = "background-image: url({SearchLogo});"
              height="10px"
              on:click={submitQuestion}
          />
        {:else}
            <button class="search-button" style="background-image: url({SearchLogo});" height="10px" disabled />
        {/if}
      </div>
      {#if !showResults}
      <div class="param-container">
        <!-- Model Selection -->
        <div class="param-block">
          <label for="model" class="param-text">Select LLM Model for Answer</label>
          <select id="model" bind:value={model}>
            <option value="gemini-1.5-flash">gemini-1.5-flash</option>
            <option value="gemini-1.5-flash-8b">gemini-1.5-flash-8b</option>
            <option value="gemini-1.5-pro">gemini-1.5-pro</option>
          </select>
        </div>
      
        <!-- Temperature Slider -->
        <div class="param-block">
          <label for="temperature" class="param-text">
            Model Temperature
            <br />
            <small>
              Current: <span class="temp-value">{temperature.toFixed(2)}</span>
            </small>
          </label>
        
          <input
            id="temperature"
            type="range"
            min="0"
            max="1"
            step="0.05"
            bind:value={temperature}
          />
        
          <div class="range-labels">
            <span>0.0</span>
            <span>1.0</span>
          </div>
        </div>
      
        <!-- Top K -->
        <div class="param-block">
          <label for="topk" class="param-text">Number of Similar Documents (k between 1 and 10)</label>
          <input
            id="topk"
            type="number"
            min="1"
            max="10"
            bind:value={k}
            on:input={() => {
              if (k < 0) k = 0;
              if (k > 10) k = 10;
            }}
          />
        </div>
      </div>
      {/if}

      {#if error}
        <p style="color: red;">❌ {error}</p>
      {/if}

      {#if loading}
      <div class="loading-icon">
        <LoadingBar
          progress={(progress / 10) * 100}
        />
      </div>
      {/if}

      {#if showResults}
        <p>📊 Retrieved {documents.length} documents in {retrievalTime} seconds.</p>
      {/if}
      {#if showResults}
      <div class="owl-container">
        {#if answer}
          <h2>🧠 Answer</h2>
          <p>{answer}</p>
        {/if}

        {#if documents.length}
          <h2>📑 Retrieved Documents</h2>
          {#each documents as doc, i}
            <div style="margin-bottom: 1em;">
              <h3>Document {i + 1}</h3>
              <p><strong>Title:</strong> {doc.title}</p>
              <p><strong>Source:</strong> {doc.source}</p>
              <p><strong>Page:</strong> {doc.page_label}</p>
              <p><strong>URL:</strong> <a href={doc.URL} target="_blank">{doc.URL}</a></p>
               <!-- Toggle Row -->
              <div class="doc-toggle-line">
                <button
                  class="arrow"
                  on:click={() => toggleDoc(i)}
                  title={expandedDocs[i] ? "Collapse" : "Expand"}
                  aria-label={expandedDocs[i] ? "Collapse document" : "Expand document"}
                >
                  <div class="dropdown-arrow">
                    {#if expandedDocs[i]}
                      <ChevronUp />
                    {:else}
                      <ChevronDown />
                    {/if}
                  </div>
                </button>
                <span class="toggle-label">
                  <strong>{expandedDocs[i] ? 'Full Content' : 'Preview'}</strong>
                </span>
              </div>

              <!-- Content -->
              <div class="doc-text">
                {#if expandedDocs[i]}
                  <p>{doc.document}</p>
                {:else}
                  <p>{doc.document.slice(0, 500)}...</p>
                {/if}
              </div>
                    </div>
                  {/each}
                  <div class="button-container">
                    <Button
                      text="Go back"
                      click={() => goBack()}
                      styleAdjustment="margin: 2rem auto;"
                    />
          </div>
        {/if}
      </div>
      {/if}
    </div>
    {#if !answer}
      <div class="button-container">
          <Button
              text="About Owl"
              click={() => (aboutOwl = !aboutOwl)}
          />
          <Button text="View Documentation" link="https://github.com/d4gumich/owl" />
          <Button text="Provide Feedback" click={handleFeedbackClick} />
      </div>
    {/if}
    <!-- until here -->

    <div class="about-chetah-text">
        {#if aboutOwl}
            <p>
              Owl is an AI-powered Question and Answer bot designed to provide accurate and efficient responses to user queries. Built with Python, it leverages advanced natural language processing techniques to understand and generate human-like answers.
            </p>
        {/if}
    </div>
    {#if showModal}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="modal" on:click|self={() => (showModal = false)}>
          <div class="modal-content">
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <span
                  class="modal-close"
                  on:click|stopPropagation={() => (showModal = false)}
                  >&times;</span
              >
              <!-- svelte-ignore a11y-missing-attribute -->
              <iframe src={formUrl} width="100%" height="100%" />
          </div>
      </div>
    {/if}
  </div>
  
  <style>
    .container {
      margin: auto;
      display: flex;
      padding: 7% 0;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 45px;
      background-color: var(--background-color-light);
    }

    .content-container {
      display: flex;
      width: auto;
      justify-content: center;
      align-items: center;
      align-content: center;
      gap: 0px 1%;
      flex-wrap: wrap;
      flex-direction: column;
    }

    /* heading block */
    .owl-heading {
      font-size: 3 rem;
      font-weight: bold;
    }
    .info-text {
        text-align: center;
        margin-bottom: 10px;
        color: rgba(0, 0, 0, 0.87);
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: 25px;
    }
    .heading-container {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 3rem;
    }
    /* search container imported from chetah */
    .search-container {
      display: flex;
      align-items: center;
      width: 50rem;
      height: 60px;
      flex-shrink: 0;
      fill: var(--white, #fff);
      stroke-width: 0.5px;
      stroke: #000;
      border-radius: 10px;
      padding: 2%;
    }
    .search-input {
        width: 100%;
        /* padding: 10px 20px; */
        font-size: 16px;
        fill: var(--white, #fff);
        stroke-width: 0.5px;
        stroke: #000;
        color: rgba(0, 0, 0, 0.5);
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 30.857px;
        height: 90%;
        padding-left: 3%;
        border-radius: 10px 0 0 10px;
    }
    .search-button {
        width: 60px;
        height: 100%;
        border-radius: 0 10px 10px 0;
        border: none;
        background-color: #1b3350;
        color: white;
        font-size: 16px;
        cursor: pointer;
        background-size: 65%;
        background-repeat: no-repeat;
        background-position: center;
    }
    /* save this style */
    .about-chetah-text {
        width: 50%;
        text-align: left;
        /* margin-top: 1%; */
        color: #000;
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: 30px; /* 150% */
    }

    /* small texts for labels */
    .param-text {
      margin: 0;
      color: var(--text-color-main);
      font-family: "Open Sans";
      font-size: 0.9rem;
      font-weight: 400;
      line-height: 25px;
      transition: font-weight 300ms ease-in-out;
    }

    /* parameter input blocks */
    .param-container {
      display: flex;
      gap: 1.5rem;
      margin: 1rem 0;
      flex-wrap: wrap; /* allows wrapping on smaller screens */
    }

    .param-block {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 200px;
    }

    .param-block label {
      font-weight: bold;
      margin-bottom: 0.25rem;
    }
    /* k input and model drop down style */
    .param-block select,
    .param-block input[type="number"] {
      padding: 0.4rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    /* slider style */
    .param-block input[type="range"] {
      width: 100%;
      padding: 0;
      margin: 0;
      appearance: none;
      background: transparent;
    }

    /* slider wasn't going all the way to the end, below webkit fixes this issue for different sizing on different browser */
    /* WebKit (Chrome, Safari) */
    .param-block input[type="range"]::-webkit-slider-runnable-track {
      width: 100%;
      height: 4px;
      background: #ddd;
      border-radius: 2px;
    }

    .param-block input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #333;
      margin-top: -5px; /* align thumb center with track */
      cursor: pointer;
    }

    /* Firefox */
    .param-block input[type="range"]::-moz-range-track {
      height: 4px;
      background: #ddd;
      border-radius: 2px;
    }

    .param-block input[type="range"]::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #333;
      cursor: pointer;
    }

    /* parameter selection texts labels */
    .param-block small {
      font-weight: normal;
      color: #555;
      font-size: 0.85rem;
    }

    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: #666;
      margin-top: 0.25rem;
      padding: 0 2px;
    }
    .temp-value {
      display: inline-block;
      width: 3ch;              /* Fits up to "0.00" */
      text-align: right;
      font-family: Open Sans;
    }

    /* modal */
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal-content {
        width: 80%;
        height: 80%;
        background-color: white;
        padding: 20px;
    }
    .modal-close {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
    }

    .owl-container {
      width: 80%;
    }

    .loading-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .button-container {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      margin-bottom: 2rem;
    }

    .arrow {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0;
      margin: 0;
      line-height: 1;
      color: inherit;
    }

    .dropdown-arrow {
      margin: 0;
      padding: 0;
      position: relative;
      top: 1px;
      width: 1rem;
      height: 1rem;
    }

    /* Stack everything vertically on small screens */
    @media (max-width: 640px) {
      .heading-container {
        flex-direction: column;
        align-items: flex-start;
      }

      .param-container {
        flex-direction: column;
      }
     
    }
  </style>