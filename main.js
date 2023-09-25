//id "myPikachu" almacen de la variable myPikachu
let myPikachu = document.querySelector("#myPikachu");

//id "searchInput" almacen de la variable searchInput
const searchInput = document.querySelector("#searchInput");

// id "searchButton" almacen de la variable searchButton
const searchButton = document.querySelector("#searchButton");

//id "pokemonContainer" almacen de la variable pokemonContainer
const pokemonContainer = document.querySelector("#pokemonContainer");

//-----------------------SECCION QUE EL TRAINER REALIZO -------------------------------
//agrega un eventListener al id para el click
// myPikachu.addEventListener("click", async () => {
//     try {
//         // solicitud de la API de Pokemon para obtener información de Pikachu
//         let res = await (await fetch("https://pokeapi.co/api/v2/pokemon/pikachu")).json();

//         // Obtiene la URL de la imagen frontal de Pikachu
//         let img = res.sprites.front_default;

//         // Muestra una ventana modal (usando SweetAlert2) con información de Pikachu
//         Swal.fire({
//             title: `${res.name}`, // muestra name pikachu
//             text: 'Modal with a custom image.',
//             imageUrl: `${(img) ? img : ''}`, // Muestra si la imagen de pikachu esta disponible
//             html: `
//                 ${res.stats.map(data => `
//                     <input 
//                         type="range"  
//                         value="${data.base_stat}">
//                     <label> 
//                         <b>${data.base_stat}</b> 
//                         ${data.stat.name}</label><br>
//                 `).join("")}   
//             `,
//             imageWidth: "80%",
//             imageHeight: "80%",
//         });
//     } catch (error) {
//         console.error(error);
//     }
// });

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

        // Verifica si se encontró el nombre especificado
        if (res && res.name) {
            // Crea un botón con el nombre del Pokémon
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
            pokemonContainer.appendChild(pokemonButton);
        } else {
            alert("Pokémon no encontrado.");
        }
    } catch (error) {
        console.error(error);
        alert("Parece que no se encuentra o esta mal escrito este nombre....");
    }
});
