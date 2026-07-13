const parametros = new URLSearchParams(window.location.search);
const peliculaId = Number(parametros.get('id'));
const funcionSeleccionada = parametros.get('funcion') || '';
const asientosSeleccionados = parametros.get('asientos') || '';
const cantidadEntradas = Number(parametros.get('cantidad'));
const totalCompra = Number(parametros.get('total'));
const API_PELICULA = 'datos/peliculas.json';

const resumenPedido = document.getElementById('resumen-pedido');
const formCompra = document.getElementById('form-compra');
const mensajeFormulario = document.getElementById('mensaje-formulario');

let peliculaActual = null;

async function cargarCompra() {
  if (!datosCompraValidos()) {
    mostrarError('Pedido incompleto', 'Vuelve a la cartelera y selecciona pelicula, funcion y asientos.');
    return;
  }

  try {
    const respuesta = await fetch(API_PELICULA);

    if (!respuesta.ok) {
      throw new Error('No se pudo obtener la pelicula');
    }

    const peliculas = await respuesta.json();
    peliculaActual = peliculas.find((p) => p.id === peliculaId);
    if (!peliculaActual) throw new Error('Pelicula no encontrada');
    mostrarResumen(peliculaActual);
  } catch (error) {
    mostrarError('Pedido incompleto', 'No se pudo cargar la informacion de la pelicula seleccionada.');
  }
}

function datosCompraValidos() {
  return peliculaId > 0 &&
    funcionSeleccionada !== '' &&
    asientosSeleccionados !== '' &&
    cantidadEntradas > 0 &&
    totalCompra > 0;
}

function mostrarResumen(pelicula) {
  resumenPedido.innerHTML = '';

  const contenedor = document.createElement('div');
  contenedor.className = 'resumen-contenido';

  const poster = document.createElement('img');
  poster.className = 'resumen-poster';
  poster.src = pelicula.poster;
  poster.alt = `Poster de ${pelicula.titulo}`;

  const detalle = document.createElement('div');
  detalle.className = 'resumen-detalle';

  const tituloResumen = document.createElement('h2');
  tituloResumen.textContent = 'Resumen de compra';

  detalle.appendChild(tituloResumen);
  detalle.appendChild(crearFilaResumen('Pelicula', pelicula.titulo));
  detalle.appendChild(crearFilaResumen('Funcion', funcionSeleccionada));
  detalle.appendChild(crearFilaResumen('Asientos', asientosSeleccionados));
  detalle.appendChild(crearFilaResumen('Cantidad de entradas', cantidadEntradas));
  detalle.appendChild(crearFilaResumen('Total a pagar', `Bs ${totalCompra}`));

  contenedor.appendChild(poster);
  contenedor.appendChild(detalle);
  resumenPedido.appendChild(contenedor);
}

function crearFilaResumen(etiqueta, valor) {
  const fila = document.createElement('p');
  const textoEtiqueta = document.createTextNode(`${etiqueta}: `);
  const textoValor = document.createElement('strong');

  textoValor.textContent = valor;
  fila.appendChild(textoEtiqueta);
  fila.appendChild(textoValor);

  return fila;
}

function mostrarError(titulo, texto) {
  resumenPedido.innerHTML = '';
  formCompra.classList.add('oculto');

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
  resumenPedido.appendChild(mensaje);
}

function validarFormulario(nombre, correo) {
  if (!peliculaActual) {
    return 'Espera a que se cargue el resumen de compra.';
  }

  if (nombre === '' || correo === '') {
    return 'Completa nombre y correo para finalizar la compra.';
  }

  if (!formCompra.checkValidity()) {
    return 'Ingresa un correo electronico valido.';
  }

  return '';
}

formCompra.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const error = validarFormulario(nombre, correo);

  if (error !== '') {
    mensajeFormulario.textContent = error;
    return;
  }

  const compra = {
    id: peliculaActual.id,
    titulo: peliculaActual.titulo,
    funcion: funcionSeleccionada,
    asientos: asientosSeleccionados,
    cantidad: cantidadEntradas,
    total: totalCompra,
    nombre,
    correo,
    telefono
  };

  localStorage.setItem('ultimaCompra', JSON.stringify(compra));

  const destino = new URL('confirmacion.html', window.location.href);

  window.location.href = destino.href;
});

cargarCompra();
