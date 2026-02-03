const tienda = {
  almacenes: ["Norte", "Sur", "Este", "Oeste", "Central"],
  proveedores: ["Distribuidora Global", "Tecno-Abasto MX"],
  productos: [
    { id: 101, nombre: "Laptop Pro", stock: [10, 5, 2, 8, 15], precio: 15000, min: 10 },
    { id: 102, nombre: "Mouse Óptico", stock: [50, 20, 10, 30, 40], precio: 350, min: 30 },
    { id: 103, nombre: "Teclado Mecánico", stock: [8, 6, 4, 12, 14], precio: 1200, min: 12 },
    { id: 104, nombre: "Monitor 24\"", stock: [6, 3, 2, 7, 9], precio: 3200, min: 8 }
  ]
};

function showSection(section) {
  if (section === "inventario") renderInventario();
  if (section === "ventas") renderVentas();
  if (section === "compras") renderCompras();
  if (section === "reportes") generarInformeEstado();
}

function renderInventario() {
  let html = `<h2 class="section-title">Estado General de Almacenes</h2>
    <table class="table">
      <tr>
        <th>Producto</th>
        ${tienda.almacenes.map((a) => `<th>${a}</th>`).join("")}
        <th>Total</th>
      </tr>`;

  tienda.productos.forEach((p) => {
    const total = p.stock.reduce((a, b) => a + b, 0);
    html += `<tr>
      <td>${p.nombre}</td>
      ${p.stock.map((s) => `<td>${s}</td>`).join("")}
      <td>${total}</td>
    </tr>`;
  });

  html += `</table>`;
  document.getElementById("content").innerHTML = html;
}

function renderVentas() {
  const productosOptions = tienda.productos
    .map((p) => `<option value="${p.id}">${p.nombre}</option>`)
    .join("");
  const almacenesOptions = tienda.almacenes
    .map((a, i) => `<option value="${i}">${a}</option>`)
    .join("");

  const html = `
    <h2 class="section-title">Ventas</h2>
    <div class="card">
      <div class="controls">
        <select id="venta-producto">${productosOptions}</select>
        <select id="venta-almacen">${almacenesOptions}</select>
        <input id="venta-cantidad" type="number" min="1" placeholder="Cantidad" />
        <button onclick="handleVenta()">Registrar venta</button>
      </div>
      <p>Se descuenta stock del almacén seleccionado.</p>
    </div>
  `;

  document.getElementById("content").innerHTML = html;
}

function renderCompras() {
  const productosOptions = tienda.productos
    .map((p) => `<option value="${p.id}">${p.nombre}</option>`)
    .join("");
  const almacenesOptions = tienda.almacenes
    .map((a, i) => `<option value="${i}">${a}</option>`)
    .join("");

  const html = `
    <h2 class="section-title">Compras</h2>
    <div class="card">
      <div class="controls">
        <select id="compra-producto">${productosOptions}</select>
        <select id="compra-almacen">${almacenesOptions}</select>
        <input id="compra-cantidad" type="number" min="1" placeholder="Cantidad" />
        <button onclick="handleCompra()">Registrar compra</button>
      </div>
      <p>Se aumenta stock en el almacén seleccionado.</p>
    </div>
  `;

  document.getElementById("content").innerHTML = html;
}

function handleVenta() {
  const productoId = parseInt(document.getElementById("venta-producto").value, 10);
  const almacenIdx = parseInt(document.getElementById("venta-almacen").value, 10);
  const cantidad = parseInt(document.getElementById("venta-cantidad").value, 10);

  if (!cantidad || cantidad <= 0) {
    alert("Ingrese una cantidad válida.");
    return;
  }

  realizarVenta(productoId, cantidad, almacenIdx);
}

function handleCompra() {
  const productoId = parseInt(document.getElementById("compra-producto").value, 10);
  const almacenIdx = parseInt(document.getElementById("compra-almacen").value, 10);
  const cantidad = parseInt(document.getElementById("compra-cantidad").value, 10);

  if (!cantidad || cantidad <= 0) {
    alert("Ingrese una cantidad válida.");
    return;
  }

  realizarCompra(productoId, cantidad, almacenIdx);
}

function realizarVenta(productoId, cantidad, almacenIdx) {
  const p = tienda.productos.find((prod) => prod.id === productoId);
  if (p.stock[almacenIdx] >= cantidad) {
    p.stock[almacenIdx] -= cantidad;
    alert("Venta realizada");
    renderInventario();
  } else {
    alert("Stock insuficiente en este almacén");
  }
}

function realizarCompra(productoId, cantidad, almacenIdx) {
  const p = tienda.productos.find((prod) => prod.id === productoId);
  p.stock[almacenIdx] += parseInt(cantidad, 10);
  alert("Stock actualizado");
  renderInventario();
}

function generarInformeEstado() {
  let html = `<h2 class="section-title">Alertas de Reabastecimiento</h2>`;

  tienda.productos.forEach((p) => {
    const total = p.stock.reduce((a, b) => a + b, 0);
    if (total <= p.min) {
      html += `
        <div class="card" style="border-left: 5px solid red;">
          <p><strong>${p.nombre}</strong> está bajo el mínimo (${p.min}).</p>
          <button onclick="prepararOrden(${p.id})">Generar Orden de Compra</button>
        </div>
      `;
    }
  });

  if (html.trim() === `<h2 class=\"section-title\">Alertas de Reabastecimiento</h2>`) {
    html += `<div class="card"><p>No hay productos bajo mínimo.</p></div>`;
  }

  document.getElementById("content").innerHTML = html;
}

function prepararOrden(id) {
  const p = tienda.productos.find((prod) => prod.id === id);
  document.getElementById("orden-compra-container").style.display = "block";
  document.getElementById("folio-orden").textContent = `OC-${Math.floor(Math.random() * 1000)}`;
  document.getElementById("fecha-orden").textContent = new Date().toLocaleDateString();
  document.getElementById("detalle-orden").innerHTML = `
    <p>Solicitamos a <strong>${tienda.proveedores[0]}</strong> la cantidad de
    <strong>${p.min * 2}</strong> unidades de <strong>${p.nombre}</strong>
    para Almacén Central.</p>
  `;
}

window.addEventListener("load", () => {
  renderInventario();
});
