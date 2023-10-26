<script>
    import SectionTitle from "../../lib/components/section_title.svelte";
    import TeamCard from "../../lib/components/team_card.svelte";
    import AlumniCard from "../../lib/components/alumni_card.svelte";

    const execTeam = [
        {
            name: "Edward G. Happ",
            position: "Executive Fellow Emeritus",
            description:
                "Edward G. Happ is an Executive Fellow at the University of Michigan School of Information, where he is teaching and conducting research. His 40 years of professional experience include all facets of managing information services and high technology businesses, including general management with P&L responsibility, operations, product management, sales, marketing, customer service, human resources management, technical consulting, manufacturing, and both software and hardware development.",
            image: 'https://pbs.twimg.com/profile_images/1653043667211370496/tsXMk4do_400x400.jpg',
            linkedin: "https://www.linkedin.com/in/edward-g-happ/",
        },
    ];

    const dataTeam = [
        {
            name: "Hina Joshua",
            position: "Data Scientist",
            description: "Hina is a master's student at the University of Michigan School of Information, Master of Applied Data Science Program. She has a Master of Public Health degree from Michigan State University and has previously worked in the public health domain in government and corporate settings where she analyzed health data including state disease surveillance system data and medical insurance claims data for ad hoc and routine report compilation. Hina is interested in the application of NLP in the NGO domain to improve decision-making in development and relief programs.",
            image: "https://media.licdn.com/dms/image/C4E03AQHSs935QuzMhw/profile-displayphoto-shrink_800_800/0/1649256757363?e=2147483647&v=beta&t=THtp_Ris8Bt9DdFXiFedB7wxSsaMxqztomO_ZSE3yqU",
            linkedin: "https://www.linkedin.com/in/hina-joshua-63013a10b/",
        },
        {
            name: "Takao Kakegawa",
            position: "Data Scientist",
            description: "Takao is a current Master's student at the University of Michigan School of Information, in the MADS program. He has an undergraduate degree in Applied Mathematics and Statistics, with a computer science specialisation. He has prior experience in statistical analysis research through the SURF Fellowship at UC Berkeley.",
            image: "https://media.licdn.com/dms/image/C5603AQE0TAUWH63lAw/profile-displayphoto-shrink_800_800/0/1552117070041?e=2147483647&v=beta&t=N5xI3dLQoCNVUA_Ui5kMEiaQEKmxsZsgdNR2snJUUwQ",
            linkedin: "https://www.linkedin.com/in/takao-kakegawa/",
        },
    ];

    const webTeam = [
        {
            name: "Prithvijit Dasgupta",
            position: "Systems Specialist and Web Developer",
            description:
                "Prithvijit is a current Master's student in the University of Michigan School of Information aiming to specialize in the Big Data Analytics track. He has experience working on distributed cloud systems and building RESTful APIs. He has an undergraduate degree in Mechanical Engineering.",
            image: "https://pbs.twimg.com/profile_images/1594033657437736971/sL_utrNg_400x400.jpg",
            linkedin: "https://www.linkedin.com/in/prithvijit-dasgupta/",
        },
        {
            name: "Feng-Yu (Leo) Yeh",
            position: "Web Developer and UX Design",
            description: "Leo is currently a Master's student in the University of Michigan School of information specializing in User-Centered Agile Development. He has an undergraduate degree in Molecular Biology from University of Washington where he worked as a Research Assistant in aging lab. He also worked in a startup as a Assistant Project Manager.",
            image: "https://media.licdn.com/dms/image/C5603AQEGEyFo3e21jQ/profile-displayphoto-shrink_800_800/0/1517068890724?e=2147483647&v=beta&t=nchK4BJ_By58Gr9pARpOz4guLpj_ApVcodnL609vqfs",
            linkedin: "https://www.linkedin.com/in/leoyeh/",
        },
    ];

    const alumni = [
        {
            name: "Sidra Effendi",
            position: "Consultant and Data Scientist",
            startYear: 2021,
            endYear: 2022,
            linkedin: "https://www.linkedin.com/in/sidraeffendi/",
        },
        {
            name: "Kensuke Suzuki",
            position: "Data Consultant",
            startYear: 2021,
            endYear: 2022,
            linkedin: "https://www.linkedin.com/in/kensukesuzuki",
        },
        {
            name: "Anuya Karnik",
            position: "Website Designer",
            startYear: 2021,
            endYear: 2022,
            linkedin: "https://www.linkedin.com/in/anuya-karnik/",
        },
        {
            name: "Harrison Hall",
            position: "Project Manager and Data Scientist",
            startYear: 2021,
            endYear: 2022,
            linkedin: "https://www.linkedin.com/in/harrison-joseph-hall/",
        },
        {
            name: "Mariah Jacobs",
            position: "Web Developer",
            startYear: 2019,
            endYear: 2021,
            linkedin: "https://www.linkedin.com/in/mariah-jacobs/",

        },
        {
            name: "Shivika Bisen",
            position: "Data Scientist",
            startYear: 2020,
            endYear: 2021,
            linkedin: "https://www.linkedin.com/in/shivika-k-bisen/",

        },
        {
            name: "Kevin Lee",
            position: "Data Scientist",
            startYear: 2020,
            endYear: 2021,
            linkedin: "https://www.linkedin.com/in/kevjunlee/",

        },
        {
            name: "Hojoon Kim",
            position: "Project Manager and Data Scientist",
            startYear: 2020,
            endYear: 2021,
            linkedin: "https://www.linkedin.com/in/hojoon-kim-88ba17aa/"
        },
        {
            name: "Cara Canady",
            position: "Data Consultant",
            startYear: 2019,
            endYear: 2020,
            linkedin: "https://www.linkedin.com/in/caracanady/"
        },
        {
            name: "Bryan Romas",
            position: "Data Scientist",
            startYear: 2019,
            endYear: 2020,
            linkedin: "https://www.linkedin.com/in/bryan-romas/"
        },
        {
            name: "Hope Tambala",
            position: "Project Manager",
            startYear: 2019,
            endYear: 2020,
            linkedin: "https://www.linkedin.com/in/hope-tambala/"
        },
        {
            name: "Akio Kakishima",
            position: "Data Scientist",
            startYear: 2019,
            endYear: 2020,
            linkedin: "https://www.linkedin.com/in/akio-kakishima/"
        },
    ];
</script>

<svelte:head>
  <title>Team</title>
</svelte:head>

<div class="cards-container">
    <div class="cards">
        <SectionTitle title="Executive Team" />
        {#each execTeam as member}
            <TeamCard {...member} />
        {/each}
        <SectionTitle title="Data Science Team" />
        {#each dataTeam as member}
            <TeamCard {...member} />
        {/each}
        <SectionTitle title="Web and Systems Team" />
        {#each webTeam as member}
            <TeamCard {...member} />
        {/each}
        <SectionTitle title="Alumni" />
        <div class="alumni-container">
            {#each alumni as member}
                <AlumniCard {...member} />
            {/each}
        </div>
    </div>
</div>

<style>
    .cards-container {
        width: 70%;
    }
    .alumni-container {
        display: flex;
        gap: 2%;
        flex-flow: row wrap;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }
</style>
