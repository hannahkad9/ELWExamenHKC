const pokemonListContainer = document.getElementById("pokemonList");
const userTeamContainer = document.getElementById("teamList");
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
        <a href="#" onclick="viewPokemonDetails('${name}', ${id})" class="pokemon-name">${name}</a> (#${id})
        <button onclick="addToTeam('${name}', ${id})">Afegeix al Equip</button>
        <div id="details-${id}" class="pokemon-details" style="display: none;"></div>
    `;
    
    pokemonListContainer.appendChild(pokemonItem);
}



async function viewPokemonDetails(name, id) {
    const detailsContainer = document.getElementById(`details-${id}`);
    
    // Toggle visibility if details are already loaded
    if (detailsContainer.innerHTML) {
        detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
        return;
    }

    // Fetch and display details if not already loaded
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();
        
        detailsContainer.innerHTML = `
            <h2>${data.name}</h2>
            <p>ID: ${data.id}</p>
            <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}">
            <p>Types: ${data.types.map(type => type.type.name).join(', ')}</p>
        `;
        
        // Show the details container
        detailsContainer.style.display = 'block';
    } catch (error) {
        console.error("Error fetching Pokémon details:", error);
    }
}


// Afegeix un Pokémon a l'equip si no hi ha més de 6
function addToTeam(name, id) {
    if (userTeam.length < 6) {
        userTeam.push({ name, id });
        updateTeamDisplay();
    } else {
        alert("El teu equip ja té 6 Pokémon!");
    }
}

// Mostra l'equip de l'usuari
function updateTeamDisplay() {
    userTeamContainer.innerHTML = '';
    userTeam.forEach(pokemon => {
        const teamItem = document.createElement("div");
        teamItem.innerText = `${pokemon.name} (#${pokemon.id})`;
        userTeamContainer.appendChild(teamItem);
    });
}



// Inicialitza la pàgina carregant la llista de Pokémon
loadPokemonList();
