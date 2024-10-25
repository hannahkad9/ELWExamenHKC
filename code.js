const pokemonListContainer = document.getElementById("pokemonList");
const pokemonDetails = document.getElementById("pokemonDetails");

let userTeam = [];

// Carrega els primers 151 Pokémon de la Pokédex de Kanto
async function loadPokemonList() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=151");
    const data = await response.json();

    data.results.forEach((pokemon, index) => {
        displayPokemonInList(pokemon.name, index + 1);
    });
}

// Mostra un Pokémon a la llista principal
function displayPokemonInList(name, id) {
    const pokemonItem = document.createElement("div");
    pokemonItem.className = "pokemon-item";
    
    pokemonItem.innerHTML = `
        <a href="#" onclick="viewPokemonDetails('${name}')" class="pokemon-name">${name}</a> (#${id})
        <button onclick="addToTeam('${name}', ${id})">Afegeix al Equip</button>
    `;
    
    pokemonListContainer.appendChild(pokemonItem);
}


async function viewPokemonDetails(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();
        
        // Set innerHTML to display Pokémon details
        pokemonDetails.innerHTML = `
            <h2>${data.name}</h2>
            <p>ID: ${data.id}</p>
            <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}">
            <p>Types: ${data.types.map(type => type.type.name).join(', ')}</p>
        `;
    } catch (error) {
        console.error("Error fetching Pokémon details:", error);
    }
}



// Inicialitza la pàgina carregant la llista de Pokémon
loadPokemonList();
