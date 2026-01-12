// Gestión del carrito de compras

// Función para obtener el carrito desde localStorage
function obtenerCarrito() {
  const carritoGuardado = localStorage.getItem("carrito");
  return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

// Función para guardar el carrito en localStorage
function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para agregar producto al carrito
function agregarAlCarrito(idProducto) {
  const producto = obtenerProductoPorId(idProducto);
  if (!producto) return;

  let carrito = obtenerCarrito();

  // Verificar si el producto ya está en el carrito
  const indiceExistente = carrito.findIndex((item) => item.id === idProducto);

  if (indiceExistente !== -1) {
    // Si existe, aumentar la cantidad
    carrito[indiceExistente].cantidad++;
  } else {
    // Si no existe, agregarlo con cantidad 1
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1,
    });
  }

  guardarCarrito(carrito);
  actualizarBadgeCarrito();
}

// Función para modificar cantidad de un producto
function modificarCantidad(idProducto, cambio) {
  let carrito = obtenerCarrito();
  const indice = carrito.findIndex((item) => item.id === idProducto);

  if (indice !== -1) {
    carrito[indice].cantidad += cambio;

    // Si la cantidad llega a 0, eliminar el producto
    if (carrito[indice].cantidad <= 0) {
      carrito.splice(indice, 1);
    }

    guardarCarrito(carrito);
    mostrarCarrito();
    actualizarBadgeCarrito();
  }
}

// Función para eliminar producto del carrito
function eliminarDelCarrito(idProducto) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter((item) => item.id !== idProducto);
  guardarCarrito(carrito);
  mostrarCarrito();
  actualizarBadgeCarrito();
}

// Función para calcular el total del carrito
function calcularTotal() {
  const carrito = obtenerCarrito();
  return carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );
}

// Función para obtener cantidad total de productos
function obtenerCantidadTotal() {
  const carrito = obtenerCarrito();
  return carrito.reduce((total, item) => total + item.cantidad, 0);
}

// Función para vaciar el carrito
function vaciarCarrito() {
  localStorage.removeItem("carrito");
  actualizarBadgeCarrito();
}

// Función para actualizar el badge del carrito
function actualizarBadgeCarrito() {
  const badge = document.getElementById("cantidadCarrito");
  if (badge) {
    badge.textContent = obtenerCantidadTotal();
  }
}

// Función para mostrar el contenido del carrito en el modal
function mostrarCarrito() {
  const contenedor = document.getElementById("carritoContenido");
  const carrito = obtenerCarrito();

  //cerrar modal si carrito vacio, avisando con un sweetalert
  if (carrito.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Se eliminaron todos los productos del carrito",
      text: "Vuelva a agregar algunos productos antes de continuar.",
      confirmButtonColor: "#667eea",
    });
    cerrarModal();
    return;
  }

  let html = "";

  // Generar HTML para cada item del carrito
  carrito.forEach((item) => {
    html += `
            <div class="carrito-item">
                <img src="${item.imagen}" alt="${item.nombre}" class="carrito-item-imagen">
                <div class="item-info">
                    <div class="item-nombre">${item.nombre}</div>
                    <div class="item-precio">$${item.precio}</div>
                </div>
                <div class="item-controles">
                    <button class="btn-cantidad" onclick="modificarCantidad(${item.id}, -1)">−</button>
                    <span class="cantidad">${item.cantidad}</span>
                    <button class="btn-cantidad" onclick="modificarCantidad(${item.id}, 1)">+</button>
                    <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})">🗑️</button>
                </div>
            </div>
        `;
  });

  // Agregar el total
  const total = calcularTotal();
  html += `
        <div class="carrito-total">
            <div class="total-text">Total:</div>
            <div class="total-monto">$${total}</div>
        </div>
        <button class="btn-finalizar" onclick="finalizarCompra()">Finalizar Compra</button>
    `;

  contenedor.innerHTML = html;
}

// Función para finalizar la compra
function finalizarCompra() {
  const carrito = obtenerCarrito();

  //boton confirmar oculto por carrito vacio, no hace falta validar.
  //warning con sweetalert
  if (carrito.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "El carrito está vacío",
      text: "Agrega algunos productos antes de finalizar.",
      confirmButtonColor: "#667eea",
    });
    return;
  }

  // Mostrar formulario de checkout
  const contenedor = document.getElementById("carritoContenido");

  contenedor.innerHTML = `
    <div class="checkout-form">
        <h3>📦 Datos de Envío</h3>
        <p>Ingresa tus datos para finalizar el pedido.</p>
        
        <form id="formCheckout" style="display: flex; flex-direction: column; gap: 15px; margin-top: 20px;">
            <input type="text" id="nombre" placeholder="Nombre Completo" value="Jhon Doe" required style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
            <input type="email" id="email" placeholder="Correo Electrónico" value="correo@electronico.com" required style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
            <input type="tel" id="telefono" placeholder="Teléfono" value="123456789" required style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
            <input type="text" id="direccion" placeholder="Dirección" value="Calle siempre viva 123" required style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
            
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button type="button" onclick="mostrarCarrito()" class="btn-agregar" style="background-color: #718096;">Volver al carrito</button>
                <button type="submit" class="btn-finalizar">Confirmar Compra</button>
            </div>
        </form>
    </div>
  `;

  // Asignar el evento submit al form
  document
    .getElementById("formCheckout")
    .addEventListener("submit", procesarPedido);
}

function procesarPedido(e) {
  e.preventDefault(); // Evita recarga de página
  const nombre = document.getElementById("nombre").value;

  // Simula espera de servidor
  Swal.fire({
    title: "Procesando pago...",
    text: "Aguarde un instante",
    icon: "info",
    allowOutsideClick: false,
    showConfirmButton: false,
    timer: 2000,
    willClose: () => {
      // Al terminar el timer: Mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "¡Compra Exitosa!",
        text: `Gracias ${nombre}, tu pedido está en camino.`,
        confirmButtonColor: "#38ef7d",
      }).then(() => {
        // Limpieza final
        vaciarCarrito();
        cerrarModal();
      });
    },
  });
}
