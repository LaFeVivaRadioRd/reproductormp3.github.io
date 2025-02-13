const reproductor = document.querySelector('.reproductor-musica');
const tituloCancion = document.querySelector('.reproductor-musica h1');
const nombreArtista = document.querySelector('.reproductor-musica p');

const progreso = document.getElementById('progreso');
const cancion = document.getElementById('cancion');

const inconoControl = document.getElementById('iconoControl');
const botonReproducirPausar = document.querySelector('.controles button.boton-reproducir-pausar');

const botonAtras = document.querySelector('.controles button.atras');
const botonAdelante = document.querySelector('.controles button.adelante');

// Array para almacenar las canciones cargadas
let canciones = [];
let indiceCancionActual = 0;

// Crear la lista de reproducción visual
const listaReproduccion = document.createElement('ul');
listaReproduccion.style.listStyleType = 'none';
listaReproduccion.style.padding = '0';
reproductor.appendChild(listaReproduccion);

// Agregar el botón para cargar MP3
const botonCargarMP3 = document.createElement('button');
botonCargarMP3.textContent = 'Cargar MP3';
botonCargarMP3.style.backgroundColor = '#87CEEB'; // Azul cielo
botonCargarMP3.style.border = 'none';
botonCargarMP3.style.padding = '10px 20px';
botonCargarMP3.style.color = 'white';
botonCargarMP3.style.cursor = 'pointer';
botonCargarMP3.style.marginTop = '20px'; // Añadido para separarlo un poco de los controles

// Añadir el botón dentro del reproductor
reproductor.appendChild(botonCargarMP3);

// Crear un input invisible para seleccionar archivos
const inputArchivo = document.createElement('input');
inputArchivo.type = 'file';
inputArchivo.accept = 'audio/mp3';
inputArchivo.style.display = 'none';

// Añadir el input al DOM
document.body.appendChild(inputArchivo);

// Función para manejar la carga del archivo
botonCargarMP3.addEventListener('click', function() {
    inputArchivo.click();
});

// Manejar la selección del archivo
inputArchivo.addEventListener('change', function() {
    const archivo = inputArchivo.files[0];
    if (archivo) {
        const url = URL.createObjectURL(archivo);
        canciones.push({
            titulo: archivo.name,
            nombre: 'Reproductor GenAp', // Puedes cambiar esto según el caso
            fuente: url
        });
        agregarCancionALaLista(archivo.name);
        if (canciones.length === 1) {
            indiceCancionActual = 0; // Comenzar con la primera canción cargada
            actualizarInfoCancion();
            reproducirCancion();
        }
    }
});

function agregarCancionALaLista(titulo) {
    const item = document.createElement('li');
    item.textContent = titulo;
    item.style.cursor = 'pointer';
    item.style.padding = '5px';
    item.style.marginBottom = '5px';

    // Botón para eliminar la canción individual
    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.style.backgroundColor = 'red';
    botonEliminar.style.color = 'white';
    botonEliminar.style.border = 'none';
    botonEliminar.style.cursor = 'pointer';
    botonEliminar.style.marginLeft = '10px';

    botonEliminar.addEventListener('click', function() {
        eliminarCancion(titulo);
    });

    item.appendChild(botonEliminar);
    item.addEventListener('click', function() {
        indiceCancionActual = canciones.findIndex(c => c.titulo === titulo);
        actualizarInfoCancion();
        reproducirCancion();
    });

    listaReproduccion.appendChild(item);
}

function eliminarCancion(titulo) {
    const indice = canciones.findIndex(c => c.titulo === titulo);
    if (indice !== -1) {
        canciones.splice(indice, 1); // Eliminar la canción del array
        listaReproduccion.children[indice].remove(); // Eliminarla de la lista visual
        // Si la canción eliminada era la actual, reproducir la siguiente
        if (indice === indiceCancionActual) {
            indiceCancionActual = (indiceCancionActual + 1) % canciones.length;
            actualizarInfoCancion();
            reproducirCancion();
        }
    }
}

function actualizarInfoCancion() {
    if (canciones.length > 0) {
        tituloCancion.textContent = canciones[indiceCancionActual].titulo;
        nombreArtista.textContent = canciones[indiceCancionActual].nombre;
        cancion.src = canciones[indiceCancionActual].fuente;
        cancion.addEventListener('loadeddata', function() {});
    }
}

cancion.addEventListener('loadedmetadata', function() {
    progreso.max = cancion.duration;
    progreso.value = cancion.currentTime;
});

botonReproducirPausar.addEventListener('click', reproducirPausar);

function reproducirPausar() {
    if (cancion.paused) {
        reproducirCancion();
    } else {
        pausarCancion();
    }
}

function reproducirCancion() {
    cancion.play();
    inconoControl.classList.add('bi-pause-fill');
    inconoControl.classList.remove('bi-play-fill');
}

function pausarCancion() {
    cancion.pause();
    inconoControl.classList.remove('bi-pause-fill');
    inconoControl.classList.add('bi-play-fill');
}

cancion.addEventListener('timeupdate', function() {
    if (!cancion.paused) {
        progreso.value = cancion.currentTime;
    }
});

progreso.addEventListener('input', function() {
    cancion.currentTime = progreso.value;
});

botonAdelante.addEventListener('click', function() {
    indiceCancionActual = (indiceCancionActual + 1) % canciones.length;
    actualizarInfoCancion();
    reproducirCancion();
});

botonAtras.addEventListener('click', function() {
    indiceCancionActual = (indiceCancionActual - 1 + canciones.length) % canciones.length;
    actualizarInfoCancion();
    reproducirCancion();
});

cancion.addEventListener('ended', function() {
    indiceCancionActual = (indiceCancionActual + 1) % canciones.length;
    actualizarInfoCancion();
    reproducirCancion();
});

actualizarInfoCancion();

// Añadir copyright centrado al final
const copyright = document.createElement('div');
copyright.textContent = '© 2025 Lubudesign. Todos los derechos reservados.';
copyright.style.textAlign = 'center';
copyright.style.marginTop = '20px';
copyright.style.fontSize = '14px';
copyright.style.color = '#87CEEB';
reproductor.appendChild(copyright);
