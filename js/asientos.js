const PRECIO_ASIENTO = 20;
const FILAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const COLUMNAS = 8;

const parametros = new URLSearchParams(window.location.search);
const peliculaId = Number(parametros.get('id'));
const horaFuncion = parametros.get('funcion') || '';
const API_PELICULA = 'datos/peliculas.json';

const resumenFuncion = document.getElementById('resumen-funcion');
const tituloSala = document.getElementById('titulo-sala');
const gridAsientos = document.getElementById('grid-asientos');
const asientosSeleccionados = document.getElementById('asientos-seleccionados');
const cantidadAsientos = document.getElementById('cantidad-asientos');
const totalPagar = document.getElementById('total-pagar');
const btnContinuar = document.getElementById('btn-continuar');

const seleccionados = [];

async function cargarFuncion() {
  if (!peliculaId || !horaFuncion) {
    mostrarError('Funcion no encontrada', 'Vuelve a la cartelera y selecciona una funcion disponible.');
    return;
  }

  try {
    const respuesta = await fetch(API_PELICULA);

    if (!respuesta.ok) {
      throw new Error('No se pudo obtener la pelicula');
    }

    const peliculas = await respuesta.json();
    const pelicula = peliculas.find((p) => p.id === peliculaId);
    if (!pelicula) throw new Error('Pelicula no encontrada');
    const funcion = pelicula.funciones.find((item) => item.hora === horaFuncion);

    if (!funcion) {
      mostrarError('Funcion no encontrada', 'El horario seleccionado no esta disponible para esta pelicula.');
      return;
    }

    mostrarResumen(pelicula, funcion);
    generarAsientos(funcion.asientosOcupados || []);
    actualizarResumenCompra();
  } catch (error) {
    mostrarError('Funcion no encontrada', 'No se pudo cargar la informacion de la funcion seleccionada.');
  }
}

function mostrarResumen(pelicula, funcion) {
  resumenFuncion.innerHTML = '';
  tituloSala.textContent = funcion.sala || 'Sala 1';

  const titulo = document.createElement('h2');
  titulo.textContent = pelicula.titulo;

  const horario = document.createElement('p');
  horario.innerHTML = `Funcion: <strong>${funcion.hora}</strong>`;

  const sala = document.createElement('p');
  sala.innerHTML = `Sala: <strong>${funcion.sala}</strong>`;

  const precio = document.createElement('p');
  precio.innerHTML = `Precio por asiento: <strong>Bs ${PRECIO_ASIENTO}</strong>`;

  resumenFuncion.appendChild(titulo);
  resumenFuncion.appendChild(horario);
  resumenFuncion.appendChild(sala);
  resumenFuncion.appendChild(precio);
}

function generarAsientos(asientosOcupados) {
  gridAsientos.innerHTML = '';

  FILAS.forEach((fila) => {
    for (let numero = 1; numero <= COLUMNAS; numero++) {
      const codigo = `${fila}${numero}`;
      const asiento = crearBotonAsiento(codigo, asientosOcupados);
      gridAsientos.appendChild(asiento);
    }
  });
}

function crearBotonAsiento(codigo, asientosOcupados) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'asiento';
  boton.textContent = codigo;
  boton.dataset.codigo = codigo;

  if (asientosOcupados.includes(codigo)) {
    boton.classList.add('asiento-ocupado');
    boton.disabled = true;
    boton.setAttribute('aria-label', `Asiento ${codigo} ocupado`);
    return boton;
  }

  boton.classList.add('asiento-disponible');
  boton.setAttribute('aria-label', `Asiento ${codigo} disponible`);
  boton.addEventListener('click', () => cambiarSeleccion(codigo, boton));

  return boton;
}

function cambiarSeleccion(codigo, boton) {
  const posicion = seleccionados.indexOf(codigo);

  if (posicion === -1) {
    seleccionados.push(codigo);
    boton.classList.add('asiento-seleccionado');
    boton.setAttribute('aria-label', `Asiento ${codigo} seleccionado`);
  } else {
    seleccionados.splice(posicion, 1);
    boton.classList.remove('asiento-seleccionado');
    boton.setAttribute('aria-label', `Asiento ${codigo} disponible`);
  }

  actualizarResumenCompra();
}

function actualizarResumenCompra() {
  const cantidad = seleccionados.length;
  const total = cantidad * PRECIO_ASIENTO;

  asientosSeleccionados.textContent = cantidad > 0 ? seleccionados.join(', ') : 'Ninguno';
  cantidadAsientos.textContent = cantidad;
  totalPagar.textContent = `Bs ${total}`;

  if (cantidad > 0) {
    const asientosUrl = encodeURIComponent(seleccionados.join(','));
    btnContinuar.href = `compra.html?id=${peliculaId}&funcion=${encodeURIComponent(horaFuncion)}&asientos=${asientosUrl}&cantidad=${cantidad}&total=${total}`;
    btnContinuar.classList.remove('btn-deshabilitado');
  } else {
    btnContinuar.href = '#';
    btnContinuar.classList.add('btn-deshabilitado');
  }
}

function mostrarError(titulo, texto) {
  resumenFuncion.innerHTML = '';
  gridAsientos.innerHTML = '';
  btnContinuar.href = '#';
  btnContinuar.classList.add('btn-deshabilitado');

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
  resumenFuncion.appendChild(mensaje);
}

cargarFuncion();
