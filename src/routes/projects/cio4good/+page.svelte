<script>
	import { Tabs, Tab, TabList, TabPanel } from 'svelte-tabs';
	import Navbar from '$lib/components/navbar.svelte';

	let currentPage = 'cio4good';
</script>

<svelte:head>
	<script
		type="text/javascript"
		src="https://tableau.dsc.umich.edu/javascripts/api/viz_v1.js"
	></script>
</svelte:head>

<Navbar {currentPage} />
<div class="cio4good-container">
	<Tabs>
		<TabList>
			<div class="tablist-container">
			<div class="tablist">
				<Tab>Visualizations</Tab>
			</div>
			<div class="tablist">
				<Tab>Benchmarking</Tab>
			</div>
			<div class="tablist">
				<Tab>Survey Data</Tab>
			</div>
			<div class="tablist">
				<Tab>Research</Tab>
			</div>
			</div>
		</TabList>

		<TabPanel>
			<div class="responsive-iframe-container">
				<iframe
					title="Visualizations"
					src="https://tableau.dsc.umich.edu/t/UM-Academic/views/CIO4GOODVisualizationsV2/CountofOrganizationsResponded?:embed=y&:showVizHome=no&:host_url=https%3A%2F%2Ftableau.dsc.umich.edu%2F&:embed_code_version=3&:tabs=yes&:toolbar=yes&:showAppBanner=false&:display_spinner=no&:loadOrderID=0"
				/>
			</div>
		</TabPanel>

		<TabPanel>
			<div class="responsive-iframe-container">
				<iframe
					title="Benchmarking"
					src="https://tableau.dsc.umich.edu/t/UM-Academic/views/V5Benchmarking/CIO4GOODSurveyBenchmarking?:embed=y&:showVizHome=no&:host_url=https%3A%2F%2Ftableau.dsc.umich.edu%2F&:embed_code_version=3&:tabs=no&:toolbar=yes&:device=desktop&:showAppBanner=false&:display_spinner=no&:loadOrderID=1"
				/>
			</div>
		</TabPanel>

		<TabPanel>
			<div class="responsive-iframe-container">
				<iframe
					title="Survey Data"
					src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQyDHBTILuOdRgKr2YA7lOjGKjQINCpfTp-ptqOEUs7cwy-QTvpUS_9_ePXOI3tD6FdvNZbtpQIWvuk/pubhtml?gid=1528335567&amp;single=true&amp;widget=true&amp;headers=false"
				/>
			</div>
		</TabPanel>

		<TabPanel>
			<div class="research-tab">
				<h2>What do NPO IT leaders say about investment over the past 17 years?</h2>
				<h3>Description</h3>
				<p>
					The Data4Good Center at the University of the Michigan School of Information (UMSI) brings
					together non-profit organizations? (NPOs) data into larger datasets for benchmarking and
					trend analysis. The CIO4Good is a listserv of over 300 NPO IT leaders. Since 2001 a
					portion of CIOs have voluntarily respond to an annual survey of their IT practices.
				</p>
				<h3>Background Information</h3>
				<p>
					Non-profit organizations do not spend the needed / required amount on overhead especially
					IT costs, according Ann Goggins Gregory and Don Howard; they call this the NPO Starvation
					Cycle where funders have unrealistic expectations, non-profits feel pressure to conform,
					and non-profits neglect i nfrastructure and misrepresent data.
				</p>
				<h3 class>Findings</h3>
				<ol>
					<li>IT spending in NPOs is slightly growing.</li>
					<li>
						Government and education sector IT spending is similar to NPOs, nearing a 1% growth
						rate.
					</li>
					<li>The IT gap is growing among government, education and service sectors.</li>
				</ol>
				<h3>
					Read the full paper <a
						href="https://docs.google.com/document/d/1dFlhdqrhOumFIe2R1kGiSPkHdsr7RoLq9CUqLYQGV80/edit?usp=sharing"
						target="_blank"
						rel="noreferrer">here</a
					>.
				</h3>
			</div>
		</TabPanel>
	</Tabs>
</div>

<style>
	.cio4good-container {
		font-family: "Open Sans", sans-serif;
		margin: 1rem 12rem 2rem 12rem;
		background-color: var(--background-color-light);
	}

	.research-tab {
		padding: 1rem;
	}

	.responsive-iframe-container {
    position: relative;
    overflow: hidden;
    padding-top: 56.25%;
    height: 0;
    width: 100%;
		font-size: 0.5rem;
	}

	.responsive-iframe-container iframe {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
	}

	.tablist-container {
		display: flex;
		justify-content: space-around;
	}

	.tablist {
		font-size: 1rem
	}

	@media (max-device-width: 912px) and (min-resolution: 2dppx) {
		.cio4good-container {
			margin: 1rem 1rem 2rem 1rem;
		}

		.tablist {
			font-size: 0.85rem;
			padding: 0;
			margin: 0;
		}

		.research-tab h2 {
			font-size: 1rem;
		}

		.research-tab p {
			font-size: 0.9rem;
		}

		.research-tab h3 {
			font-size: 1rem;
		}
		
		.research-tab ol {
			font-size: 0.9rem;
		}

		.responsive-iframe-container {
			height: 400px;
		}
	}
</style>
