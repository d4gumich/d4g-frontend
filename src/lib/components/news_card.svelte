<script>
  // Define the props for the card component
  export let image;
  export let category;
  export let title;
  export let date;
</script>

<div class="card-container">
  <div class="card">
    <img src={image} alt="logo" height="30%" />
    <div class="content">
      <div class="text">
        <h1>{category}</h1>
        <h2>{title}</h2>
        <h3>{date}</h3>
      </div>
    </div>
  </div>
</div>

<style>
  .card-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem 0 0 0;
  }

  .card {
    width: auto;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    display: flex;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 0 0 5rem;
  }

  .text {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  h1 {
    width: auto;
    color: rgba(0, 0, 0, 0.87);
    text-align: center;
    font-family: "Open Sans";
    font-size: 3rem;
    font-style: normal;
    font-weight: 700;
    margin: 0 0 2rem 0;
    text-decoration: underline rgba(227, 184, 120, 1) 3px;
    text-underline-offset: 10px;
    color: #232323;
    font-style: normal;
    font-weight: 700;
    line-height: 30px;
  }

  h2 {
    color: #232323;
    font-family: "Open Sans";
    font-size: 1.2rem;
    margin: 0 0 1rem 0;
  }

  h3 {
    color: #232323;
    font-family: "Open Sans";
    margin: 0;
    color: rgba(0, 0, 0, 0.75);
    font-size: 1.2rem;
    font-style: normal;
  }

  img {
    background-repeat: no-repeat;
    background-size: cover;
    width: 15rem;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: #232323 -8px 10px 0px;
  }

  @media (max-device-width: 912px) and (min-resolution: 2dppx) {
    .card-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 2rem 0 0 0;
    }

    .card {
      width: auto;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      display: flex;
    }

    img {
      width: auto;
      height: 30rem;
    }

    h1 {
      margin: 5rem 0 2rem 0;
      font-size: 4rem;
    }

    h2 {
      font-size: 2rem;
      font-weight: 200;
      width: 80%;
    }

    h3 {
      font-size: 2rem;
      font-weight: 200;
    }

    .content {
      margin: 0 0 0 0rem;
    }

    .card {
      margin: 0 0 0 4rem;
    }

    .text {
      align-items: center;
      text-align: center;
    }
  }
</style>
