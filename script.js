const pkmList = "https://pokeapi.co/api/v2/pokemon?limit=60&offset=0";

let allPkmColors = [{
    
}]

const typeColors = {
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
        const response = await fetch(pkmList);
        const data = await response.json();
        renderPokemonList(data.results.slice(0, 20));
    } catch (error) {
        console.error("Fehler beim Laden der Pokémon-Liste:", error);
    }
}


async function getPokemonDetails(pokemonData) {
    const speciesUrl = pokemonData.species.url;
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();
    const height = pokemonData.height / 10;
    const weight = pokemonData.weight / 10;
    const abilities = pokemonData.abilities.map(a => a.ability.name).join(", ");
    const genderRate = speciesData.gender_rate;
    const eggGroups = speciesData.egg_groups.map(group => group.name).join(", ");
    const eggCycle = speciesData.hatch_counter;
    const speciesName = speciesData.name;

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
    const contentDiv = document.getElementById("content");

    contentDiv.innerHTML = "";

    for (let index = 0; index < pokemonArray.length; index++) {
        const pokemon = pokemonArray[index];
        try {
            const response = await fetch(pokemon.url);
            const pokemonData = await response.json();
            const imageUrl = pokemonData.sprites.front_default;
            const pokemonDetails = await getPokemonDetails(pokemonData);

            // Füge die Typen hinzu
            const types = renderTypes(pokemonData.types);

            contentDiv.innerHTML += getPokemonCard(index, pokemon, imageUrl, pokemonDetails, types);
        } catch (error) {
            console.error(`Fehler beim Laden von ${pokemon.name}:`, error);
        }
    }
}


function getPokemonType(pokemon) {
    // Überprüfen, ob das Pokémon Typen hat
    if (pokemon.types && pokemon.types.length > 0) {
        // Den ersten Typ zurückgeben
        return pokemon.types[0].type.name;
    } else {
        // Falls kein Typ vorhanden ist, einen Standardwert zurückgeben
        return 'normal';  // Du kannst auch jeden anderen Standard-Typ festlegen
    }
}



function renderTypes(typesArray) {
    return typesArray.map(typeInfo => {
        return `<span class="type">${typeInfo.type.name}</span>`;
    }).join(' ');
}


function showInfo(sectionId) {
    const infoBoxes = document.querySelectorAll('.infoBox');
    infoBoxes.forEach(infoBox => {
        infoBox.style.display = 'none';
    });
    
    const infoBox = document.getElementById(sectionId);
    if (infoBox) {
        infoBox.style.display = "block";
    } else {
        console.error("Fehler: Element mit ID", sectionId, "nicht gefunden!");
    }
}




async function openOverlay(index) {
    const pokemon = document.querySelectorAll(".pokemonCard")[index];
    if (!pokemon) return;

    const pokemonName = pokemon.querySelector("h3").innerText;
    const pokemonImg = pokemon.querySelector(".overviewImg").src;
    const types = pokemon.querySelector("#types").innerHTML;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index + 1}`);
    const pokemonData = await response.json();
    const pokemonDetails = await getPokemonDetails(pokemonData);

    const overlayHTML = getOverlayTemplate(pokemonName, pokemonImg, types, index, pokemonDetails);

    // Overlay ins DOM einfügen
    document.body.innerHTML += overlayHTML;

    document.body.style.overflow = "hidden";
}


function createInfoBox(id, content, hidden = false) {
    const box = document.createElement("div");
    box.id = id;
    box.className = "infoBox";
    if (hidden) box.style.display = "none";
    box.innerHTML = content;
    return box;
}



// Schließt das Overlay
function closeOverlay() {
    const overlay = document.getElementById("overlay");
    if (overlay) {
        overlay.remove();
    }

    document.body.style.overflow = "auto";
}