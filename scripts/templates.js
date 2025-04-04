function getPokemonCard(index, pokemon, imageUrl, pokemonDetails, types) {
    return `
        <div id="bgColors" onclick="openOverlay(${index})" class="pokemonCard">
            <div class="nameImgField">
                <div id="nameImg">
                    <h3>#${index + 1} ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                    <img class="overviewImg" src="${imageUrl}" alt="${pokemon.name}">
                </div>
                <div class="types" id="types">
                    ${types}
                </div>
            </div>
        </div>
    `;
}



function getOverlayTemplate(pokemonName, pokemonImg, types, index, pokemonDetails) {
    return `
        <div id="overlay" class="overlay" onclick="closeOverlay()">
            <div id="overlayColors" class="overlay-content" onclick="event.stopPropagation();">
                <button class="close-btn" onclick="closeOverlay()">✖</button>
                <h2>${pokemonName}</h2>
                <img src="${pokemonImg}" alt="${pokemonName}">
                <div class="types mg-btm-16">${types}</div>

                <div class="navBar">
                    <button id="aboutButton" class="btnDesign" onclick="showInfo('info-about-${index}')">About</button>
                    <button class="btnDesign" onclick="showInfo('info-stats-${index}')">Base Stats</button>
                    <button class="btnDesign" onclick="showInfo('info-evolution-${index}')">Evolution</button>
                    <button class="btnDesign" onclick="showInfo('info-moves-${index}')">Moves</button>
                </div>

                <div id="info-about-${index}" class="infoBox" style="display: block;">
                    <p><strong>Species:</strong> ${pokemonDetails.speciesName}</p>
                    <p><strong>Height:</strong> ${pokemonDetails.height} m</p>
                    <p><strong>Weight:</strong> ${pokemonDetails.weight} kg</p>
                    <p><strong>Abilities:</strong> ${pokemonDetails.abilities}</p>
                    <p><strong>Gender Rate:</strong> ${pokemonDetails.genderRate}</p>
                    <p><strong>Egg Groups:</strong> ${pokemonDetails.eggGroups}</p>
                    <p><strong>Egg Cycle:</strong> ${pokemonDetails.eggCycle} steps</p>
                </div>

                <div id="info-stats-${index}" class="infoBox" style="display: none;">
                    ${renderStatsBar("HP", pokemonDetails.stats["hp"])}
                    ${renderStatsBar("Attack", pokemonDetails.stats["attack"])}
                    ${renderStatsBar("Defense", pokemonDetails.stats["defense"])}
                    ${renderStatsBar("Special Attack", pokemonDetails.stats["special-attack"])}
                    ${renderStatsBar("Special Defense", pokemonDetails.stats["special-defense"])}
                    ${renderStatsBar("Speed", pokemonDetails.stats["speed"])}
                    ${renderStatsBar("Total", pokemonDetails.stats["total"])}
                </div>
                
                <div id="info-evolution-${index}" class="infoBox" style="display: none;">
                    <p>Evolution kommen hier.</p>
                </div>
                <div id="info-moves-${index}" class="infoBox" style="display: none;">
                    <p>Moves kommen hier.</p>
                </div>
            </div>
        </div>
    `;
}
