<script>
	export let metadata;
	export let document_language;
	export let document_theme = null; // default value when not present
	export let document_title;
	export let document_summary;
	export let content;
	export let report_type;
	export let locations;
	export let disasters;
	export let full_content;
	export let keywords;
	export let verbose;
	export let hangul_time;
	export let markdown_text;

	import { NO_TITLE_FOUND, DEFAULT_TEXT } from "$lib/assets/constants/constants.js";
	import { marked } from "marked";
	import Collapsible from "./collapsible.svelte";

	let MDasHTML = marked(markdown_text);

	const showNotification = () => {
		const notification = document.getElementById("notification");
		notification.style.opacity = "0";
		notification.style.visibility = "hidden";

		notification.style.visibility = "visible";
		notification.style.opacity = "1";

		// Wait 3 seconds, then start fading out
		setTimeout(() => {
			notification.style.opacity = "0";
			setTimeout(() => {
				notification.style.visibility = "hidden";
			}, 500); // This timeout should match the CSS transition duration
		}, 3000);
	};
</script>

<div class="hangul-result">
	<div id="notification" class="notification">text copied to clipboard</div>
	<p class="time-taken-text"><b>Time taken: </b>{hangul_time} seconds</p>
	<h3 class="header-content">METADATA</h3>

	<Collapsible heading="FILE NAME">
		<div slot="text" class="text-content">{metadata["File name"]}</div>
	</Collapsible>
	<Collapsible heading="NUMBER OF PAGES">
		<div slot="text" class="text-content">{metadata["No.of Pages"]}</div>
	</Collapsible>
	<Collapsible heading="DOCUMENT CREATION DATE">
		<div slot="text" class="text-content">{metadata.doc_created_date}</div>
	</Collapsible>
	{#if metadata.doc_saved_date}
		<Collapsible heading="DOCUMENT SAVED DATE">
			<div slot="text" class="text-content">
				{metadata.doc_saved_date}
			</div>
		</Collapsible>
	{/if}
	<Collapsible heading="DOCUMENT MODIFIED DATE">
		<div slot="text" class="text-content">{metadata.doc_modified_date}</div>
	</Collapsible>

	<h3 class="header-content">CONTENT-BASED INFORMATION</h3>
	{#if document_summary}
		<Collapsible heading="DOCUMENT SUMMARY">
			<div slot="text" class="text-content">{document_summary}</div>
		</Collapsible>
	{/if}
	{#if metadata.Author}
		<Collapsible heading="AUTHOR">
			<div slot="text" class="text-content">{metadata.Author}</div>
		</Collapsible>
	{/if}
	{#if metadata.doc_type}
		<Collapsible heading="DOCUMENT TYPE">
			<div slot="text" class="text-content">{metadata.doc_type}</div>
		</Collapsible>
	{/if}
	{#if report_type}
		<Collapsible heading="REPORT TYPE">
			<div slot="text" class="text-content">{report_type}</div>
		</Collapsible>
	{/if}
	{#if document_language}
		<Collapsible heading="LANGUAGE">
			<div slot="text" class="text-content">
				{document_language.language} (score={document_language.score.toFixed(
					2
				)})
			</div>
		</Collapsible>
	{/if}
	{#if document_theme}
		<Collapsible heading="DOCUMENT THEME">
			<div slot="text" class="text-content">
				{#each document_theme as theme}
          <p>{theme}</p>
        {/each}
			</div>
		</Collapsible>
	{/if}
	{#if document_title}
		<Collapsible heading="DOCUMENT TITLE">
			<div slot="text" class="text-content">
				{document_title != NO_TITLE_FOUND
					? document_title
					: DEFAULT_TEXT}
			</div>
		</Collapsible>
	{/if}
	{#if locations}
		<Collapsible heading="LOCATIONS">
			<div slot="text" class="text-content">
				{locations.length > 0
					? Object.keys(locations).join(" | ")
					: DEFAULT_TEXT}
			</div>
		</Collapsible>
	{/if}
	{#if disasters}
		<Collapsible heading="DISASTERS">
			<div slot="text" class="text-content">{disasters.join(", ")}</div>
		</Collapsible>
	{/if}
	<Collapsible heading="IDENTIFIED KEY PHRASE SEQUENCES">
		<div slot="text" class="text-content">
			{#if keywords.length > 0}
				{#each keywords as keyword}
					<p>{keyword}</p>
				{/each}
			{:else}
				{DEFAULT_TEXT}
			{/if}
		</div>
	</Collapsible>

	<h3 class="header-content">RAW OUTPUT</h3>
	{#if verbose}
		<Collapsible heading="VERBOSE OUTPUT">
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
			markdownText={markdown_text}
			{showNotification}
		>
			<div slot="text" class="text-content">
				<div class="scrollable-box">
					{@html MDasHTML}
				</div>
			</div>
		</Collapsible>
	{/if}
</div>

<style>
	.hangul-result {
		width: 60%;
		display: flex;
		flex-direction: column;
		overflow-wrap: break-word;
		font-family: "Open Sans";
	}

	.time-taken-text {
		margin-top: 3rem;
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
		top: 1rem;
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

	@media (max-width: 700px) {
		.hangul-result {
			width: 90%;
		}

		.header-content {
			font-size: 1.1rem;
		}

		.text-content {
			font-size: 0.9rem;
		}

		.time-taken-text {
			font-size: 0.9rem;
		}

		.prettyprint {
			font-size: 0.8rem;
		}
	}
</style>
