<div class="simex-container">
  <h1>Digital Crisis Simulation Exercise (SimEx)</h1>
  <p>
    The digital Crisis Simulation Exercise (SimEx) is the latest iteration of a
    multi-year training lab designed to simulate disaster response strategies
    and actions within a realistic crisis setting. The COVID-19 Pandemic
    highlighted the need for remote simulation experiences to enable practicing
    team-based collaboration and critical thinking within a controlled,
    distanced environment.<br /><br /> The SimEx, built in Minecraft, places users
    directly in the heart of a war-torn country to recreate the stress and urgency
    inherent in disaster response situations. Users must effectively demonstrate
    situational awareness, communication, and devise a successful plan to safely
    escape the conflict and evacuate the team across an international border.
  </p>
  <h2>Simex Prototype</h2>
  <div class="responsive-iframe-container">
    <iframe
      title="SimEX"
      style="border: 1px solid rgba(0, 0, 0, 0.1);"
      src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FTUJKvltspIqPOPMv42XLO0%2FUntitled%3Fnode-id%3D2%253A7%26starting-point-node-id%3D2%253A7%26scaling%3Dscale-down"
      allowfullscreen
    />
  </div>
</div>

<style>
  .simex-container {
    font-family: "Open Sans", sans-serif;
    margin: 1rem 12rem 2rem 12rem;
  }

  .responsive-iframe-container {
    position: relative;
    overflow: hidden;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
    height: 0; /* Trigger aspect ratio */
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

  @media (max-width: 768px) {
    .simex-container {
      margin: 1rem 2rem 2rem 2rem;
    }

    h1 {
      font-size: 1.2rem;
    }

    h2 {
      font-size: 1.15rem;
    }

    p {
      font-size: 0.9rem;
    }

    .responsive-iframe-container {
      height: 200px;
    }
  }
</style>
