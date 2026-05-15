<script>
    import Navbar from "$lib/components/navbar.svelte";
    import Button from "$lib/components/button.svelte";
    import LoadingBar from "$lib/components/loading_bar.svelte";
    import AISetup from "$lib/components/AISetup.svelte";
    import AIBanner from "$lib/components/AIBanner.svelte";
    import { onMount } from "svelte";
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import { base } from '$app/paths';
    import { PUBLIC_BACKEND_URL } from '$env/static/public';
    import { aiStatus, aiActions } from '$lib/aiSetupStore.js';

    const currentPage = 'socrates-test';
    
    let secretKey = $state(null);
    let showSetup = $state(true);

    const host_url = PUBLIC_BACKEND_URL || 'https://d4gumsi.pythonanywhere.com/';

    onMount(async () => {
        secretKey = $page.url.searchParams.get('key');
        await aiActions.fetchStatus();

        // Re-check session when user returns to tab
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                aiActions.fetchStatus();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    });

    $effect(() => {
        if ($aiStatus.status === 'active') {
            showSetup = false;
        } else {
            showSetup = true;
        }
    });

    let input = $state("");
    let loading = $state(false);
    let error = $state("");

    // Socrates State tracking
    let socratesState = $state({
        mode: null,
        route: null,
        refined_question: null,
        assumptions: [],
        missing_info: [],
        thesis: null,
        antithesis: null,
        synthesis: null,
        open_tensions: [],
        next_action: null,
        action_draft: null,
        evaluator_scores: {},
        passed_eval: false
    });

    let events = $state([]);
    let current_node = $state(null);
    let retry_count = $state(0);
    const MAX_RETRIES = 3;

    async function submitSocrates(isRetry = false) {
        if (!input.trim()) {
            error = "Please enter some text for Socrates to think about.";
            return;
        }

        if (!isRetry) {
            retry_count = 0;
            events = [];
        }
        
        loading = true;
        error = "";
        current_node = null;

        if (!isRetry) {
            socratesState = {
                mode: null,
                route: null,
                refined_question: null,
                assumptions: [],
                missing_info: [],
                thesis: null,
                antithesis: null,
                synthesis: null,
                open_tensions: [],
                next_action: null,
                action_draft: null,
                evaluator_scores: {},
                passed_eval: false
            };
        }

        try {
            const endpoint = 'api/v1/products/socrates/run';
            const url = host_url + endpoint;
            
            const response = await fetch(url, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    input: input,
                    channel: "web-test"
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || `Server error: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const eventData = JSON.parse(line.substring(6));
                            handleEvent(eventData);
                        } catch (e) {
                            console.error("Error parsing SSE event:", e);
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Socrates error:", err);
            if (retry_count < MAX_RETRIES) {
                retry_count++;
                const delay = Math.pow(2, retry_count) * 1000;
                error = `Gemini is busy (Retry ${retry_count}/${MAX_RETRIES} in ${delay/1000}s...)`;
                setTimeout(() => submitSocrates(true), delay);
            } else {
                error = `Process failed after ${MAX_RETRIES} retries: ${err.message}. Please try again in a few minutes.`;
                loading = false;
            }
        } finally {
            if (retry_count === 0 || retry_count >= MAX_RETRIES) {
                loading = false;
            }
        }
    }

    function handleEvent(event) {
        if (event.error) {
            throw new Error(event.error);
        }

        const nodeName = Object.keys(event)[0];
        current_node = nodeName;

        if (events.length === 0 || events[events.length - 1] !== nodeName) {
            events = [...events, nodeName];
        }
        
        const updates = event[nodeName];
        if (updates) {
            socratesState = { ...socratesState, ...updates };
        }
    }

    function filterEnter(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submitSocrates();
        }
    }
</script>

<svelte:head>
    <title>Socrates Test Page</title>
</svelte:head>

<Navbar {currentPage} />
<AIBanner />

<div class="demo-warning">
    ⚠️ ARCHIVED PROTOTYPE: This is an older version of the Socrates dialectic engine. For the current product, please visit <a href="{base}/products" class="banner-link">Socrates v2</a> on the Products page.
</div>

<div class="container">
    <div class="content-container">
        <div class="heading-container">
            <h1 class="socrates-heading">🧠 Socrates v2 Test</h1>
            <p class="info-text">Structured inquiry engine for refined thinking.</p>
        </div>

        <div class="input-container">
            <textarea
                class="socrates-input"
                placeholder="Share your vague or reactive thinking here..."
                bind:value={input}
                onkeypress={filterEnter}
                rows="4"
            ></textarea>
            <div class="button-row">
                <Button
                    text={loading ? "Thinking..." : "Begin Dialectic"}
                    click={submitSocrates}
                    disabled={loading || !input.trim()}
                />
            </div>
        </div>

        {#if error}
            <div class="error-box">
                <p>❌ {error}</p>
            </div>
        {/if}

        {#if loading || events.length > 0}
            <div class="results-container">
                <div class="progress-log">
                    <h3>Process Log</h3>
                    <ul>
                        {#each events as node}
                            <li class={node === current_node ? "active-node" : ""}>
                                Processed node: <strong>{node}</strong>
                                {#if node === current_node && loading}
                                    <span class="pulse">...</span>
                                {/if}
                            </li>
                        {/each}
                    </ul>
                </div>

                <div class="dialectic-results">
                    {#if socratesState.mode}
                        <div class="result-section">
                            <h4>Classification</h4>
                            <p><strong>Mode:</strong> {socratesState.mode}</p>
                            <p><strong>Route:</strong> {socratesState.route}</p>
                        </div>
                    {/if}

                    {#if socratesState.refined_question}
                        <div class="result-section highlight">
                            <h4>Refined Question</h4>
                            <p class="refined-q">{socratesState.refined_question}</p>
                            {#if socratesState.assumptions?.length}
                                <h5>Assumptions</h5>
                                <ul>
                                    {#each socratesState.assumptions as assumption}
                                        <li>{assumption}</li>
                                    {/each}
                                </ul>
                            {/if}
                        </div>
                    {/if}

                    {#if socratesState.thesis}
                        <div class="result-section">
                            <h4>Thesis</h4>
                            <p>{socratesState.thesis}</p>
                        </div>
                    {/if}

                    {#if socratesState.antithesis}
                        <div class="result-section">
                            <h4>Antithesis</h4>
                            <p>{socratesState.antithesis}</p>
                        </div>
                    {/if}

                    {#if socratesState.synthesis}
                        <div class="result-section">
                            <h4>Synthesis</h4>
                            <p>{socratesState.synthesis}</p>
                            {#if socratesState.open_tensions?.length}
                                <h5>Open Tensions</h5>
                                <ul>
                                    {#each socratesState.open_tensions as tension}
                                        <li>{tension}</li>
                                    {/each}
                                </ul>
                            {/if}
                        </div>
                    {/if}

                    {#if socratesState.action_draft}
                        <div class="result-section action-box">
                            <h4>Action Draft</h4>
                            <p>{socratesState.action_draft}</p>
                            {#if socratesState.next_action}
                                <p><strong>Next Step:</strong> {socratesState.next_action}</p>
                            {/if}
                        </div>
                    {/if}

                    {#if socratesState.evaluator_scores && Object.keys(socratesState.evaluator_scores).length > 0}
                        <div class="result-section evaluation">
                            <h4>Self-Evaluation</h4>
                            <p><strong>Passed:</strong> {socratesState.passed_eval ? "✅ YES" : "❌ NO"}</p>
                            <ul>
                                {#each Object.entries(socratesState.evaluator_scores) as [category, score]}
                                    <li>{category}: {score}/2</li>
                                {/each}
                            </ul>
                        </div>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--background-color-light);
        min-height: 100vh;
        padding-bottom: 5rem;
    }

    .content-container {
        width: 80%;
        max-width: 900px;
        margin-top: 4rem;
    }

    .heading-container {
        text-align: center;
        margin-bottom: 3rem;
    }

    .socrates-heading {
        font-family: "Outfit", sans-serif;
        font-size: 3rem;
        font-weight: 800;
        color: var(--blue-color-main);
    }

    .info-text {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 0.5rem;
    }

    .input-container {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        margin-bottom: 2rem;
    }

    .socrates-input {
        width: 100%;
        padding: 1rem;
        border: 2px solid #eee;
        border-radius: 0.5rem;
        font-family: inherit;
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
        resize: vertical;
        min-height: 200px;
    }

    .socrates-input:focus {
        outline: none;
        border-color: var(--button-color);
    }

    .button-row {
        display: flex;
        justify-content: center;
    }

    .error-box {
        background: #fff0f0;
        border-left: 5px solid red;
        padding: 1rem;
        margin-bottom: 2rem;
        border-radius: 0.5rem;
    }

    .results-container {
        display: grid;
        grid-template-columns: 250px 1fr;
        gap: 2rem;
        animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .progress-log {
        background: #f9f9f9;
        padding: 1.5rem;
        border-radius: 0.5rem;
        height: fit-content;
        position: sticky;
        top: 6rem;
    }

    .progress-log h3 {
        font-size: 1rem;
        margin-top: 0;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .progress-log ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .progress-log li {
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }

    .active-node {
        color: var(--blue-color-main);
        background: #eef2f8;
        padding-left: 0.5rem !important;
        border-left: 3px solid var(--blue-color-main);
        font-weight: 600;
    }

    .pulse {
        display: inline-block;
        animation: pulse-anim 1s infinite;
    }

    @keyframes pulse-anim {
        0% { opacity: 1; }
        50% { opacity: 0.3; }
        100% { opacity: 1; }
    }

    .result-section {
        background: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.03);
    }

    .result-section h4 {
        margin-top: 0;
        color: var(--blue-color-main);
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 0.5rem;
    }

    .highlight {
        border: 2px solid var(--button-color);
    }

    .refined-q {
        font-size: 1.3rem;
        font-weight: 600;
        color: var(--blue-color-main);
    }

    .action-box {
        background: var(--blue-color-main);
        color: white;
    }

    .action-box h4 {
        color: var(--button-color);
        border-color: rgba(255,255,255,0.1);
    }

    .evaluation {
        background: #f0f7f0;
    }

    @media (max-width: 800px) {
        .results-container {
            grid-template-columns: 1fr;
        }
        .progress-log {
            position: static;
        }
        .content-container {
            width: 95%;
        }
    }
</style>
