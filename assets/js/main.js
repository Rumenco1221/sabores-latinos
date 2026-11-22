/* =========================================================
   Sabores Latinos — Menú filtrable, carrito y reservas
   ========================================================= */

// Los datos del menú viven en un array de objetos (como vendrían de una API)
const menu = [
  { id: 1, nombre: "Tacos al pastor", pais: "mx", precio: 4500, emoji: "🌮", desc: "Cerdo marinado, piña asada y cilantro.", color: "#FFE0A3" },
  { id: 2, nombre: "Guacamole y totopos", pais: "mx", precio: 3200, emoji: "🥑", desc: "Palta, lima, tomate y chile serrano.", color: "#C8F2D4" },
  { id: 3, nombre: "Arepa reina pepiada", pais: "ve", precio: 3900, emoji: "🫓", desc: "Pollo, palta y mayonesa casera.", color: "#FFD6E8" },
  { id: 4, nombre: "Tequeños", pais: "ve", precio: 2800, emoji: "🧀", desc: "Bastones de queso blanco en masa crocante.", color: "#FFF3B0" },
  { id: 5, nombre: "Empanadas salteñas", pais: "ar", precio: 3600, emoji: "🥟", desc: "Carne cortada a cuchillo, papa y huevo.", color: "#FFD3B0" },
  { id: 6, nombre: "Choripán", pais: "ar", precio: 4100, emoji: "🌭", desc: "Chorizo a la parrilla con chimichurri.", color: "#F9C4C4" },
  { id: 7, nombre: "Ceviche clásico", pais: "pe", precio: 5200, emoji: "🐟", desc: "Pescado blanco, leche de tigre y camote.", color: "#B8EEF0" },
  { id: 8, nombre: "Chicha morada", pais: "pe", precio: 1900, emoji: "🥤", desc: "Maíz morado, piña y canela.", color: "#E2CCFF" }
];

// El pedido es un objeto { idDelPlato: cantidad }
const pedido = {};

const formatoPrecio = n => n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

// ---------- Pintar el menú ----------
function pintarMenu(pais) {
  const visibles = menu.filter(p => pais === "todos" || p.pais === pais);
  document.getElementById("platos").innerHTML = visibles.map(p => `
    <article class="plato" style="--color:${p.color}">
      <div class="emoji" aria-hidden="true">${p.emoji}</div>
      <h3>${p.nombre}</h3>
      <p>${p.desc}</p>
      <div class="pie-plato">
        <span class="precio">${formatoPrecio(p.precio)}</span>
        <button class="agregar" data-id="${p.id}">Agregar</button>
      </div>
    </article>`).join("");
}

// ---------- Pestañas por país ----------
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => { t.classList.remove("activa"); t.setAttribute("aria-selected", "false"); });
    tab.classList.add("activa");
    tab.setAttribute("aria-selected", "true");
    pintarMenu(tab.dataset.pais);
  });
});

// ---------- Carrito ----------
// Delegación de eventos: un solo listener en el contenedor sirve para todos los botones
document.getElementById("platos").addEventListener("click", e => {
  const boton = e.target.closest(".agregar");
  if (!boton) return;
  const id = Number(boton.dataset.id);
  pedido[id] = (pedido[id] || 0) + 1;
  actualizarPedido();
  const btnCarrito = document.getElementById("abrirCarrito");
  btnCarrito.classList.remove("salto");
  void btnCarrito.offsetWidth; // truco para reiniciar la animación
  btnCarrito.classList.add("salto");
});

function actualizarPedido() {
  const ids = Object.keys(pedido);
  const cantidadTotal = ids.reduce((suma, id) => suma + pedido[id], 0);
  const total = ids.reduce((suma, id) => suma + pedido[id] * menu.find(p => p.id == id).precio, 0);

  document.getElementById("contador").textContent = cantidadTotal;
  document.getElementById("total").textContent = formatoPrecio(total);
  document.getElementById("listaPedido").innerHTML = ids.length
    ? ids.map(id => {
        const plato = menu.find(p => p.id == id);
        return `<li><span>${pedido[id]} × ${plato.nombre}</span><strong>${formatoPrecio(plato.precio * pedido[id])}</strong></li>`;
      }).join("")
    : `<li class="vacio">Todavía no agregaste platos. Elegí algo del menú.</li>`;
}

const panel = document.getElementById("panel");
document.getElementById("abrirCarrito").addEventListener("click", () => { panel.hidden = false; document.getElementById("cerrarCarrito").focus(); });
document.getElementById("cerrarCarrito").addEventListener("click", () => panel.hidden = true);
document.addEventListener("keydown", e => { if (e.key === "Escape") panel.hidden = true; });
document.getElementById("vaciar").addEventListener("click", () => {
  Object.keys(pedido).forEach(id => delete pedido[id]);
  actualizarPedido();
});

// ---------- Formulario de reserva con validación ----------
const form = document.getElementById("formReserva");
form.fecha.min = new Date().toISOString().split("T")[0]; // no se puede reservar en el pasado

form.addEventListener("submit", e => {
  e.preventDefault(); // evita que la página se recargue
  const mensaje = document.getElementById("mensajeReserva");
  let valido = true;
  [...form.elements].forEach(campo => {
    if (campo.tagName !== "INPUT") return;
    campo.classList.toggle("error", !campo.checkValidity());
    if (!campo.checkValidity()) valido = false;
  });
  if (!valido) {
    mensaje.textContent = "Revisá los campos marcados: falta completar o hay un dato fuera de rango.";
    return;
  }
  const fecha = new Date(form.fecha.value + "T12:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  mensaje.textContent = `¡Listo, ${form.nombre.value}! Mesa para ${form.personas.value} el ${fecha}.`;
  form.reset();
});

pintarMenu("todos");
actualizarPedido();
