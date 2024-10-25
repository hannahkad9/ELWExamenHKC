const pokemonListContainer = document.getElementById("pokemonList");
const userTeamContainer = document.getElementById("teamList");
const searchInput = document.getElementById("searchInput");
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
            <button onclick="searchMoves('${name}', ${id})">Show Moves</button>
            <div id="moves-container-${id}" style="display: none;"></div>

        `;
        
        // Show the details container
        detailsContainer.style.display = 'block';
    } catch (error) {
        console.error("Error fetching Pokémon details:", error);
    }
}

async function searchMoves(name, id) {
    const movesContainer = document.getElementById(`moves-container-${id}`);

    movesContainer.style.display = movesContainer.style.display === 'none' ? 'block' : 'none';

    // Only fetch and display moves if container is empty
    if (!movesContainer.innerHTML) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const data = await response.json();

            // Generate HTML for each move with a "View Move Details" button
            const movesHtml = data.moves.slice(0, 5).map((moveInfo) => `
                <p>
                    ${(moveInfo.move.name)}
                    <button onclick="viewMoveDetails('${moveInfo.move.url}', ${id})">View Move Details</button>
                </p>
            `).join("");

            // Set the moves HTML within the moves container
            movesContainer.innerHTML = `<h3>Moves</h3>${movesHtml}<div id="move-details-${id}"></div>`;
        } catch (error) {
            console.error("Error fetching Pokémon moves:", error);
        }
    }
}

// Function to fetch and display specific move details
async function viewMoveDetails(moveUrl, pokemonId) {
    try {
        const response = await fetch(moveUrl);
        const moveData = await response.json();

        // Display the specific move details
        const moveDetailsContainer = document.getElementById(`move-details-${pokemonId}`);
        moveDetailsContainer.innerHTML = `
            <h4>Move: ${(moveData.name)}</h4>
            <p>Type: ${(moveData.type.name)}</p>
            <p>Power: ${moveData.power !== null ? moveData.power : "N/A"}</p>
            <p>Accuracy: ${moveData.accuracy !== null ? moveData.accuracy : "N/A"}</p>
            <p>PP: ${moveData.pp}</p>
        `;
    } catch (error) {
        console.error("Error fetching move details:", error);
    }
}


// Afegeix un Pokémon a l'equip si no hi ha més de 6

async function addToTeam(name) {
    // Check if the team is already full
    if (userTeam.length >= 6) {
        alert("Your team has 6 Pokémon!");
        return;
    }

    const existingPokemon = userTeam.find(pokemon => pokemon.name.toLowerCase() === name.toLowerCase());
    if (existingPokemon) {
        alert(`${existingPokemon.name} is already in your team!`);
        return;
    }

    try {
        // Fetch the Pokémon data from the API
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const pokemonData = await response.json(); // Fetch and parse the JSON

        // Add the full Pokémon data to the team
        userTeam.push({
            name: pokemonData.name,
            id: pokemonData.id,
            sprites: pokemonData.sprites,
            types: pokemonData.types
        });

        // Update the team display after adding the Pokémon
        updateTeamDisplay();
    } catch (error) {
        console.error("Error fetching Pokémon details:", error);
    }
}

// Function to display the user's team
function updateTeamDisplay() {
    userTeamContainer.innerHTML = ''; 

    userTeam.forEach(pokemon => {
        const teamItem = document.createElement("div");


        teamItem.innerHTML = `
            <h3>${pokemon.name}</h3>
            <p>ID: #${pokemon.id}</p>
            <img id="imageteam" src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
            <p>Types: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        `;

        userTeamContainer.appendChild(teamItem); 
    });
}



// Cerca un Pokémon per nom
searchInput.addEventListener("keyup", async (e) => {
    if (e.key === "Enter") {
        const searchQuery = searchInput.value.toLowerCase();
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchQuery}`);
            if (response.ok) {
                const data = await response.json();
                pokemonDetails.innerHTML = `
            <h2>${data.name}</h2>
            <p>ID: ${data.id}</p>
            <img id="imagesearch" src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}">
            <p>Types: ${data.types.map(type => type.type.name).join(', ')}</p>
        `;
            } else {
                alert("Pokémon not found");
            }
        } catch (error) {
            alert("Error while searching");
        }
    }
});

// Inicialitza la pàgina carregant la llista de Pokémon
loadPokemonList();
