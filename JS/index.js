// Declaración de variables globales:
let pokemon = [];
const listaPokemon = document.getElementById("listaPokemon");
const searchInput = document.getElementById("search");
const form = document.getElementById("form");
const urlApi = "https://pokeapi.co/api/v2/pokemon/";

// traer Pokémon de la API
const fetchPokemon = async () => {
    for (let i = 1; i <= 500; i++) {
        await getAllPokemon(i);
    }
    displayAllPokemon();
};

// traer Pokémon por su nombre o ID
const getPokemon = async (id) => {
    let found = false;
    for (const poke of pokemon) {
        if (poke.name === id.toLowerCase() || poke.id === parseInt(id)) {
            found = true;
            clearPokemonList();
            displayPokemon(poke);
            break;
        }
    }
    if (!found) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'AL PARECER NO TIENES GUARDADO ESTE POKÉMON EN TU POKÉDEX O LA INFORMACIÉN NO ES CORRECTA',
        });
    }
};

// ID pokémon
const getAllPokemon = async (id) => {
    const res = await fetch(`${urlApi}/${id}`);
    const pokemonData = await res.json();
    pokemon.push(pokemonData);
};

// mostrar todos los Pokémon en la lista
const displayAllPokemon = () => {
    clearPokemonList();
    pokemon.forEach(poke => displayPokemon(poke));
};

// carta con informacion del pokémon
const displayPokemon = (pokemonData) => {
    const pokemonEl = document.createElement("div");
    pokemonEl.classList.add("pokemon");

    const name = pokemonData.name[0].toUpperCase() + pokemonData.name.slice(1);
    const types = pokemonData.types.map(type => type.type.name).join(', ');

    pokemonEl.innerHTML = `
        <img class="pokemon-image" src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="${name}">
        <div class="pokemon-info">
            <h2 class="pokemon-name">${name}</h2>
            <p class="pokemon-types"> ${types}</p>
            <p class="pokemon-id">#${pokemonData.id.toString().padStart(3, 0)}</p>
        </div>
    `;

    listaPokemon.appendChild(pokemonEl);
};

// limpiar la lista de Pokémon
const clearPokemonList = () => {
    listaPokemon.innerHTML = "";
};

// mostrar un mensaje de error
const displayError = (message) => {
    clearPokemonList();
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.textContent = message;
    listaPokemon.appendChild(errorDiv);
};


// submit del formulario de búsqueda
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
        await getPokemon(searchTerm);
        Toastify({
            text: "¡Pokémon, yo te elijo!",
            duration: 5000,
            gravity: "top",
            backgroundColor: "linear-gradient(to right, #FF8008, #FFC837)",
        }).showToast();
    } else {
        displayError("Por favor ingresa el nombre o el ID del Pokémon.");
    }
});

// MANEJO DE CLICKS BOTONES HEADER
const botones = async (buttonId) => {
    clearPokemonList();
    if (buttonId === "ver-todos") {
        displayAllPokemon();
    } else {
        for (const poke of pokemon) {
            const clase = poke.types.map(type => type.type.name);
            if (clase.some(clase => clase.includes(buttonId))) {
                displayPokemon(poke);
            }
        }
    }
};

// CLICK BOTONES HEADER
const botonesHeader = document.querySelectorAll(".btn-header");
botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;
    botones(botonId);
}));

// CARGAR CARDS
fetchPokemon();
