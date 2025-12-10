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

  if (carrito.length === 0) {
    contenedor.innerHTML = `
            <div class="carrito-vacio">
                <p style="font-size: 3em;">🛒</p>
                <p>Tu carrito está vacío</p>
                <p>¡Agrega productos para comenzar!</p>
            </div>
        `;
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

  if (carrito.length === 0) {
    const mensaje = document.getElementById("mensajeExito");
    mensaje.textContent = "⚠️ El carrito está vacío";
    mensaje.style.backgroundColor = "#ff6b6b";
    mensaje.classList.add("mostrar");
    setTimeout(() => {
      mensaje.classList.remove("mostrar");
      mensaje.style.backgroundColor = "";
      mensaje.textContent =
        "¡Compra realizada con éxito! Gracias por tu pedido.";
    }, 2000);
    return;
  }

  // Mostrar mensaje de éxito
  const mensaje = document.getElementById("mensajeExito");
  mensaje.classList.add("mostrar");

  // Vaciar el carrito
  vaciarCarrito();

  // Actualizar la vista
  setTimeout(() => {
    mostrarCarrito();
    mensaje.classList.remove("mostrar");
  }, 2000);
}
