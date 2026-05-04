<script>
  import SectionTitle from "../../lib/components/section_title.svelte";
  import TeamCard from "../../lib/components/team_card.svelte";
  import AlumniCard from "../../lib/components/alumni_card.svelte";
  import DefaultProfile from "$lib/assets/profile-pics/default_pfp.png";
  import RomanusProfile from "$lib/assets/profile-pics/romanus_berg.png";
  import SudhaProfile from "$lib/assets/profile-pics/sudha_kannan.png";
  import ReedProfile from "$lib/assets/profile-pics/reed_paskvan.png"
  import FrankieProfile from "$lib/assets/profile-pics/frankie_pike.png"
  import Navbar from "$lib/components/navbar.svelte";

  const currentPage = "team";

  const execTeam = [
    {
      name: "Edward G. Happ",
      position: "Executive Fellow Emeritus",
      description:
        "Edward G. Happ is an Executive Fellow at the University of Michigan School of Information, where he is teaching and conducting research. His 40 years of professional experience include all facets of managing information services and high technology businesses, including general management with P&L responsibility, operations, product management, sales, marketing, customer service, human resources management, technical consulting, manufacturing, and both software and hardware development.",
      image:
        "https://pbs.twimg.com/profile_images/1653043667211370496/tsXMk4do_400x400.jpg",
      linkedin: "https://www.linkedin.com/in/edward-g-happ/",
    },
    {
      name: "Romanus Berg",
      position: "Advisor",
      description:
        "Founder at <a href='https://1o1.org/about'>1o1.org</a> and Systems Architect with 20+ years scaling global NGOs, COO/CIO leadership across 90+ countries at a $65M operating scale. Former COO/CIO at Ashoka and VP Operations at Oceana, he has led large-scale global organizational transformation across highly decentralized, international environments.",
      image: RomanusProfile,
      linkedin: "https://www.linkedin.com/in/romanusberg/",
    },
  ];

  const dataTeam = [
    {
      name: "Sudha Kannan",
      position: "Data Scientist",
      description:
        "Sudharsana graduated with a Master’s in Mobile and Embedded Systems from the University of Passau, Germany, and holds a Bachelor’s degree in Information and Communication Technology. She has professional experience in Data Science, having worked for a consulting company, and has also been an academic researcher at the university in the field of Data Science. Additionally, Sudha has experience in Information Technology, having worked for Amazon and Tata Communications Limited in the IT sector.",
      image: SudhaProfile,
      linkedin: "http://www.linkedin.com/in/sudharsanakannan/",
    },
    {
      name: "Reed Paskvan",
      position: "Data Scientist & FrontEnd Dev",
      description:
        "Masters of Applied Data Science from University of Michigan and a Bachelor's of Electrical Engineering from Kettering University. A senior technical specialist with 9 years of experience in consulting from both engineering & IT teams.",
      image: ReedProfile,
      linkedin: "https://www.linkedin.com/in/reedpaskvan/"
    },
    {
      name: "Sihyun Kyung",
      position: "Data Scientist & FrontEnd Dev",
      description:
        "Sihyun graduated with a Master’s in Applied Data Science from the University of Michigan",
      image: DefaultProfile,
      linkedin: "https://www.linkedin.com/in/sihyun-kyung-682088240/"
    },
    {
      name: "Frankie Pike",
      position: "Data Scientist",
      description:
        "Frankie is graduating from the University of Michigan with a Master's of Applied Data Science this April. They live in Chicago, IL, and lead the Lighthouse product. Frankie has been involved in everything from defining the project, to finding (and engineering) datasets, to building the models, to presenting Lighthouse to the public. They are proficient in Python, SQL, LLMs, and machine learning models and especially enjoy working on projects that advance equity and democracy.",
      image: FrankieProfile,
      linkedin: "https://www.linkedin.com/in/frankie-pike/",
    },
    {
      name: "Matthew Ziminski",
      position: "Systems Engineer",
      description:
        "Early-career Software Engineer combining AI Engineering and Systems Engineering to build reliable, production-ready AI solutions, bringing hands-on technical leadership experience to complex initiatives and excelling at delivering scalable end-to-end architectures that integrate generative AI, robust data pipelines, and cloud-native infrastructure. Eager to contribute these strengths to Data4Good while growing further as an AI Systems Engineer.",
      image: DefaultProfile,
      linkedin: "https://www.linkedin.com/in/matthewziminski/",
    },
    {
      name: "Grecia Macias",
      position: "Data Scientist",
      description:
        "Software Engineer with a diverse set of skills from an unconventional interdisciplinary background.",
      image: DefaultProfile,
      linkedin: "https://www.linkedin.com/in/greciamaci/",
    }
  ];

  // const webTeam = [
  //   // {
  //   //   name: "Yilin Fang",
  //   //   position: "Web Developer and UX Designer",
  //   //   description:
  //   //     "Yilin is a senior dual degree student studying Computer Science and User Experience Design at the University of Michigan. Yilin has 3x project and internship experience with product design and research. She has advanced proficiency working with Python, REST API, SQL JavaScript and other full-stack development tools and languages. She is also interested in learning more about AI, LLMs and ML frameworks. ",
  //   //   image:
  //   //     YilinProfile,
  //   //   linkedin: "https://www.linkedin.com/in/yilin-fang/",
  //   // },
  // ];

  const alumni = [
    {
      name: "Xabier Urruchua",
      position: "System Specialist",
      startYear: 2024,
      endYear: 2026,
      linkedin: "https://www.linkedin.com/in/xabier-urruchua-garay-523364232/",
    },
    {
      name: "Yilin Fang",
      position: "Consultant and Data Scientist",
      startYear: 2024,
      endYear: 2025,
      linkedin: "https://www.linkedin.com/in/yilin-fang/",
    },
    {
      name: "Sidra Effendi",
      position: "Consultant and Data Scientist",
      startYear: 2022,
      endYear: 2024,
      linkedin: "https://www.linkedin.com/in/sidraeffendi/",
    },
    {
      name: "Sara Haptonstall",
      position: "Project Manager",
      startYear: 2024,
      endYear: 2025,
      linkedin: "https://www.linkedin.com/in/sarahaptonstall/",
    },
    {
      name: "Prithvijit Dasgupta",
      position: "Systems Specialist and Web Developer",
      startYear: 2023,
      endYear: 2024,
      linkedin: "https://www.linkedin.com/in/prithvijit-dasgupta/",
    },
    {
      name: "Szymon Sarnowicz",
      position: "Full Stack Developer",
      startYear: 2023,
      endYear: 2024,
      linkedin: "https://www.linkedin.com/in/szymonsarnowicz/",
    },
    {
      name: "Takao Kakegawa",
      position: "Data Scientist",
      startYear: 2023,
      endYear: 2024,
      linkedin: "https://www.linkedin.com/in/takao-kakegawa/",
    },
    {
      name: "Hina Joshua",
      position: "Data Scientist",
      startYear: 2023,
      endYear: 2024,
      linkedin: "https://www.linkedin.com/in/hina-joshua-63013a10b/",
    },
    {
      name: "Feng-Yu (Leo) Yeh",
      position: "Web Developer and UX Design",
      startYear: 2023,
      endYear: 2024,
      linkedin: "https://www.linkedin.com/in/leoyeh/",
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
      linkedin: "https://www.linkedin.com/in/hojoon-kim-88ba17aa/",
    },
    {
      name: "Cara Canady",
      position: "Data Consultant",
      startYear: 2019,
      endYear: 2020,
      linkedin: "https://www.linkedin.com/in/caracanady/",
    },
    {
      name: "Bryan Romas",
      position: "Data Scientist",
      startYear: 2019,
      endYear: 2020,
      linkedin: "https://www.linkedin.com/in/bryan-romas/",
    },
    {
      name: "Hope Tambala",
      position: "Project Manager",
      startYear: 2019,
      endYear: 2020,
      linkedin: "https://www.linkedin.com/in/hope-tambala/",
    },
    {
      name: "Akio Kakishima",
      position: "Data Scientist",
      startYear: 2019,
      endYear: 2020,
      linkedin: "https://www.linkedin.com/in/akio-kakishima/",
    },
  ];
</script>

<svelte:head>
  <title>Team</title>
</svelte:head>

<Navbar {currentPage} />
<div class="container">
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
      <!-- <SectionTitle title="Web and Systems Team" />
      {#each webTeam as member}
        <TeamCard {...member} />
      {/each} -->
      <SectionTitle title="Alumni" />
      <div class="alumni-container">
        {#each alumni as member}
          <AlumniCard {...member} />
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .container {
    height: 100%;
    display: flex;
    justify-content: center;
    padding: 1%;
  }

  .cards-container {
    width: 70%;
    margin: 0 0 2rem 0;
  }
  
  .alumni-container {
    display: flex;
    gap: 2%;
    flex-flow: row wrap;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }

  @media (max-device-width: 912px) and (min-resolution: 2dppx) {
    .cards-container {
      width: 90%;
    }
  }
</style>
