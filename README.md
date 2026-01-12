## 🌶️ PIMIENTA Y ORÉGANO (E-commerce Simulado)

> 🛍️ Proyecto final del curso de JavaScript de Coder House. Una simulación de plataforma de venta online que gestiona productos, carrito y persistencia de datos localmente.

---

### 🌐 Demo en Vivo

¡Mira el proyecto en acción!

🔗 **[Ver Sitio Publicado en GitHub Pages](https://nahueltrassani.github.io/Pimienta-Oregano/)**

---

### ⚠️ Instrucciones de Ejecución y Carga de Datos

Para garantizar la integridad del proyecto en diferentes entornos, se implementó una estrategia de **carga híbrida de datos**:

1.  **Modo Online (Recomendado):** Al ver el sitio en **GitHub Pages** o usando **Live Server**, los productos se cargan mediante una petición asíncrona (`fetch`) al archivo local JSON.
2.  **Modo Offline / Local:** Si se descarga el `.zip` y se abre el archivo `index.html` directamente (doble clic), los navegadores bloquean la petición `fetch` por políticas de seguridad (CORS).
    * **Solución implementada:** El código detecta este error automáticamente y carga un **array de respaldo (fallback)** interno. Esto asegura que la aplicación sea **100% funcional** sin importar cómo se ejecute.

---

### ✨ Características Destacadas

| Ícono | Característica | Descripción |
| :---: | :--- | :--- |
| 🛒 | **Gestión de Carrito** | Agrega, elimina y ajusta cantidades de productos de manera dinámica. |
| 🔢 | **Lógica de Precios** | Cálculos automáticos de subtotal, impuestos y total final. |
| 💾 | **Persistencia Local** | El carrito se mantiene guardado en el navegador (`localStorage`) entre sesiones. |
| 🛡️ | **Manejo de Errores** | Sistema de *fallback* para cargar datos incluso si falla el servidor o el `fetch`. |
| 📦 | **Simulación de Compra** | Flujo completo de checkout con validación de carrito vacío y formulario de datos. |

### 🔨 Stack Tecnológico

Este proyecto fue desarrollado utilizando herramientas fundamentales del desarrollo web:

* **HTML5:** Estructura semántica base.
* **CSS3:** Estilos limpios, modernos (Glassmorphism) y responsivos.
* **JavaScript (ES6+):** Motor de la aplicación, manejo de asincronía (`async/await`) y manipulación del DOM.
* **SweetAlert2:** Librería externa para notificaciones y feedback de usuario.

### 📁 Estructura del Repositorio

La organización del código sigue un patrón modular para separar la lógica de negocio y facilitar la lectura:

```text
/
├── css/
│   └── styles.css       # Estilos generales y diseño responsive
├── data/
│   └── productos.json   # Base de datos simulada para el fetch
├── js/
│   ├── productos.js     # Datos de respaldo y funciones de búsqueda
│   ├── carrito.js       # Lógica del carrito (agregar, borrar, calcular, storage)
│   └── main.js          # Inicialización, fetch de datos y renderizado del DOM
├── index.html           # Estructura principal
└── README.md            # Documentación del proyecto