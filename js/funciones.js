const parametros = new URLSearchParams(window.location.search);
const peliculaId = Number(parametros.get('id'));
const API_PELICULA = `http://localhost:4317/api/peliculas/${peliculaId}`;

const detallePelicula = document.getElementById('detalle-pelicula');
const listaHorarios = document.getElementById('lista-horarios');

async function cargarPelicula() {
  if (!peliculaId) {
    mostrarError('Pelicula no encontrada', 'Vuelve a la cartelera y selecciona una pelicula disponible.');
    return;
  }

  try {
    const respuesta = await fetch(API_PELICULA);

    if (!respuesta.ok) {
      throw new Error('No se pudo obtener la pelicula');
    }

    const pelicula = await respuesta.json();
    mostrarDetallePelicula(pelicula);
    mostrarFunciones(pelicula);
  } catch (error) {
    mostrarError('Pelicula no encontrada', 'No se pudo cargar la informacion de la pelicula seleccionada.');
  }
}

function mostrarDetallePelicula(pelicula) {
  detallePelicula.innerHTML = '';

  const poster = document.createElement('div');
  poster.className = 'detalle-poster';

  const imagen = document.createElement('img');
  imagen.src = pelicula.poster;
  imagen.alt = `Poster de ${pelicula.titulo}`;

  poster.appendChild(imagen);

  const info = document.createElement('div');
  info.className = 'detalle-info';

  const clasificacion = document.createElement('span');
  clasificacion.className = 'etiqueta-clasificacion';
  clasificacion.textContent = pelicula.clasificacion;

  const titulo = document.createElement('h2');
  titulo.textContent = pelicula.titulo;

  const duracion = document.createElement('p');
  duracion.className = 'detalle-meta';
  duracion.textContent = pelicula.duracion;

  const sinopsis = document.createElement('p');
  sinopsis.className = 'detalle-sinopsis';
  sinopsis.textContent = pelicula.sinopsis;

  info.appendChild(clasificacion);
  info.appendChild(titulo);
  info.appendChild(duracion);
  info.appendChild(sinopsis);

  detallePelicula.appendChild(poster);
  detallePelicula.appendChild(info);
}

function mostrarFunciones(pelicula) {
  listaHorarios.innerHTML = '';

  pelicula.funciones.forEach((funcion) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'btn-horario';
    boton.textContent = funcion.hora;

    boton.addEventListener('click', () => {
      const url = `asientos.html?id=${pelicula.id}&funcion=${encodeURIComponent(funcion.hora)}`;
      window.location.href = url;
    });

    listaHorarios.appendChild(boton);
  });
}

function mostrarError(titulo, texto) {
  detallePelicula.innerHTML = '';
  listaHorarios.innerHTML = '';

  const mensaje = document.createElement('div');
  mensaje.className = 'mensaje-error';

  const encabezado = document.createElement('h2');
  encabezado.textContent = titulo;

  const parrafo = document.createElement('p');
  parrafo.textContent = texto;

  const enlace = document.createElement('a');
  enlace.href = 'index.html';
  enlace.className = 'btn-primario';
  enlace.textContent = 'Volver a cartelera';

  mensaje.appendChild(encabezado);
  mensaje.appendChild(parrafo);
  mensaje.appendChild(enlace);
  detallePelicula.appendChild(mensaje);
}

cargarPelicula();
