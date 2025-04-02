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
            contentDiv.innerHTML += getPokemonCard(index, pokemon, imageUrl, pokemonDetails);
        } catch (error) {
            console.error(`Fehler beim Laden von ${pokemon.name}:`, error);
        }
    }
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

