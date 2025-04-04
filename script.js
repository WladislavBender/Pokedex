const pkmList = "https://pokeapi.co/api/v2/pokemon?limit=60&offset=0";
let loadedPokemonCount = 20;


window.addEventListener("load", () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById("loadingScreen");
        loadingScreen.classList.add("hidden");
    }, 5000);
});


async function init() {
    try {
        let response = await fetch(pkmList);
        let data = await response.json();
        renderPokemonList(data.results.slice(0, 20));
    } catch (error) {
        console.error("Fehler beim Laden der Pokémon-Liste:", error);
    }
}


async function loadMorePokemons() {
    try {
        document.getElementById("loadingScreen").classList.remove("hidden");
        const data = await (await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${loadedPokemonCount}`)).json();
        renderPokemonList(data.results);
        loadedPokemonCount += 20;
    } catch (error) {
        console.error("Fehler beim Laden der weiteren Pokémon:", error);
    } finally {
        setTimeout(() => document.getElementById("loadingScreen").classList.add("hidden"), 5000);
    }
}


async function getPokemonDetails(pokemonData) {
    const speciesData = await (await fetch(pokemonData.species.url)).json();
    const stats = pokemonData.stats.reduce((acc, stat) => (acc[stat.stat.name] = stat.base_stat, acc), { total: pokemonData.stats.reduce((sum, stat) => sum + stat.base_stat, 0) });
    return {
        speciesName: speciesData.name,
        height: pokemonData.height / 10,
        weight: pokemonData.weight / 10,
        abilities: pokemonData.abilities.map(a => a.ability.name).join(", "),
        genderRate: speciesData.gender_rate,
        eggGroups: speciesData.egg_groups.map(group => group.name).join(", "),
        eggCycle: speciesData.hatch_counter,
        stats,
        moves: pokemonData.moves.map(move => move.move.name).join(", ")
    };
}


async function renderPokemonList(pokemonArray) {
    let contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";
    for (let index = 0; index < pokemonArray.length; index++) {
        let pokemon = pokemonArray[index];
        try {
            const pokemonData = await (await fetch(pokemon.url)).json();
            const imageUrl = pokemonData.sprites.front_default;
            const pokemonDetails = await getPokemonDetails(pokemonData);
            const types = renderTypes(pokemonData.types);
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
    document.querySelectorAll('.infoBox').forEach(box => box.style.display = 'none');
    const infoBox = document.getElementById(sectionId);
    if (infoBox) infoBox.style.display = "block";
    else console.error("Fehler: Element mit ID", sectionId, "nicht gefunden!");

    document.querySelectorAll('.navBar button').forEach(button => button.classList.remove("active-button"));
    const activeButton = document.querySelector(`.navBar button[onclick="showInfo('${sectionId}')"]`);
    if (activeButton) activeButton.classList.add("active-button");
}


async function openOverlay(index) {
    let pokemon = document.querySelectorAll(".pokemonCard")[index];
    if (!pokemon) return;
    const pokemonName = pokemon.querySelector("h3").innerText.split(" ")[1];
    const pokemonImg = pokemon.querySelector(".overviewImg").src;
    const types = pokemon.querySelector("#types").innerHTML;
    const pokemonData = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)).json();
    const pokemonDetails = await getPokemonDetails(pokemonData);
    const games = await getPokemonGames(pokemonName.toLowerCase());

    document.body.innerHTML += getOverlayTemplate(pokemonName, pokemonImg, types, index, pokemonDetails, games);
    document.body.style.overflow = "hidden";

    firstActiveOverlayBtn();
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
    document.querySelectorAll(".pokemonCard").forEach(card => {
        const typeElements = card.querySelector("#types").querySelectorAll(".type");
        if (typeElements.length > 0) {
            const primaryType = typeElements[0].querySelector("img").alt.toLowerCase().trim();
            const bgClass = `bg_${primaryType}`;
            card.className = `pokemonCard ${bgClass}`;
            card.id = `bg_${primaryType}_${Math.random().toString(36).substr(2, 5)}`;
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


function firstActiveOverlayBtn() {
    document.getElementById('aboutButton').classList.add('active-button');
}


function renderStatsBar(statName, value) {
    const maxStat = 255, percentage = (value / maxStat) * 100;
    const statColors = { hp: "#FF5959", attack: "#F5AC78", defense: "#FAE078", "special-attack": "#9DB7F5", "special-defense": "#A7DB8D", speed: "#FA92B2", total: "#A8A878" };
    return `
        <div class="stat-container">
            <span class="stat-name">${statName.toUpperCase()}</span>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${percentage}%; background-color: ${statColors[statName] || '#A8A878'};"></div>
            </div>
            <span class="stat-value">${value}</span>
        </div>
    `;
}


async function getPokemonGames(pokemonName) {
    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        let data = await response.json();

        let games = data.game_indices.map(entry => entry.version.name);

        return games;
    } catch (error) {
        console.error(`Fehler beim Abrufen der Spiele für ${pokemonName}:`, error);
        return [];
    }
}


function capitalizeGameNames(games) {
    return games.map(game => game.charAt(0).toUpperCase() + game.slice(1));
}


function capitalizeFirstLetterOfEachWord(str) {
    return str
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}


function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


function navigatePokemon(direction) {
    let overlay = document.getElementById("overlay");
    if (!overlay) return;

    let currentIndex = parseInt(overlay.getAttribute("data-index"));
    let newIndex = currentIndex + direction;

    let pokemonCards = document.querySelectorAll(".pokemonCard");
    if (newIndex < 0 || newIndex >= pokemonCards.length) return;

    closeOverlay();
    setTimeout(() => openOverlay(newIndex), 50);
}