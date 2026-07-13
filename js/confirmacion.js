const CLAVE_COMPRA = 'ultimaCompra';

const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');
const ticketVirtual = document.getElementById('ticket-virtual');

function obtenerCompraGuardada() {
  const datos = localStorage.getItem(CLAVE_COMPRA);

  if (!datos) {
    return null;
  }

  try {
    return JSON.parse(datos);
  } catch (error) {
    return null;
  }
}

function compraValida(compra) {
  return compra &&
    compra.nombre &&
    compra.correo &&
    compra.titulo &&
    compra.funcion &&
    compra.asientos &&
    Number(compra.cantidad) > 0 &&
    Number(compra.total) > 0;
}

function generarCodigoCompra() {
  const numero = Math.floor(100000 + Math.random() * 900000);
  return `CINE-${numero}`;
}

function crearFilaTicket(etiqueta, valor) {
  const fila = document.createElement('p');
  const nombreCampo = document.createElement('span');
  const datoCampo = document.createElement('strong');

  nombreCampo.textContent = etiqueta;
  datoCampo.textContent = valor;

  fila.appendChild(nombreCampo);
  fila.appendChild(datoCampo);

  return fila;
}

function mostrarError() {
  mensajeConfirmacion.innerHTML = '';
  ticketVirtual.innerHTML = '';
  ticketVirtual.classList.add('oculto');

  const mensaje = document.createElement('div');
  mensaje.className = 'mensaje-error';

  const titulo = document.createElement('h2');
  titulo.textContent = 'No se pudo generar la entrada';

  const texto = document.createElement('p');
  texto.textContent = 'Faltan datos de la compra. Vuelve a la cartelera e intenta nuevamente.';

  mensaje.appendChild(titulo);
  mensaje.appendChild(texto);
  mensajeConfirmacion.appendChild(mensaje);
}

function mostrarConfirmacion(compra) {
  const codigoCompra = compra.codigo || generarCodigoCompra();
  compra.codigo = codigoCompra;
  localStorage.setItem(CLAVE_COMPRA, JSON.stringify(compra));

  mensajeConfirmacion.innerHTML = '';
  ticketVirtual.innerHTML = '';
  ticketVirtual.classList.remove('oculto');

  const titulo = document.createElement('h2');
  titulo.textContent = `Compra confirmada, ${compra.nombre}.`;

  const texto = document.createElement('p');
  texto.textContent = 'Presenta este ticket virtual al ingresar a la sala.';

  mensajeConfirmacion.appendChild(titulo);
  mensajeConfirmacion.appendChild(texto);

  const encabezado = document.createElement('div');
  encabezado.className = 'ticket-header';

  const marca = document.createElement('span');
  marca.textContent = 'CINESTAR';

  const tipo = document.createElement('strong');
  tipo.textContent = 'Ticket virtual';

  encabezado.appendChild(marca);
  encabezado.appendChild(tipo);

  ticketVirtual.appendChild(encabezado);
  ticketVirtual.appendChild(crearFilaTicket('Codigo', codigoCompra));
  ticketVirtual.appendChild(crearFilaTicket('Comprador', compra.nombre));
  ticketVirtual.appendChild(crearFilaTicket('Correo', compra.correo));
  ticketVirtual.appendChild(crearFilaTicket('Pelicula', compra.titulo));
  ticketVirtual.appendChild(crearFilaTicket('Funcion', compra.funcion));
  ticketVirtual.appendChild(crearFilaTicket('Asientos', compra.asientos));
  ticketVirtual.appendChild(crearFilaTicket('Cantidad', compra.cantidad));
  ticketVirtual.appendChild(crearFilaTicket('Total pagado', `Bs ${compra.total}`));
}

const compra = obtenerCompraGuardada();

if (compraValida(compra)) {
  mostrarConfirmacion(compra);
} else {
  mostrarError();
}
