<script>
    // Define the props for the card component
    export let name;
    export let link;
    export let role;
    export let bio;
  </script>
  
  <style>
    /* Add any styles specific to the card component */
    .card{
      max-width: 100%;
      position: relative;
      display: flex;
      min-height: 0;
      padding: 0;
      border: none;
      border-radius: .28571429rem;
      margin: .875em .5em;
      font-family: "Open Sans", sans-serif;
    }
    
    .cards{
      margin-left: -.75em;
      margin-right: -.75em;
    }

    .content{
      -ms-flex-positive: 1;
      flex-grow: 1;
      border: none;
      border-top: 1px solid rgba(34,36,38,.1);
      background: 0 0;
      margin: 0;
      padding: 1em 1em;
      -webkit-box-shadow: none;
      box-shadow: none;
      font-size: 1em;
      border-radius: 0;
      font-family: 'Roboto', sans-serif;
    }

    h3, a{
      margin: calc(2rem - .14285714em) 0 1rem;
      margin-top: 0;
      padding: 0;
      font-family: 'Roboto', sans-serif;
      color: #4183c4;
      text-decoration: none;
      text-decoration-line: none;
      text-decoration-thickness: initial;
      text-decoration-style: initial;
      text-decoration-color: initial;
    }

    a:visited{
      color: #4183c4;
      text-decoration: none;
      text-decoration-line: none;
      text-decoration-thickness: initial;
      text-decoration-style: initial;
      text-decoration-color: initial;
    }
  </style>
  
  <div class="cards">
    <div class="card">
      <div class="content">
        <h3><a href={link}>{name}</a></h3>
        <h4>{role}</h4>
        <!-- Use @html to render HTML strings as markup -->
        {@html bio}
      </div>
    </div>
  </div>
