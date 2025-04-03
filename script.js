const pkmList = "https://pokeapi.co/api/v2/pokemon?limit=60&offset=0";

let typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#F0B6BC"
};


async function init() {
    try {
        let response = await fetch(pkmList);
        let data = await response.json();
        renderPokemonList(data.results.slice(0, 20));
    } catch (error) {
        console.error("Fehler beim Laden der Pokémon-Liste:", error);
    }
}


async function getPokemonDetails(pokemonData) {
    let speciesUrl = pokemonData.species.url;
    let speciesResponse = await fetch(speciesUrl);
    let speciesData = await speciesResponse.json();
    let height = pokemonData.height / 10;
    let weight = pokemonData.weight / 10;
    let abilities = pokemonData.abilities.map(a => a.ability.name).join(", ");
    let genderRate = speciesData.gender_rate;
    let eggGroups = speciesData.egg_groups.map(group => group.name).join(", ");
    let eggCycle = speciesData.hatch_counter;
    let speciesName = speciesData.name;

    return {
        speciesName,
        height,
        weight,
        abilities,
        genderRate,
        eggGroups,
        eggCycle
    };
}


async function renderPokemonList(pokemonArray) {
    let contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    for (let index = 0; index < pokemonArray.length; index++) {
        let pokemon = pokemonArray[index];
        try {
            let response = await fetch(pokemon.url);
            let pokemonData = await response.json();
            let imageUrl = pokemonData.sprites.front_default;
            let pokemonDetails = await getPokemonDetails(pokemonData);

            let types = renderTypes(pokemonData.types);

            contentDiv.innerHTML += getPokemonCard(index, pokemon, imageUrl, pokemonDetails, types);
        } catch (error) {
            console.error(`Fehler beim Laden von ${pokemon.name}:`, error);
        }
    }
    applyBackgroundColor();
}



function renderTypes(typesArray) {
    return typesArray.map(typeInfo => {
        let typeName = typeInfo.type.name;
        let iconPath = `./assets/pokemonIcons/${typeName}.png`;

        return `<span class="type">
                    <img class="elementIcons type-icon" src="${iconPath}" alt="${typeName}">
                </span>`;
    }).join(' ');
}


function showInfo(sectionId) {
    let infoBoxes = document.querySelectorAll('.infoBox');
    infoBoxes.forEach(infoBox => {
        infoBox.style.display = 'none';
    });
    
    let infoBox = document.getElementById(sectionId);
    if (infoBox) {
        infoBox.style.display = "block";
    } else {
        console.error("Fehler: Element mit ID", sectionId, "nicht gefunden!");
    }
}


async function openOverlay(index) {
    let pokemon = document.querySelectorAll(".pokemonCard")[index];
    if (!pokemon) return;

    let pokemonName = pokemon.querySelector("h3").innerText;
    let pokemonImg = pokemon.querySelector(".overviewImg").src;
    let types = pokemon.querySelector("#types").innerHTML;

    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index + 1}`);
    let pokemonData = await response.json();
    let pokemonDetails = await getPokemonDetails(pokemonData);

    let overlayHTML = getOverlayTemplate(pokemonName, pokemonImg, types, index, pokemonDetails);

    document.body.innerHTML += overlayHTML;

    document.body.style.overflow = "hidden";

    applyOverlayBackgroundColor();
}


function createInfoBox(id, content, hidden = false) {
    let box = document.createElement("div");
    box.id = id;
    box.className = "infoBox";
    if (hidden) box.style.display = "none";
    box.innerHTML = content;
    return box;
}


function closeOverlay() {
    let overlay = document.getElementById("overlay");
    if (overlay) {
        overlay.remove();
    }

    document.body.style.overflow = "auto";
}


function filterPokemon() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const pokemonCards = document.querySelectorAll(".pokemonCard");

    pokemonCards.forEach(card => {
        const nameElement = card.querySelector("h3");
        const pokemonName = nameElement.textContent.toLowerCase();
        
        if (pokemonName.includes(searchTerm)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

const pokemonContainer = document.getElementById('pokemonContainer');
const pokemonData = [];

pokemonData.forEach((pokemon, index) => {
    const cardHTML = getPokemonCard(index, pokemon, imageUrl, pokemon.details, types);
    pokemonContainer.innerHTML += cardHTML;
});





function applyBackgroundColor() {
    const pokemonCards = document.querySelectorAll(".pokemonCard");

    pokemonCards.forEach(card => {
        const typesContainer = card.querySelector("#types");
        const typeElements = typesContainer.querySelectorAll(".type");

        if (typeElements.length > 0) {
            const primaryType = typeElements[0].querySelector("img").alt.toLowerCase();
            const bgClass = `bg_${primaryType.trim()}`;

            if (primaryType) {
                const bgClass = `bg_${primaryType.trim()}`;
                card.classList.add(bgClass);
            }

            card.id = `bg_${primaryType}_${Math.random().toString(36).substr(2, 5)}`; 
            
            card.classList.remove(...card.classList);
            card.classList.add("pokemonCard", bgClass);
        }
    });
}


function applyOverlayBackgroundColor() {
    const overlay = document.getElementById("overlayColors");
    if (!overlay) return;

    const typesContainer = overlay.querySelector(".types");
    const typeElements = typesContainer.querySelectorAll(".type");

    if (typeElements.length > 0) {
        const primaryType = typeElements[0].querySelector("img").alt.toLowerCase();
        const bgClass = `bg_${primaryType.trim()}`;

        overlay.classList.remove(...overlay.classList);
        overlay.classList.add("overlay-content", bgClass);
    }
}
