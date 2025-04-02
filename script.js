const pkmList = "https://pokeapi.co/api/v2/pokemon?limit=60&offset=0";

async function init() {
    try {
        const response = await fetch(pkmList);
        const data = await response.json();
        renderPokemonList(data.results.slice(0, 20));
    } catch (error) {
        console.error("Fehler beim Laden der Pokémon-Liste:", error);
    }
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

            contentDiv.innerHTML += `
                <div class="pokemonCard">
                    <div class="nameImgField">
                        <h3>#${index + 1} ${pokemon.name}</h3>
                        <img src="${imageUrl}" alt="${pokemon.name}">
                    </div>
                    <div class="navBar">
                        <button onclick="showInfo('info-about-${index}')">About</button>
                        <button onclick="showInfo('info-stats-${index}')">Base Stats</button>
                        <button onclick="showInfo('info-evolution-${index}')">Evolution</button>
                        <button onclick="showInfo('info-moves-${index}')">Moves</button>
                    </div>
                        <div id="info-about-${index}" class="infoBox"></div>
                        <div id="info-stats-${index}" class="infoBox"></div>
                        <div id="info-evolution-${index}" class="infoBox"></div>
                        <div id="info-moves-${index}" class="infoBox"></div>
                </div>
            `;
        } catch (error) {
            console.error(`Fehler beim Laden von ${pokemon.name}:`, error);
        }
    }
}

function showInfo(sectionId) {
    const infoBox = document.getElementById(sectionId);
    if (infoBox) {
        infoBox.innerHTML = `<p>Informationen zu ${sectionId.replace(/info-|-\\d+$/, '')} werden hier angezeigt.</p>`;
        infoBox.style.display = "block";
    } else {
        console.error("Fehler: Element mit ID", sectionId, "nicht gefunden!");
    }
}
