<script>
    // Import the components from the components folder
    // import Card from '$lib/components/card.svelte';
    import NewsCard from '$lib/components/news_card.svelte';
    import SectionTitle from "../../lib/components/section_title.svelte";
    import Poster from '$lib/assets/UMSI Exposition - Sidra & Prithvi 17-Apr-23.jpg'
    import Navbar from '$lib/components/navbar.svelte';
  
    const currentPage = 'news';

    const latest_news = [
        {
            image: Poster,
            category: 'Exposition',
            title: "UMSI Exposition by Sidra and Prithvi on Hangul",
            date: 'April 17th 2023'
        }
        // {
        //     image: Poster,
        //     category: 'Artificial Intelligence',
        //     title: "UMSI Exposition by Sidra and Prithvi on Hangul",
        //     date: 'July 25th 2023'
        // }
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