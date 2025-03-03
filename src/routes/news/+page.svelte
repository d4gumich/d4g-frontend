<script>
    // Import the components from the components folder
    // import Card from '$lib/components/card.svelte';
    import NewsCard from '$lib/components/news_card.svelte';
    import SectionTitle from "../../lib/components/section_title.svelte";
    import Poster from '$lib/assets/UMSI Exposition - Sidra & Prithvi 17-Apr-23.jpg'
    import nethope from '$lib/assets/nethope_hero_image.png'
    import reliefweb from '$lib/assets/reliefweb_logo.jpg'
    import Navbar from '$lib/components/navbar.svelte';
  
    const currentPage = 'news';

    const latest_news = [
        {
            image: nethope,
            category: 'NetHope Summit 2024',
            title: "Using AI to find and analyze NGO PDF reports by Edward Happ and Sidra Effendi",
            link: "https://docs.google.com/presentation/d/16yn-pe-QLZzMClx0AMlHeRfL7Rt3q2Mn/edit?usp=sharing&ouid=106641686144189432819&rtpof=true&sd=true",
            date: 'October 2024'
        },
        {
            image: reliefweb,
            category: 'ReliefWeb Presentation',
            title: "AI Products & Demo",
            link: "https://docs.google.com/presentation/d/1YeK5ZM0UUTl_S2nThGYt3QW0dHMOQiAF/edit?usp=sharing&ouid=106641686144189432819&rtpof=true&sd=true",
            date: 'July 2024'
        },
        {
            image: Poster,
            category: 'UMSI Exposition',
            title: "UMSI Exposition by Sidra and Prithvi on Hangul",
            date: 'April 17th 2023'
        }
    ]
  
</script>

<svelte:head>
  <title>News</title>
</svelte:head>
  
<style>
    .a {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--background-color-light);
        padding-bottom: 4%;
        padding-top: 1.5%;
        flex-direction: column;
        align-items: center;
    }

    .horizontal-segment {
        display: flex;
        justify-content: center; /* Horizontally center the cards */
        gap: 50px; /* Adjust the gap between the cards */
        flex-direction: row;
        flex-flow: row wrap;
        padding-top: 1%;
        padding-bottom: 2%
    }

    @media (max-device-width: 912px) and (min-resolution: 2dppx) {
        .a {
            margin: 2rem 0 0 0;
        }
        
        .horizontal-segment {
            margin: 3rem 0 5rem 0;
            padding: 0;
        }
    }

</style>

<Navbar {currentPage} />
<div class="a">
    <SectionTitle title="The Latest News" />
    <div class="horizontal-segment">
        {#each latest_news as news}
        <!-- Use a separate component for each card -->
            <NewsCard {...news} />
        {/each}
    </div>
</div>