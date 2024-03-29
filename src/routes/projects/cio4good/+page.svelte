<script>
	import { Tabs, Tab, TabList, TabPanel } from 'svelte-tabs';
</script>

<svelte:head>
	<script
		type="text/javascript"
		src="https://tableau.dsc.umich.edu/javascripts/api/viz_v1.js"
	></script>
</svelte:head>
<div class="cio4good-container">
	<Tabs>
		<TabList>
			<Tab>Visualizations</Tab>
			<Tab>Benchmarking</Tab>
			<Tab>Survey Data</Tab>
			<Tab>Research</Tab>
		</TabList>

		<TabPanel>
			<div>
				<iframe
					title="Visualizations"
					height="1000px"
					width="1000px"
					src="https://tableau.dsc.umich.edu/t/UM-Academic/views/CIO4GOODVisualizationsV2/CountofOrganizationsResponded?:embed=y&:showVizHome=no&:host_url=https%3A%2F%2Ftableau.dsc.umich.edu%2F&:embed_code_version=3&:tabs=yes&:toolbar=yes&:showAppBanner=false&:display_spinner=no&:loadOrderID=0"
				/>
			</div>
		</TabPanel>

		<TabPanel>
			<div>
				<iframe
					title="Benchmarking"
					height="819px"
					width="1030px"
					src="https://tableau.dsc.umich.edu/t/UM-Academic/views/V5Benchmarking/CIO4GOODSurveyBenchmarking?:embed=y&:showVizHome=no&:host_url=https%3A%2F%2Ftableau.dsc.umich.edu%2F&:embed_code_version=3&:tabs=no&:toolbar=yes&:device=desktop&:showAppBanner=false&:display_spinner=no&:loadOrderID=1"
				/>
			</div>
		</TabPanel>

		<TabPanel>
			<div>
				<iframe
					title="Survey Data"
					width="100%"
					height="727px"
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
	}

	.research-tab {
		padding: 1rem;
	}
</style>
