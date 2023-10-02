const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const pokElements = document.querySelector("#pokElements");

async function getPokemonFromAPI(id) {
    const response = await fetch(`http://127.0.2.1:5030/pokemon/${id}`);
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error("Pokémon no encontrado en la API personal.");
    }
}

async function saveEditedPokemonToAPI(id, editedData) {
    try {
        const response = await fetch(`http://127.0.1.1:5040/pokemon/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editedData),
        });

        if (response.ok) {
            console.log("Cambios guardados correctamente en la API personal.");
        } else {
            console.error("Error al guardar los cambios en la API personal.");
        }
    } catch (error) {
        console.error("Error al guardar los cambios en la API personal:", error);
    }
}

function updateStatValueElements() {
    const statInputs = document.querySelectorAll(".stat-input");
    statInputs.forEach(input => {
        const statValueElement = input.nextElementSibling;
        statValueElement.textContent = input.value;
    });
}

searchButton.addEventListener("click", async () => {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === "") {
        alert("Ingrese un nombre de Pokémon válido.");
        return;
    }

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);

        if (res.ok) {
            const pokemonData = await res.json();

            const pokemonButton = document.createElement("button");
            pokemonButton.textContent = pokemonData.name;
            pokemonButton.id = "editButton"; // Agrega un identificador único al botón "Editar"

            pokemonButton.addEventListener("click", async () => {
                const pokemonId = pokemonData.name;
            
                try {
                    const pokemonDetails = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
                    const pokemonJson = await pokemonDetails.json();
            
                    const modalHTML = `
                        <div class="fondoTarjetas">
                            <h2>${pokemonJson.name}</h2>
                            <div class="contieneImg">
                                <img src="${pokemonJson.sprites.front_default || ''}" alt="Imagen del Pokémon">
                            </div>
                            ${pokemonJson.stats.map(stat => `
                                <div class="contieneRangos">
                                    <input type="range" value="${stat.base_stat}" class="stat-input" data-stat-name="${stat.stat.name}">
                                    <span class="stat-value">${stat.base_stat}</span>
                                </div>
                            `).join("")}
                            <button id="saveButton">Guardar Cambios</button>
                        </div>
                    `;
            
                    Swal.fire({
                        html: modalHTML,
                        showCancelButton: true,
                        showConfirmButton: false,
                    }).then(async (result) => {
                        updateStatValueElements();
            
                        const saveButton = document.getElementById("saveButton");
                        if (saveButton) {
                            saveButton.addEventListener("click", async () => {
                                const editedStats = [];
                                const statInputs = document.querySelectorAll(".stat-input");
                                statInputs.forEach(input => {
                                    const statName = input.getAttribute("data-stat-name");
                                    const baseStat = parseInt(input.value);
                                    editedStats.push({ stat: { name: statName }, base_stat: baseStat });
                                });
            
                            
                                await saveEditedPokemonToAPI(pokemonId, {
                                    ...pokemonJson,
                                    stats: editedStats,
                                });
            
                                Swal.update({ text: "Cambios guardados correctamente.", icon: "success" });
                            });
                        }
                    });
            
                    const statInputs = document.querySelectorAll(".stat-input");
                    statInputs.forEach(input => {
                        input.addEventListener("input", () => {
                            const statValueElement = input.nextElementSibling;
                            statValueElement.textContent = input.value;
                        });
                    });
                } catch (error) {
                    console.error("Error al obtener datos del Pokémon desde el PokeAPI:", error);
                    alert("Ha ocurrido un error al obtener datos del Pokémon desde el PokeAPI.");
                }
            });
            pokElements.appendChild(pokemonButton);
        } else {
            alert("Pokémon no encontrado.");
        }
    } catch (error) {
        console.error("Error al buscar Pokémon:", error);
        alert("Ha ocurrido un error al buscar el Pokémon.");
    }
});
