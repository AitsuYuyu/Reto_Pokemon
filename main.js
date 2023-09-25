//id "myPikachu" almacen de la variable myPikachu
let myPikachu = document.querySelector("#myPikachu");

//id "searchInput" almacen de la variable searchInput
const searchInput = document.querySelector("#searchInput");

// id "searchButton" almacen de la variable searchButton
const searchButton = document.querySelector("#searchButton");

//id "pokemonContainer" almacen de la variable pokemonContainer
const pokElements = document.querySelector("#pokElements");

// Agrega un event listener al elemento con id para el click
searchButton.addEventListener("click", async () => {
    // Obtiene el valor del campo de entrada de búsqueda
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    // Verifica no se ha escrito nada o si esta vacio
    if (searchTerm === "") {
        alert("Ingrese un nombre de Pokémon válido.");
        return;
    }
    
    try {
        // Realiza una solicitud a la API de Pokemon utilizando el término de búsqueda
        const res = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`)).json();
        //const vari = document.addEventListener(".trash")
        // Verifica si se encontró el nombre especificado
        if (res && res.name) {
            // Crea un botón con el nombre del Pokémon

            /*const trasher = document.createElement("click");
            trasher.textContent = vari.trash;*/
            const pokemonButton = document.createElement("button");
            pokemonButton.textContent = res.name;
            
            //---aqui hace el mismo proceso que el trainer realizo durante clase-----
            // Agrega un event listener al botón del Pokémon para mostrar una ventana modal con su información
            pokemonButton.addEventListener("click", () => {
                Swal.fire({
                    title: `${res.name}`, // Muestra name
                    text: 'Modal with a custom image.',
                    imageUrl: res.sprites.front_default || '', // Muestra la imagen (si esta disponible)
                    html: `
                        ${res.stats.map(data => `
                            <input 
                                type="range"  
                                value="${data.base_stat}">
                            <label> 
                                <b>${data.base_stat}</b> 
                                ${data.stat.name}</label><br>
                        `).join("")}   
                    `,
                    imageWidth: "80%",
                    imageHeight: "80%",
                });
            });

            // Agrega el botón del Pokémon al contenedor de Pokémon
            pokElements.appendChild(pokemonButton);
        } else {
            alert("Pokémon no encontrado.");
        }
    } catch (error) {
        console.error(error);
        alert("Parece que no se encuentra o esta mal escrito este nombre....");
    }
});




