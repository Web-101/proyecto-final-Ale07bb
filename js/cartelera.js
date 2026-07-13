const API_PELICULAS = 'http://localhost:4317/api/peliculas';
const contenedorPeliculas = document.getElementById('contenedor-peliculas');

async function cargarPeliculas() {
  try {
    const respuesta = await fetch(API_PELICULAS);

    if (!respuesta.ok) {
      throw new Error('No se pudo obtener la cartelera');
    }

    const peliculas = await respuesta.json();
    mostrarPeliculas(peliculas);
  } catch (error) {
    contenedorPeliculas.innerHTML = '';
    contenedorPeliculas.appendChild(crearMensaje('No se pudo cargar la cartelera. Verifica que el backend este activo.'));
  }
}

function mostrarPeliculas(peliculas) {
  contenedorPeliculas.innerHTML = '';

  peliculas.forEach((pelicula) => {
    contenedorPeliculas.appendChild(crearTarjetaPelicula(pelicula));
  });
}

function crearTarjetaPelicula(pelicula) {
  const tarjeta = document.createElement('a');
  tarjeta.className = 'card-pelicula';
  tarjeta.href = `funciones.html?id=${pelicula.id}`;
  tarjeta.setAttribute('aria-label', `Ver funciones de ${pelicula.titulo}`);

  const poster = document.createElement('div');
  poster.className = 'card-poster';

  const imagen = document.createElement('img');
  imagen.className = 'poster-imagen';
  imagen.src = pelicula.poster;
  imagen.alt = `Poster de la pelicula ${pelicula.titulo}`;
  imagen.loading = 'lazy';

  poster.appendChild(imagen);

  if (pelicula.clasificacion) {
    const badge = document.createElement('div');
    badge.className = pelicula.clasificacion === 'TP' ? 'badge-todo-publico' : 'badge-restriccion';
    badge.textContent = pelicula.clasificacion;
    poster.appendChild(badge);
  }

  const info = document.createElement('div');
  info.className = 'card-info';

  const titulo = document.createElement('h2');
  titulo.className = 'card-titulo';
  titulo.textContent = pelicula.titulo;

  info.appendChild(titulo);

  if (pelicula.duracion) {
    const duracion = document.createElement('div');
    duracion.className = 'card-duracion';

    const punto = document.createElement('span');
    punto.className = 'punto-separador';

    duracion.appendChild(punto);
    duracion.append(pelicula.duracion);
    info.appendChild(duracion);
  }

  const accion = document.createElement('span');
  accion.className = 'btn-funciones';
  accion.textContent = 'VER FUNCIONES';

  tarjeta.appendChild(poster);
  tarjeta.appendChild(info);
  tarjeta.appendChild(accion);

  return tarjeta;
}

function crearMensaje(texto) {
  const mensaje = document.createElement('p');
  mensaje.className = 'mensaje-cartelera';
  mensaje.textContent = texto;
  return mensaje;
}

cargarPeliculas();
