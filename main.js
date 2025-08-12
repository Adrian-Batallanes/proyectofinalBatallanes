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
    .then(response => response.json())
    .then(productos => {
      productos.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}" />
          <h3>${producto.nombre}</h3>
          <p>$${producto.precio}</p>
          <button class="agregar" data-id="${producto.id}">Agregar</button>
        `;
        contenedor.appendChild(div);
      });

      contenedor.addEventListener('click', e => {
        if (e.target.classList.contains('agregar')) {
          const id = parseInt(e.target.dataset.id);
          const producto = productos.find(p => p.id === id);
          agregarAlCarrito(producto);
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
      Swal.fire('Tu carrito está vacío');
      return;
    }
    Swal.fire({
      title: '¿Confirmás tu compra?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, pagar',
    }).then(result => {
      if (result.isConfirmed) {
        const mensaje = carrito.map(p => `${p.nombre} x${p.cantidad}`).join(', ');
        const total = calcularTotal();
        const msg = encodeURIComponent(`Hola, quiero comprar estos productos: ${mensaje}. Total: $${total}`);
        window.open(`https://wa.me/?text=${msg}`, '_blank');
        carrito = [];
        actualizarCarrito();
        carritoModal.classList.add('hidden');
      }
    });
  });

  function agregarAlCarrito(producto) {
    const existe = carrito.find(p => p.id === producto.id);
    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({...producto, cantidad: 1});
    }
    actualizarCarrito();
    Toastify({
      text: `Agregaste ${producto.nombre}`,
      duration: 2000,
      gravity: 'top',
      position: 'right',
      style: {background: '#000'},
    }).showToast();
  }

  function mostrarCarrito() {
    carritoContenido.innerHTML = '';
    carrito.forEach((producto, index) => {
      const div = document.createElement('div');
      div.classList.add('item-carrito');
      div.innerHTML = `
        <span>${producto.nombre}</span>
        <span>Cantidad: ${producto.cantidad}</span>
        <span>Subtotal: $${producto.precio * producto.cantidad}</span>
        <button class="eliminar" data-index="${index}">Eliminar</button>
      `;
      carritoContenido.appendChild(div);
    });

  carritoContenido.querySelectorAll('.eliminar').forEach(btn => {
  btn.addEventListener('click', () => {
    const idx = parseInt(btn.dataset.index);
    carrito[idx].cantidad--;
    if (carrito[idx].cantidad === 0) {
      carrito.splice(idx, 1);
    }
    actualizarCarrito();
    mostrarCarrito();
  });
});


    totalCarrito.textContent = calcularTotal();
  }

  function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    contadorCarrito.textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  }

  function calcularTotal() {
    return carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  }

  actualizarCarrito();
});
