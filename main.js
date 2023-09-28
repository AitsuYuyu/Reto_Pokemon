let myPikachu = document.querySelector("#myPikachu");
const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const pokElements = document.querySelector("#pokElements");

async function getPokemonFromAPI(id) {
    try {
        const response = await fetch(`https://65124103b8c6ce52b395763c.mockapi.io/pokemon/${id}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Error al obtener el Pokémon desde la API personal.");
            return null;
        }
    } catch (error) {
        console.error("Error al obtener el Pokémon desde la API personal:", error);
        return null;
    }
}

async function saveEditedPokemonToAPI(id, editedData) {
    try {
        const response = await fetch(`https://65124103b8c6ce52b395763c.mockapi.io/pokemon/${id}`, {
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

            pokemonButton.addEventListener("click", async () => {
                const pokemonId = pokemonData.name;

                const editedPokemonData = await getPokemonFromAPI(pokemonId);

                const modalHTML = `
                    <div>
                        <h2>${pokemonData.name}</h2>
                        <img src="${pokemonData.sprites.front_default || ''}" alt="Imagen del Pokémon">
                        ${pokemonData.stats.map(stat => `
                            <div>
                                <input type="range" value="${stat.base_stat}" class="stat-input" data-stat-name="${stat.stat.name}">
                                <span class="stat-value">${stat.base_stat}</span>
                            </div>
                        `).join("")}
                        <button id="editButton">Editar</button>
                    </div>
                `;

                Swal.fire({
                    html: modalHTML,
                    showCancelButton: true,
                    showConfirmButton: false,
                }).then((result) => {
                    updateStatValueElements(); 

                    const editButton = document.getElementById("editButton");
                    if (editButton) {
                        editButton.addEventListener("click", async () => {
                            const editedStats = [];
                            const statInputs = document.querySelectorAll(".stat-input");
                            statInputs.forEach(input => {
                                const statName = input.getAttribute("data-stat-name");
                                const baseStat = parseInt(input.value);
                                editedStats.push({ stat: { name: statName }, base_stat: baseStat });
                            });

                            await saveEditedPokemonToAPI(pokemonId, {
                                ...editedPokemonData,
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
