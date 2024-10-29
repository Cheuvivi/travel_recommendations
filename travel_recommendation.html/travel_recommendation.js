// travel_recommendation.js

// Definir las palabras clave aceptadas
const keywords = {
    beach: ["beach", "beaches"],
    temple: ["temple", "temples"],
    country: ["country", "countries"]
};

// Función para cargar recomendaciones
function loadRecommendations() {
    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Convertir la respuesta en JSON
        })
        .then(data => {
            console.log(data); // Mostrar datos en la consola
            displayRecommendations(data); // Llamar a la función para mostrar recomendaciones
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Función para mostrar recomendaciones en la página
function displayRecommendations(recommendations) {
    const recommendationsContainer = document.getElementById('recommendations'); // Contenedor existente en el HTML
    recommendationsContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas recomendaciones

    for (const category in recommendations) {
        recommendations[category].forEach(rec => {
            const recElement = document.createElement('div');
            recElement.className = 'recommendation';

            const img = document.createElement('img');
            img.src = rec.imageUrl; // Enlace a la imagen
            img.alt = rec.name;

            const title = document.createElement('h3');
            title.textContent = rec.name;

            const description = document.createElement('p');
            description.textContent = rec.description;

            recElement.appendChild(img); // Agregar imagen
            recElement.appendChild(title); // Agregar título
            recElement.appendChild(description); // Agregar descripción

            recommendationsContainer.appendChild(recElement); // Agregar recomendación al contenedor
        });
    }
}

// Función para comprobar si el término de búsqueda coincide con las palabras clave
function isKeywordMatch(input) {
    const lowerCaseInput = input.toLowerCase();
    return Object.values(keywords).some(variations =>
        variations.includes(lowerCaseInput)
    );
}

// Funcionalidad del botón de búsqueda
document.getElementById('searchBtn').onclick = function() {
    const query = document.getElementById('search').value; // Obtener el valor de búsqueda
    console.log('Searching for: ' + query);

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            // Filtrar recomendaciones basadas en la búsqueda
            const filteredRecommendations = [];

            // Filtrar por categorías
            if (isKeywordMatch(query)) {
                // Si hay una coincidencia, agrega las recomendaciones
                Object.keys(data).forEach(category => {
                    const results = data[category].filter(rec => 
                        rec.name.toLowerCase().includes(query.toLowerCase()) ||
                        rec.description.toLowerCase().includes(query.toLowerCase())
                    );

                    filteredRecommendations.push(...results);
                });
            }

            displayRecommendations({ filtered: filteredRecommendations }); // Mostrar recomendaciones filtradas
        })
        .catch(error => {
            console.error('Error fetching recommendations:', error);
        });
};

// Funcionalidad del botón de reinicio
document.getElementById('resetBtn').onclick = function() {
    document.getElementById('search').value = ''; // Limpia la barra de búsqueda
    loadRecommendations(); // Volver a cargar todas las recomendaciones
    alert('Search results cleared');
};

// Llamar a la función para cargar recomendaciones inicialmente
loadRecommendations();
