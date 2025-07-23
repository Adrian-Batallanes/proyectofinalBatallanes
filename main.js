document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('contenedor-productos');
  const carritoModal = document.getElementById('modal-carrito');
  const verCarrito = document.getElementById('ver-carrito');
  const cerrarCarrito = document.getElementById('btn-cerrar');
  const carritoContenido = document.getElementById('carrito-contenido');
  const totalCarrito = document.getElementById('total-carrito');
  const contadorCarrito = document.getElementById('contador-carrito');
  const btnPagar = document.getElementById('btn-pagar');

  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  fetch('productos.json')
    .then(res => res.json())
    .then(productos => {
      productos.forEach(prod => {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
          <img src="${prod.imagen}" alt="${prod.nombre}">
          <h3>${prod.nombre}</h3>
          <p>$${prod.precio}</p>
          <button class="agregar" data-id="${prod.id}">Agregar</button>
        `;
        contenedor.appendChild(div);
      });

      contenedor.addEventListener('click', e => {
        if (e.target.classList.contains('agregar')) {
          const id = parseInt(e.target.dataset.id);
          const producto = productos.find(p => p.id === id);
          carrito.push(producto);
          actualizarCarrito();
          Toastify({ text: "Producto agregado", duration: 2000, gravity: "top", position: "right", style: { background: "#000" } }).showToast();
        }
      });
    });

  verCarrito.addEventListener('click', () => {
    carritoModal.classList.remove('hidden');
    mostrarCarrito();
  });

  cerrarCarrito.addEventListener('click', () => {
    carritoModal.classList.add('hidden');
  });

  btnPagar.addEventListener('click', () => {
    if (carrito.length === 0) {
      Swal.fire("Tu carrito está vacío");
      return;
    }
    Swal.fire({
      title: "¿Confirmás tu compra?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, pagar",
    }).then(result => {
      if (result.isConfirmed) {
        const msg = encodeURIComponent("Hola, quiero comprar estos productos: " + carrito.map(p => p.nombre).join(", "));
        window.open(`https://wa.me/?text=${msg}`, "_blank");
        carrito = [];
        actualizarCarrito();
        carritoModal.classList.add('hidden');
      }
    });
  });

  function mostrarCarrito() {
    carritoContenido.innerHTML = "";
    carrito.forEach((prod, index) => {
      const div = document.createElement('div');
      div.textContent = `${prod.nombre} - $${prod.precio}`;
      const btnEliminar = document.createElement('button');
      btnEliminar.textContent = "Eliminar";
      btnEliminar.addEventListener('click', () => {
        carrito.splice(index, 1);
        actualizarCarrito();
        mostrarCarrito();
      });
      div.appendChild(btnEliminar);
      carritoContenido.appendChild(div);
    });
    totalCarrito.textContent = carrito.reduce((acc, el) => acc + el.precio, 0);
  }

  function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    contadorCarrito.textContent = carrito.length;
  }

  actualizarCarrito();
});
