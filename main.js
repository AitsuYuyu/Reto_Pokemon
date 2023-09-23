// Selecciona el elemento HTML con el id "myPikachu" y lo almacena en la variable myPikachu
let myPikachu = document.querySelector("#myPikachu");

// Selecciona el elemento HTML con el id "searchInput" y lo almacena en la variable searchInput
const searchInput = document.querySelector("#searchInput");

// Selecciona el elemento HTML con el id "searchButton" y lo almacena en la variable searchButton
const searchButton = document.querySelector("#searchButton");

// Selecciona el elemento HTML con el id "pokemonContainer" y lo almacena en la variable pokemonContainer
const pokemonContainer = document.querySelector("#pokemonContainer");

// Agrega un event listener al elemento con id "myPikachu" para el evento de clic
myPikachu.addEventListener("click", async () => {
    try {
        // Realiza una solicitud a la API de Pokemon para obtener información de Pikachu
        let res = await (await fetch("https://pokeapi.co/api/v2/pokemon/pikachu")).json();

        // Obtiene la URL de la imagen frontal de Pikachu
        let img = res.sprites.front_default;

        // Muestra una ventana modal (usando SweetAlert2) con información de Pikachu
        Swal.fire({
            title: `${res.name}`, // Muestra el nombre de Pikachu
            text: 'Modal with a custom image.',
            imageUrl: `${(img) ? img : ''}`, // Muestra la imagen de Pikachu si está disponible
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
    } catch (error) {
        console.error(error);
    }
});

// Agrega un event listener al elemento con id "searchButton" para el evento de clic
searchButton.addEventListener("click", async () => {
    // Obtiene el valor del campo de entrada de búsqueda y lo convierte en minúsculas sin espacios en blanco al principio o al final
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    // Verifica si el campo de búsqueda está vacío
    if (searchTerm === "") {
        alert("Ingrese un nombre de Pokémon válido.");
        return;
    }
    
    try {
        // Realiza una solicitud a la API de Pokemon utilizando el término de búsqueda
        const res = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`)).json();

        // Verifica si se encontró un Pokémon con el nombre especificado
        if (res && res.name) {
            // Crea un botón con el nombre del Pokémon
            const pokemonButton = document.createElement("button");
            pokemonButton.textContent = res.name;
            
            // Agrega un event listener al botón del Pokémon para mostrar una ventana modal con su información
            pokemonButton.addEventListener("click", () => {
                Swal.fire({
                    title: `${res.name}`, // Muestra el nombre del Pokémon
                    text: 'Modal with a custom image.',
                    imageUrl: res.sprites.front_default || '', // Muestra la imagen del Pokémon si está disponible
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
