
const pokemonList = document.getElementById('pokemonList');
const pokemonDetails = document.getElementById('pokemonDetails');




// Fetch and display all 151 Pokémon
async function fetchAllPokemon() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=151');
        const data = await response.json();
        displayPokemonList(data.results);
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
    }
}
function displayPokemonList(pokemonArray) {
    pokemonList.innerHTML = '';
    pokemonArray.forEach((pokemon, index) => {
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');
        pokemonCard.innerHTML = `
            <p>${index + 1}. ${pokemon.name}</p>
            <button onclick="addToTeam('${pokemon.name}')">Add to Team</button>
        `;
        pokemonCard.addEventListener('click', () => fetchPokemonDetails(pokemon.name));
        pokemonList.appendChild(pokemonCard);
    });
}


fetchAllPokemon();