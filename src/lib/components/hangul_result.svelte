<script>
	export let metadata;
	export let document_language;
	export let document_theme = null; // default value when not present
	export let document_title;
	export let document_summary_parameters = null; // default value when not present
	export let document_summary = null; // default value when not present
	export let content;
	export let report_type;
	export let locations;
	export let disasters = null; // default value when not present
	export let new_detected_disasters = null; // default value when not present
	export let full_content;
	export let keywords;
	export let verbose;
	export let hangul_time;
	export let summary_generation_time = 0;
	export let markdown_text;
	export let fetchingSummaryData = false;
	export let estimatedTimeToAnalyzeSummary = 1000000;
	export let fileName = "N/A";
	export let version = 2;
	export let document_size = 0;

	import { NO_TITLE_FOUND, DEFAULT_TEXT } from "$lib/assets/constants/constants.js";
	import { marked } from "marked";
	import Collapsible from "./collapsible.svelte";
	import StaticResultDisplay from "./static_result_display.svelte";
	import { onMount, afterUpdate } from "svelte";
	import { sleep } from "$lib/components/utils/helper_functions.js";
	import LoadingBar from "$lib/components/loading_bar.svelte";
	import Check from "svelte-material-icons/CheckboxMarkedCircle.svelte";
	import FailAlert from "svelte-material-icons/MessageAlert.svelte";
	import SummaryTextCarousel from "./summary_text_carousel.svelte";
	import {
    INTERVAL,
    MILLISECONDS_TO_SECONDS,
  } from "$lib/assets/constants/constants.js";
	import { getTopLocations, toTitleCase, combineTitleFonts } from "$lib/components/utils/helper_functions.js";
	import { PHONE_SCREEN_WIDTH } from "$lib/assets/constants/constants.js";

	let MDasHTML = marked(markdown_text);
	let loadingProgressSummary = 0;
	let loadingDocumentSummaryComplete = false;
	let topLocations;
	let screenWidth;
	let isMobile = false;

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

	const simulateLoadingSummaryBar = () => {
    const interval = setInterval(() => {
      loadingProgressSummary += (INTERVAL * MILLISECONDS_TO_SECONDS);

      if (loadingProgressSummary >= estimatedTimeToAnalyzeSummary || 
			    document_summary || 
					summary_generation_time === -1) {
        console.log("summary interval cleared");
        clearInterval(interval);
      }
    }, INTERVAL);
  };

	$: {
    if (fetchingSummaryData) {
			console.log("mounting simulateLoadingSummaryBar");
      onMount(() => {
				simulateLoadingSummaryBar();
			});

			onMount(async () => {
				await sleep(1000);
				showNotification("notification-hangul-results", 10000);
			});
    }
  }

	$: {
    if (document_summary && !loadingDocumentSummaryComplete) {
			console.log("mounting notification that document summary results are complete");

			afterUpdate(async () => {
					console.log("completing summary loading bar animation");
					loadingProgressSummary = estimatedTimeToAnalyzeSummary;
					await sleep(500);
					loadingDocumentSummaryComplete = true;
				});
    }
  }

	$: {
		if (loadingDocumentSummaryComplete && summary_generation_time !== 0) {
			afterUpdate(async () => {
				await sleep(2000);
				showNotification("notification-document-summary", 10000);
			});
		}
	}

	$: {
		if (summary_generation_time === -1) {
			afterUpdate(() => {
				showNotification("notification-summary-error", 10000);
			});
		}
	}

	$: {
		if (Object.keys(locations).length > 0) {
			topLocations = getTopLocations(locations, "no_of_occurences");
		}
	}

	const showNotification = (elementID="notification", timeout=3000) => {
		const notification = document.getElementById(elementID);
		notification.style.opacity = "0";
		notification.style.visibility = "hidden";

		notification.style.opacity = "1";
		notification.style.visibility = "visible";

		setTimeout(() => {
			notification.style.opacity = "0";
			setTimeout(() => {
				notification.style.visibility = "hidden";
			}, 500); // This timeout should match the CSS transition duration
		}, timeout);
	};

	// let grouped = document_title.reduce((acc, [num, text]) => {
	// 	acc[num] = acc[num] ? `${acc[num]} ${text}` : text;
	// 	return acc;
	// }, {});

	// let combined = Object.entries(grouped).map(([num, text]) => [Number(num), text]);

	// console.log(combined);
</script>

<div class="hangul-result">
	<div id="notification" class="notification">text copied to clipboard</div>
	<div id="notification-hangul-results" class="notification-hangul-results">Continuing to analyze. Feel free to browse the results while the remaining items load</div>
	<div id="notification-document-summary" class="notification-hangul-results">Your document summary is ready to view</div>
	<div id="notification-summary-error" class="notification-hangul-results">There was an error fetching your document summary</div>
	<div class="complete-results-display">
		<p class="time-taken-text left">Metadata</p>
		{#if isMobile}
			<Check color="var(--button-color)" size="1.8rem"/>
		{:else}
			<Check color="var(--button-color)"/>
		{/if}
		<p class="time-taken-text right">({hangul_time}s)</p>
	</div>
	{#if loadingDocumentSummaryComplete && summary_generation_time !== -1}
		<div class="complete-results-display">
			<p class="time-taken-text left">Summary</p>
			{#if isMobile}
				<Check color="var(--button-color)" size="1.8rem"/>
			{:else}
				<Check color="var(--button-color)"/>
			{/if}
			<p class="time-taken-text right">({summary_generation_time}s)</p>
		</div>
	{:else if summary_generation_time === -1}
		<div class="complete-results-display">
			<p class="time-taken-text left">Summary</p>
			{#if isMobile}
				<FailAlert color="tomato" size="1.8rem"/>
			{:else}
				<FailAlert color="tomato"/>
			{/if}
			<p class="time-taken-text right">(0.00s)</p>
		</div>
	{:else}
		<div class="loading-bar-container">
			<SummaryTextCarousel />
			<LoadingBar
				progress={(loadingProgressSummary / estimatedTimeToAnalyzeSummary) * 100}
				barWidth="10rem"
			/>
		</div>
	{/if}

	<h3 class="header-content">METADATA</h3>
	{#if metadata["File name"] !== "file" || fileName !== "N/A"}
	<StaticResultDisplay heading="FILE NAME" isValid={true} useCheckMark={true}>
		<div slot="text" class="text-content-result-display">
			{#if metadata["File name"] !== "file"}
				{metadata["File name"]}
			{:else}
				{fileName}
			{/if}
		</div>
	</StaticResultDisplay>
	{:else}
		<Collapsible heading="FILE NAME" isValid={false} useCheckMark={true}>
			<div slot="text" class="text-content-result-display">
				{DEFAULT_TEXT}
			</div>
		</Collapsible>
	{/if}

	{#if metadata["No.of Pages"]}
		<StaticResultDisplay heading="NUMBER OF PAGES" isValid={true} useCheckMark={true}>
			<div slot="text" class="text-content-result-display">{metadata["No.of Pages"]}&nbsp;<span class="locations-subtext">({document_size}MBs)</span></div>
		</StaticResultDisplay>
	{:else}
		<Collapsible heading="NUMBER OF PAGES" isValid={false} useCheckMark={true}>
			<div slot="text" class="text-content">
				{DEFAULT_TEXT}
			</div>
		</Collapsible>
	{/if}

	{#if metadata.Author}
		<StaticResultDisplay heading="AUTHOR" isValid={true} useCheckMark={true}>
			<div slot="text" class="text-content-result-display">
				{metadata.Author}
			</div>
		</StaticResultDisplay>
	{:else}
		<Collapsible heading="AUTHOR" isValid={false} useCheckMark={true}>
			<div slot="text" class="text-content">
				{DEFAULT_TEXT}
			</div>
		</Collapsible>
	{/if}

	{#if metadata.doc_created_date}
		<StaticResultDisplay heading="DOCUMENT CREATION DATE" isValid={true} useCheckMark={true}>
			<div slot="text" class="text-content-result-display">{metadata.doc_created_date}</div>
		</StaticResultDisplay>
	{:else}
		<Collapsible heading="DOCUMENT CREATION DATE" isValid={false} useCheckMark={true}>
			<div slot="text" class="text-content">
				{DEFAULT_TEXT}
			</div>
		</Collapsible>
	{/if}

	{#if metadata.doc_saved_date}
		<StaticResultDisplay heading="DOCUMENT SAVED DATE" isValid={true} useCheckMark={true}>
			<div slot="text" class="text-content-result-display">
				{metadata.doc_saved_date}
			</div>
		</StaticResultDisplay>
	{/if}

	{#if metadata.doc_modified_date}
		<StaticResultDisplay heading="DOCUMENT MODIFIED DATE" isValid={true} useCheckMark={true}>
			<div slot="text" class="text-content-result-display">{metadata.doc_modified_date}</div>
		</StaticResultDisplay>
	{:else}
		<Collapsible heading="DOCUMENT MODIFIED DATE" isValid={false} useCheckMark={true}>
			<div slot="text" class="text-content">
				{DEFAULT_TEXT}
			</div>
		</Collapsible>
	{/if}

	<h3 class="header-content">CONTENT-BASED INFORMATION</h3>
	{#if document_title && document_title != NO_TITLE_FOUND}
		<Collapsible heading="DOCUMENT TITLE" isValid={true} useCheckMark={true}>
			<div slot="text" 
					 class="text-content"
					 style={isMobile ? 
				          "font-size: 22px;":
				          "line-height: 2rem"}>
				{#each combineTitleFonts(document_title).sort((a, b) => b[0] - a[0]).filter(item => item[1].length > 1) as item (item[1])}
					{toTitleCase(item[1])} <span class="locations-subtext">@ {Math.round(item[0])}pt font</span><br/>
				{/each}
				<p class="locations-subtext">Displaying titles ordered by largest font in document</p>
			</div>
		</Collapsible>
	{:else}
		<Collapsible heading="DOCUMENT TITLE" isValid={false} useCheckMark={true}>
			<div slot="text" class="text-content">
				{DEFAULT_TEXT}
			</div>
		</Collapsible>
	{/if}

	{#if document_summary && version === 2}
		<Collapsible heading="DOCUMENT SUMMARY" 
								 showCopyButton={true}
								 textToCopy={document_summary}
								 {showNotification}
								 runOpenSequence={true}
								 isValid={true} 
								 useCheckMark={true}
		>
			<div slot="text" 
			     class="text-content"
					 style={isMobile ? 
									"font-size: 17px;":
									""}>
			  {document_summary}
		  </div>
		</Collapsible>
	{:else if version === 2 && summary_generation_time === -1}
		<Collapsible heading="DOCUMENT SUMMARY" isValid={false} useCheckMark={true}>
			<div slot="text" class="text-content">
				{DEFAULT_TEXT}
			</div>
		</Collapsible>
	{:else if version === 2}
		<StaticResultDisplay heading="DOCUMENT SUMMARY">
			<div slot="text" class="text-content-result-display animate-loading">Loading...</div>
		</StaticResultDisplay>
	{/if}

	{#if report_type}
		<StaticResultDisplay heading="REPORT TYPE" isValid={true} useCheckMark={true}>
			<div slot="text" class="text-content-result-display">
				{report_type}
			</div>
		</StaticResultDisplay>
	{:else}
		<Collapsible heading="REPORT TYPE" isValid={false} useCheckMark={true}>
			<div slot="text" class="text-content">
				{DEFAULT_TEXT}
			</div>
		</Collapsible>
	{/if}

	{#if document_language}
		<StaticResultDisplay heading="LANGUAGE" isValid={true} useCheckMark={true}>
			<div slot="text" class="text-content-result-display">
				{document_language.language}
			</div>
		</StaticResultDisplay>
	{:else}
		<Collapsible heading="LANGUAGE" isValid={false} useCheckMark={true}>
			<div slot="text" class="text-content">
				{DEFAULT_TEXT}
			</div>
		</Collapsible>
	{/if}

	{#if document_theme}
		<Collapsible heading="DOCUMENT THEMES" isValid={true} useCheckMark={true}>
			<div slot="text" class="text-content">
				{#each document_theme as theme}
          <p>{theme}</p>
        {/each}
			</div>
		</Collapsible>
	{:else}
		<Collapsible heading="DOCUMENT THEMES" isValid={false} useCheckMark={true}>
			<div slot="text" class="text-content">
				{DEFAULT_TEXT}
			</div>
		</Collapsible>
	{/if}

	{#if locations && Object.keys(locations).length > 0 && topLocations !== null}
		<Collapsible heading="LOCATIONS" isValid={true} useCheckMark={true}>
			<div slot="text" class="text-content">
				{#each Object.values(topLocations) as location (location.country)}
					<p>{location.country} occured {location.occurences} time{location.occurences > 1 ? 's' : ''}</p>
				{/each}
				<p class="locations-subtext">Displaying most frequent locations</p>
			</div>
		</Collapsible>
	{:else}
		<Collapsible heading="LOCATIONS" isValid={false} useCheckMark={true}>
			<div slot="text" class="text-content">
				{DEFAULT_TEXT}
			</div>
		</Collapsible>
	{/if}

	{#if disasters && version === 1}
		<Collapsible heading="DISASTERS" isValid={true} useCheckMark={true}>
			<div slot="text" class="text-content">{disasters.join(", ")}</div>
		</Collapsible>
	{:else if version === 1}
		<Collapsible heading="DISASTERS" isValid={false} useCheckMark={true}>
			<div slot="text" class="text-content">
				{DEFAULT_TEXT}
			</div>
		</Collapsible>
	{/if}

	{#if new_detected_disasters && new_detected_disasters.length > 0 && version === 2}
		<Collapsible heading="DISASTERS" isValid={true} useCheckMark={true}>
			<div slot="text" class="text-content">
				{#each new_detected_disasters as disaster}
					<p>{disaster}</p>
				{/each}
			</div>
		</Collapsible>
	{:else if version === 2}
		<Collapsible heading="DISASTERS" isValid={false} useCheckMark={true}>
			<div slot="text" class="text-content">
				{DEFAULT_TEXT}
			</div>
		</Collapsible>
	{/if}

	{#if keywords.length > 0}
		<Collapsible heading="IDENTIFIED KEY PHRASE SEQUENCES" isValid={true} useCheckMark={true}>
			<div slot="text" 
			     class="text-content"
					 style={isMobile ? 
						      "font-size: 19px;":
						      ""}>
				{#each keywords as keyword}
					<p>{keyword}</p>
				{/each}
			</div>
		</Collapsible>
	{:else}
		<Collapsible heading="IDENTIFIED KEY PHRASE SEQUENCES" isValid={false} useCheckMark={true}>
			<div slot="text" class="text-content">
				{DEFAULT_TEXT}
			</div>
		</Collapsible>
	{/if}

	<h3 class="header-content">RAW OUTPUT</h3>
	{#if verbose}
		<Collapsible heading="VERBOSE OUTPUT" isValid={true} useCheckMark={true}>
			<div slot="text" class="text-content">
				<div class="scrollable-box">
					<pre class="prettyprint">
								{JSON.stringify(
							{
								metadata,
								document_language,
								document_summary,
								document_theme,
								document_title,
								content,
								report_type,
								locations,
								disasters,
								full_content,
								keywords,
							},
							null,
							2
						)}
						</pre>
				</div>
			</div>
		</Collapsible>
	{/if}
	{#if markdown_text}
		<Collapsible
			heading="MARKDOWN TEXT"
			showCopyButton={true}
			textToCopy={markdown_text}
			{showNotification}
			isValid={true} 
			useCheckMark={true}
		>
			<div slot="text" class="text-content">
				<div class="scrollable-box" 
				     style={isMobile ? 
						        "font-size: 17px;":
										""}>
					{@html MDasHTML}
				</div>
			</div>
		</Collapsible>
	{/if}
</div>

<style>
	h3 {
		font-weight: 500;
	}

	.hangul-result {
		width: 60%;
		display: flex;
		flex-direction: column;
		overflow-wrap: break-word;
		font-family: "Open Sans";
		margin: 3rem 0 0 0;
	}

	.time-taken-text {
		margin: 0.2rem 0;
	}

	.header-content {
		margin: 2rem 0 0.5rem 0;
		font-size: 1.3rem;
	}

	pre {
		white-space: pre-wrap;
		white-space: -moz-pre-wrap;
		white-space: -pre-wrap;
		white-space: -o-pre-wrap;
		word-wrap: break-word;
		overflow-x: auto;
	}

	.scrollable-box {
		position: relative;
		/* top: -1rem; */
		height: 15rem;
		overflow-y: auto;
		margin: 0;
		border: none;
		border-radius: 0;
	}

	.text-content {
		margin: 0.5rem 0 1.5rem 1rem;
	}

	.notification {
		display: block;
		position: fixed;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		background-color: rgba(0, 0, 0, 0.65);
		color: white;
		font-size: 0.8rem;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		z-index: 1000;
		opacity: 0; /* start fully transparent */
		visibility: hidden; /* start hidden */
		transition: opacity 0.5s, visibility 0.5s;
	}

	.notification-hangul-results {
		display: block;
		position: fixed;
		top: 4rem;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		background-color: rgba(0, 0, 0, 0.6);
		color: white;
		font-size: 0.9rem;
		padding: 1rem 1rem;
		border-radius: 0.5rem;
		z-index: 1000;
		opacity: 0; /* start fully transparent */
		visibility: hidden; /* start hidden */
		transition: opacity 0.5s, visibility 0.5s;
	}

	.loading-bar-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		text-align: center;
		justify-content: flex-start;
	}

	.text-content-result-display {
		display: flex;
		width: max-content;
		padding: 0 1rem 0 0;
		justify-content: center;
		align-items: center;
		text-align: center;
		height: 1rem;
	}

	.complete-results-display {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.right {
		margin-left: 0.5rem;
	}

	.left {
		margin-right: 0.5rem;
	}

	.animate-loading {
    animation: fadeInOut 3s infinite;
  }

	.locations-subtext {
		font-style: italic;
		color: grey;
	}

  @keyframes fadeInOut {
    0% {opacity: 0.2;}
    50% {opacity: 1;}
    100% {opacity: 0.2;}
  }

	@media (max-device-width: 912px) and (min-resolution: 2dppx) {
		.hangul-result {
			width: 90%;
		}

		.header-content {
			font-size: 2rem;
			margin: 3rem 0 1rem 0;
		}

		.text-content {
			font-size: 30px;
		}

		.time-taken-text {
			font-size: 1.5rem;
		}

		.prettyprint {
			font-size: 14px;
		}

		.scrollable-box {
			height: 30rem;
		}

		.notification {
			font-size: 2rem;
		}

		.notification-hangul-results {
			font-size: 2rem;
		}
	}
</style>
