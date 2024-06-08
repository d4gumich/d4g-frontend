<script>
    // Import the components from the components folder
    // import Card from '$lib/components/card.svelte';
    import NewsCard from '$lib/components/news_card.svelte';
    import SectionTitle from "../../lib/components/section_title.svelte";
    import Poster from '$lib/assets/UMSI Exposition - Sidra & Prithvi 17-Apr-23.jpg'
  
    // Define some data for the cards

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
    .a{
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

    .horizontal.divider {
        /* place the header at the middle of the page */
        margin-top: 0;
        margin-bottom: 0;
        /* make the header span the entire width of the page */
        width: 100%;
        /* center the text */
        text-align: center;
    }

    .header:first-child {
        margin-top: 1em;
    }

    .header{
        font: 1.28571429rem;
        padding-top: 2%;
        border: none;
        margin: calc(2rem - .14285714em) 0 1rem;
        padding: 0 0;
        /* font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif; */
        font-weight: 700;
        line-height: 1.28571429em;
        text-transform: none;
        color:rgba(0, 0, 0, .87);
        font-family: 'Roboto', sans-serif;
    }

    h1 {
        font-family: Work Sans;
        text-decoration: underline rgba(227, 184, 120, 1) 3px;
        text-underline-offset: 15px;

    }

    p{
        font-family: 'Roboto', sans-serif;
        font-size: 1rem;
    }

    @media (max-device-width: 912px) and (min-resolution: 2dppx) {
        .horizontal-segment {
            margin: 1rem 0 5rem 0;
            padding: 0;
        }
    }

</style>

<div class="a">
    <SectionTitle title="The Latest News" />
    <div class="horizontal-segment">
        {#each latest_news as news}
        <!-- Use a separate component for each card -->
            <NewsCard {...news} />
        {/each}
    </div>
</div>