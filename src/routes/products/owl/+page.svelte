<script>
    import { onMount } from "svelte";
    import Navbar from "$lib/components/navbar.svelte";
    import Button from "$lib/components/button.svelte";
    import SearchLogo from '$lib/assets/icons8-search-100.png';
    import LoadingBar from "$lib/components/loading_bar.svelte";
    import ChevronDown from "$lib/assets/icons/chevron-down-solid.svelte";
    import ChevronUp from "$lib/assets/icons/angle-up-solid.svelte";
    import { PUBLIC_BACKEND_URL } from '$env/static/public';
    import { aiStatus, aiActions, HOST_URL } from '$lib/aiSetupStore.js';
    import AISetup from "$lib/components/AISetup.svelte";
    import AIBanner from "$lib/components/AIBanner.svelte";

    const currentPage = 'owl';
    const host_url = PUBLIC_BACKEND_URL || 'https://d4gumsi.pythonanywhere.com/';

    let query = $state("");
    let aboutOwl = $state(false);
    let answer = $state("");
    let documents = $state([]);
    let temperature = $state(0.5);
    let k = $state(5);
    let loading = $state(false);
    let progress = $state(0);
    let retrievalTime = $state(null);
    let error = $state("");
    let showResults = $state(false);
    let showAISetup = $state(false);

    let progressInterval;
  
    // feedback modal
    let showModal = $state(false);
    let formUrl = 'https://forms.gle/n51U4g2K9cafpZUu5';
    function handleFeedbackClick() {
        showModal = true;
    }

    onMount(() => {
        aiActions.fetchStatus();
    });
  
    async function submitQuestion() {
      if (!query.trim()) {
        error = "Please enter a question.";
        return;
      }

      if ($aiStatus.status !== 'active' && !$aiStatus.forceTeamKey) {
        showAISetup = true;
        return;
      }

      loading = true;
      progress = 0;
      error = "";
      answer = "";
      documents = [];
      retrievalTime = null;
      showResults = false;

       // Simulate loading bar
      progressInterval = setInterval(() => {
        if (progress < 90) {
          progress += 1;
        }
      }, 30);

      const startTime = performance.now();

      try {
        const headers = { "Content-Type": "application/json" };
        if ($aiStatus.forceTeamKey) {
            headers['X-Force-Team-Key'] = 'true';
        }

        const response = await fetch(`${HOST_URL}api/v1/products/owl`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            text: query,
            k,
            temperature,
            gemini_model: $aiStatus.model,
            max_docs: k
          }),
          credentials: 'include'
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Something went wrong.");
        }

        answer = result.gemini?.answer || "";
        documents = result.data || [];

        const endTime = performance.now();
        retrievalTime = ((endTime - startTime) / 1000).toFixed(2);
        showResults = true;
      } catch (err) {
        error = err.message;
        if (error.includes("API key expired") || error.includes("400") || error.includes("401")) {
          aiActions.setError(true, "API Key Expired/Invalid");
        } else {
          aiActions.setError(true, "Connection Failed");
        }
      } finally {
        clearInterval(progressInterval);
        setTimeout(() => {
          loading = false;
          progress = 0;
        }, 800);
      }
    }

    function filterEnter(event) {
      if (event.key === "Enter" && query.trim().length > 0) {
        event.preventDefault();
        submitQuestion();
      }
    }

    const goBack = () => {
      loading = false;
      showResults = false;
      progress = 0;
      query = "";
      answer = "";
      documents = [];
    };

    let expandedDocs = $state([]);

    function toggleDoc(index) {
      expandedDocs[index] = !expandedDocs[index];
    }
  </script>

  <svelte:head>
    <title>Owl Q&A</title>
  </svelte:head>

  <Navbar {currentPage} />
  <AIBanner />

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
          onkeypress={filterEnter}
        />
        {#if query && query != ""}
          <button
              class="search-button"
              style = "background-image: url({SearchLogo});"
              height="10px"
              onclick={submitQuestion}
              aria-label="Submit Question"
          ></button>
        {:else}
            <button class="search-button" style="background-image: url({SearchLogo});" height="10px" disabled aria-label="Submit disabled"></button>
        {/if}
      </div>

      {#if !showResults}
      <div class="param-container">
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
            oninput={() => {
              if (k < 1) k = 1;
              if (k > 10) k = 10;
            }}
          />
        </div>
      </div>
      {/if}

      {#if error}
        <p style="color: red; margin: 1rem 0;">❌ {error}</p>
      {/if}

      {#if loading}
      <div class="loading-icon">
        <LoadingBar
          progress={(progress / 10) * 100}
        />
      </div>
      {/if}

      {#if showResults}
        <p style="margin: 1rem 0;">📊 Retrieved {documents.length} documents in {retrievalTime} seconds.</p>
      {/if}

      {#if showResults}
      <div class="owl-container">
        {#if answer}
          <div class="answer-box">
            <h2>🧠 Answer</h2>
            <p>{answer}</p>
          </div>
        {/if}

        {#if documents.length}
          <h2>📑 Retrieved Documents</h2>
          {#each documents as doc, i}
            <div class="doc-card">
              <h3>Document {i + 1}</h3>
              <p><strong>Title:</strong> {doc.title}</p>
              <p><strong>Source:</strong> {doc.source}</p>
              <p><strong>Page:</strong> {doc.page_label}</p>
              <p><strong>URL:</strong> <a href={doc.URL} target="_blank" rel="noopener noreferrer">{doc.URL}</a></p>
               
              <div class="doc-toggle-line">
                <button
                  class="arrow"
                  onclick={() => toggleDoc(i)}
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

              <div class="doc-text">
                {#if expandedDocs[i]}
                  <p>{doc.combined_details}</p>
                {:else}
                  <p>{doc.combined_details?.slice(0, 500)}...</p>
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

    {#if !showResults && !loading}
      <div class="button-container">
          <Button
              text="About Owl"
              click={() => (aboutOwl = !aboutOwl)}
          />
          <Button text="View Documentation" link="https://github.com/d4gumich/owl" />
          <Button text="Provide Feedback" click={handleFeedbackClick} />
      </div>
    {/if}

    <div class="about-chetah-text">
        {#if aboutOwl}
            <p>
              Owl is an AI-powered Question and Answer bot designed to provide accurate and efficient responses to user queries. Built with Python, it leverages advanced natural language processing techniques to understand and generate human-like answers.
            </p>
        {/if}
    </div>

    {#if showModal}
      <div 
        class="modal" 
        onclick={() => (showModal = false)} 
        onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (showModal = false)}
        role="button" 
        aria-label="Close modal"
        tabindex="0"
      >
          <div class="modal-content" role="dialog" aria-modal="true" aria-label="Feedback Modal" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} tabindex="-1">
              <span
                  class="modal-close"
                  onclick={() => (showModal = false)}
                  role="button"
                  tabindex="0"
                  onkeydown={(e) => e.key === 'Enter' && (showModal = false)}
                  aria-label="Close modal"
                  >&times;</span
              >
              <iframe src={formUrl} width="100%" height="100%" title="Owl Feedback Form"></iframe>
          </div>
      </div>
    {/if}
  </div>
  
  <style>
    .container {
      margin: auto;
      display: flex;
      padding: 5% 0;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 30px;
      background-color: var(--background-color-light);
      min-height: 85vh;
    }

    .content-container {
      display: flex;
      width: 100%;
      max-width: 1000px;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding: 0 1rem;
    }

    .owl-heading {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--blue-color-main);
      margin: 0;
    }
    .info-text {
        text-align: center;
        margin: 0.5rem 0 1.5rem 0;
        color: rgba(0, 0, 0, 0.87);
        font-family: Open Sans;
        font-size: 1.2rem;
        font-weight: 600;
    }
    .heading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 1rem;
    }

    .search-container {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 800px;
      height: 60px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .search-input {
        flex: 1;
        border: none;
        padding: 0 1.5rem;
        font-family: Open Sans;
        font-size: 1.1rem;
        height: 100%;
    }
    .search-input:focus {
        outline: none;
    }
    .search-button {
        width: 70px;
        height: 100%;
        border: none;
        background-color: #1b3350;
        cursor: pointer;
        background-size: 40%;
        background-repeat: no-repeat;
        background-position: center;
        transition: background-color 0.2s;
    }
    .search-button:hover:not(:disabled) {
        background-color: #2c4a70;
    }
    .search-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .about-chetah-text {
        width: 80%;
        max-width: 800px;
        text-align: left;
        color: #444;
        font-family: Open Sans;
        font-size: 1.1rem;
        line-height: 1.6;
        margin-top: 1rem;
    }

    .param-text {
      margin: 0;
      color: var(--text-color-main);
      font-family: "Open Sans";
      font-size: 0.9rem;
      font-weight: 600;
    }

    .param-container {
      display: flex;
      gap: 2rem;
      margin: 2rem 0;
      width: 100%;
      max-width: 800px;
    }

    .param-block {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .param-block label {
      margin-bottom: 0.5rem;
    }

    .param-block select,
    .param-block input[type="number"] {
      padding: 0.6rem;
      font-size: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    .param-block input[type="range"] {
      width: 100%;
      margin: 0.5rem 0;
    }

    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #888;
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3000;
        backdrop-filter: blur(4px);
    }
    .modal-content {
        width: 90%;
        max-width: 800px;
        height: 80vh;
        background-color: white;
        border-radius: 1rem;
        position: relative;
        padding: 2rem;
    }
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1.5rem;
        cursor: pointer;
        font-size: 2rem;
        color: #666;
    }

    .owl-container {
      width: 100%;
      max-width: 800px;
      margin-top: 2rem;
    }

    .answer-box {
        background: #f8f9fa;
        padding: 2rem;
        border-radius: 1rem;
        border-left: 5px solid var(--blue-color-main);
        margin-bottom: 2rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    .answer-box h2 {
        margin-top: 0;
        color: var(--blue-color-main);
    }

    .doc-card {
        background: white;
        padding: 1.5rem;
        border-radius: 0.8rem;
        border: 1px solid #eee;
        margin-bottom: 1.5rem;
        box-shadow: 0 2px 5px rgba(0,0,0,0.02);
    }

    .doc-card h3 {
        margin-top: 0;
        color: #333;
    }

    .doc-toggle-line {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 1rem 0;
        padding-top: 1rem;
        border-top: 1px solid #f0f0f0;
    }

    .arrow {
      background: #f0f0f0;
      border: none;
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s;
    }

    .arrow:hover {
        background: #e0e0e0;
    }

    .dropdown-arrow {
      width: 1rem;
      height: 1rem;
    }

    .loading-icon {
      width: 100%;
      max-width: 400px;
      margin: 2rem 0;
    }

    .button-container {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1rem;
    }

    @media (max-width: 640px) {
      .param-container {
        flex-direction: column;
        gap: 1rem;
      }
      .search-container {
          height: 50px;
      }
    }
  </style>
