//// POKEDEX APP ////
/* This app makes GET requests to the PokeAPI (https://pokeapi.co) */


/// RENDER WEB APP

document.addEventListener('DOMContentLoaded', () => {
    // Initialize and Render 20 Pokemon to DOM
    renderPokemonCards();

    // Grab search form from DOM
    const pokemonForm = document.getElementById('search-form');

    //Add submit event listener to form
    pokemonForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Clear pokemon grid
        document.getElementById('pokemon-display-section').innerHTML ="";
        // Grab form submission, assign to variable
        const pokemonQuery = e.target['search-name'].value;
        searchAndDisplayPokemon(pokemonQuery.toLowerCase());
    })
})
 
 /// BUILD APP FUNCTIONS
 
// Build the render function for pokemon cards

 const renderPokemonCards = async () => {
    
    // Wait until fetchPokemon function retrieves list of random pokemon from PokeAPI    
    const retrievedPokemon = await fetchPokemon();
    // Grab the grid container div from DOM
    const pokemonGrid = document.getElementById('pokemon-display-section');
    // Create Pokemon Card for each pokemon and attach it to the grid container div in the DOM
    retrievedPokemon.map(pokemon => {

        pokemonGrid.innerHTML += 
        `
        <div class="card">
            <div class="card-img">
                <img src = ${pokemon.image} alt= ${pokemon.name}>
            </div>
            <div class="card-info">
                <p class="text-title">${pokemon.name}</p>
            </div>
            <div class="card-button">
                <p class ="detail-btn-text"> Get Details! </p>
            </div>
        </div>
        `
    })
    // Run attachDetailBtnEvent function to attach click events to the "Get Details" button for each Card
    attachDetailBtnEvent()
}

// Build the fetchPokemon function to send GET request to PokeAPI

const fetchPokemon = async () => {
    
    // Writing code to start the API request at a random pokemon endpoint
    // max is 649 because no image exists for 650th pokemon
    const max = 649;
    const min = 1;
    const firstPokemon = Math.floor(Math.random() * (max - min + 1)) + min;
    const pageLimit = 20;  

    // Fetching Pokemon name, url and img to display to DOM
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${firstPokemon}&limit=${pageLimit}`;
    const res = await fetch(url);
    // Storing json response (names and urls) to pokemonData variable
    const pokemonData = await res.json();
    // Creating an array of objects of using the createPokeObj function
    const  pokemonArray = createPokeObj(firstPokemon,pokemonData);
    return pokemonArray;

}

//  Build the createPokeObj function to return array of pokemon objects with desired key-value pairs

const createPokeObj = (firstPokemon, pokemonData) => {

    const pokeObj = pokemonData.results.map((pokemon, index) => (
        {        
            id: firstPokemon + index + 1,
            name: pokemon.name,
            // standard link for all pokemon image i.e. .../dream-world/id
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${firstPokemon +index + 1}.svg`
        
        }
    ))
    return pokeObj;
}

// Build the feature to search a pokemon and display its information
       
const searchAndDisplayPokemon = (query) => {

    fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
        .then(res => res.json())
        .then(data => {

            // Use the returned json data to build pokemon object including pokemon stats like type, weight, moves etc.
            let  searchObj = {
                name: data.name,
                id: data.id,
                // run map function on types and string them together using join
                type: data.types.map((type) => type.type.name).join(', '),
                image: data.sprites.other.dream_world.front_default,
                weight: `${data.weight} kg`,
                // run map function on moves to get the names
                moves: data.moves.map((move) => move.move.name),
                }
            //Append pokemon cards from grid container div
            document.getElementById('pokemon-display-section').innerHTML +=
            `<div class="card">
                <div class="card-img">
                    <img src = ${searchObj.image} alt= ${searchObj.name}>
                </div>
                <div class="card-info">
                    <p class="text-title">${searchObj.name}</p>
                    <p class="text-detail"><span class ="text-title">Type:</span> ${searchObj.type}</p>
                    <p class="text-detail"><span class ="text-title">Moves:</span> ${searchObj.moves[0]}</p>
                    <p class="text-detail"><span class ="text-title">Weight:</span> ${searchObj.weight}</p>
                </div>
            </div>`   
        })
        // Alert user that they have entered an invalid name when PokeAPI fetch request is unsuccessful
        .catch(() => {
            alert('Not a Valid Pokemon :( Please Try Again!');
        })
}

// Build the function to attach events to the "get detail" button of each pokemon card

const attachDetailBtnEvent =  () => {

    // Grab all the cards' button divs 
    document.querySelectorAll('.card-button').forEach(button => {
        // Attach click event listener to each button
        button.addEventListener('click', (e) => {
            //Grab the parent div of the button div and navigate to the child node containing name of pokemon
            const clickedCard = e.target.offsetParent.childNodes[3].innerText;
            //Clear the grid container div before details of clicked card are displayed
            document.getElementById('pokemon-display-section').innerHTML='';
            //Run the searchAndDisplay function using the name of the clicked Pokemon 
            searchAndDisplayPokemon(clickedCard)
        })
    })

}
