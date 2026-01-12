// Archivo principal - Inicialización y eventos del DOM

// Variable para almacenar la categoría actual
let categoriaActual = "todos";

// Función para renderizar productos en el DOM
function renderizarProductos(categoria) {
  const grid = document.getElementById("productosGrid");
  const productosAMostrar = obtenerProductosPorCategoria(categoria);

  // Limpiar el grid
  grid.innerHTML = "";

  // Crear una card para cada producto
  productosAMostrar.forEach((producto) => {
    const card = document.createElement("div");
    card.className = "producto-card";

    card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            <div class="producto-categoria">${producto.categoria}</div>
            <div class="producto-nombre">${producto.nombre}</div>
            <div class="producto-descripcion">${producto.descripcion}</div>
            <div class="producto-precio">$${producto.precio}</div>
            <button class="btn-agregar" onclick="agregarProductoYMostrarFeedback(${producto.id})">
                Agregar al Carrito
            </button>
        `;

    grid.appendChild(card);
  });
}

// Función para agregar producto con feedback visual
function agregarProductoYMostrarFeedback(idProducto) {
  agregarAlCarrito(idProducto);

  // Feedback visual
  const badge = document.getElementById("cantidadCarrito");
  badge.style.transform = "scale(1.5)";
  setTimeout(() => {
    badge.style.transform = "scale(1)";
  }, 300);
}

// Función para cambiar de categoría
function cambiarCategoria(categoria) {
  categoriaActual = categoria;
  renderizarProductos(categoria);

  // Actualizar botones activos
  const botones = document.querySelectorAll(".btn-categoria");
  botones.forEach((boton) => {
    if (boton.dataset.categoria === categoria) {
      boton.classList.add("activo");
    } else {
      boton.classList.remove("activo");
    }
  });
}

// Función para abrir el modal del carrito
function abrirModal() {
  //warning con sweetalert
  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "El carrito está vacío",
      text: "Agrega algunos productos antes de continuar.",
      confirmButtonColor: "#667eea",
    });
    return;
  }

  const modal = document.getElementById("modalCarrito");
  modal.classList.add("activo");
  mostrarCarrito();
}

// Función para cerrar el modal
function cerrarModal() {
  const modal = document.getElementById("modalCarrito");
  modal.classList.remove("activo");
}

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", async function () {
  // Cargar productos desde el JSON
  await cargarProductos();
  // Renderizar productos iniciales
  renderizarProductos("todos");

  // Actualizar badge del carrito
  actualizarBadgeCarrito();

  // Event listeners para botones de categoría
  const botonesCategoria = document.querySelectorAll(".btn-categoria");
  botonesCategoria.forEach((boton) => {
    boton.addEventListener("click", function () {
      const categoria = this.dataset.categoria;
      cambiarCategoria(categoria);
    });
  });

  // Event listener para abrir carrito
  const btnCarrito = document.getElementById("btnCarrito");

  btnCarrito.addEventListener("click", abrirModal);

  // Event listener para cerrar modal
  const btnCerrar = document.getElementById("btnCerrar");
  btnCerrar.addEventListener("click", cerrarModal);

  // Cerrar modal al hacer click fuera
  const modal = document.getElementById("modalCarrito");
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      cerrarModal();
    }
  });
});
