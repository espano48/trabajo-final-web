"use strict";

// Cada espacio tiene extras distintos porque sus necesidades no son las mismas.
var extrasByPackage = {
  Core: [
    { name: "Iluminación LED RGB", price: 120 },
    { name: "Aislamiento acústico", price: 250 },
    { name: "Soporte para monitores", price: 80 },
    { name: "Gestión de cables", price: 60 }
  ],
  Arena: [
    { name: "Iluminación ambiental para salón", price: 160 },
    { name: "Barra de sonido y sonido envolvente", price: 280 },
    { name: "Mueble multimedia para consola", price: 360 },
    { name: "Estación de carga para mandos", price: 90 }
  ],
  Creator: [
    { name: "Iluminación de estudio regulable", price: 220 },
    { name: "Brazo para micrófono y cámara", price: 140 },
    { name: "Paneles acústicos para grabación", price: 310 },
    { name: "Soporte para tableta gráfica", price: 110 }
  ]
};

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("budget-form");

  form.addEventListener("change", function (event) {
    if (!event.target.matches("input[type='number'], input[type='checkbox'], input[type='radio']")) {
      return;
    }

    if (event.target.name === "package") {
      renderExtras();
    }

    calculateBudget();
  });

  form.addEventListener("submit", validateForm);
  document.getElementById("delivery-days").addEventListener("input", calculateBudget);
  renderExtras();
  calculateBudget();
});

function formatPrice(amount) {
  return amount.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  });
}

function renderExtras() {
  var selectedPackage = document.querySelector("input[name='package']:checked");
  var container = document.getElementById("extra-options");
  var extras = extrasByPackage[selectedPackage.dataset.name];

  container.innerHTML = "";

  extras.forEach(function (extra, index) {
    var label = document.createElement("label");
    var checkbox = document.createElement("input");
    var name = document.createElement("span");
    var price = document.createElement("b");

    checkbox.type = "checkbox";
    checkbox.name = "extra-" + (index + 1);
    checkbox.dataset.role = "extra";
    checkbox.value = extra.price;
    checkbox.dataset.name = extra.name;
    name.textContent = extra.name;
    price.textContent = "+" + extra.price + " €";

    label.appendChild(checkbox);
    label.appendChild(name);
    label.appendChild(price);
    container.appendChild(label);
  });
}

function calculateBudget() {
  // El resumen se actualiza al momento, sin botón ni recarga de página.
  var selectedPackage = document.querySelector("input[name='package']:checked");
  var basePrice = Number(selectedPackage.value);
  var selectedExtras = document.querySelectorAll("input[data-role='extra']:checked");
  var deliveryField = document.getElementById("delivery-days");
  var days = Number(deliveryField.value);
  var discount = calculateDiscount(days);
  var extrasTotal = 0;

  selectedExtras.forEach(function (extra) {
    extrasTotal += Number(extra.value);
  });

  var total = (basePrice + extrasTotal) * (1 - discount);
  var extrasList = document.getElementById("summary-extras");

  document.getElementById("summary-package").textContent = selectedPackage.dataset.name;
  document.getElementById("summary-package-price").textContent = formatPrice(basePrice);
  document.getElementById("summary-delivery").textContent = buildDeliverySummary(days, discount);
  document.getElementById("total-price").textContent = formatPrice(total);
  extrasList.innerHTML = "";

  if (!selectedExtras.length) {
    extrasList.innerHTML = "<li>Ninguno</li>";
    return;
  }

  selectedExtras.forEach(function (extra) {
    var item = document.createElement("li");
    item.textContent = extra.dataset.name + " · " + formatPrice(Number(extra.value));
    extrasList.appendChild(item);
  });
}

function calculateDiscount(days) {
  if (days > 45) return 0.10;
  if (days > 30) return 0.05;
  return 0;
}

function buildDeliverySummary(days, discount) {
  if (!Number.isFinite(days) || days < 7 || days > 90) {
    return "Indica un plazo entre 7 y 90 días";
  }

  if (discount === 0) return days + " días · sin descuento";
  return days + " días · -" + (discount * 100) + " %";
}

function validateForm(event) {
  // Los datos de contacto se comprueban aquí antes de preparar la solicitud.
  event.preventDefault();
  var message = document.getElementById("form-errors");
  var firstName = document.getElementById("first-name").value.trim();
  var lastName = document.getElementById("last-name").value.trim();
  var phone = document.getElementById("phone").value.trim();
  var email = document.getElementById("email").value.trim();
  var city = document.getElementById("city").value.trim();
  var days = Number(document.getElementById("delivery-days").value);
  var privacyAccepted = document.getElementById("privacy-consent").checked;
  var errors = [];

  if (!isValidText(firstName, 15)) errors.push("El nombre debe contener solo letras y un máximo de 15 caracteres.");
  if (!isValidText(lastName, 40)) errors.push("Los apellidos deben contener solo letras y un máximo de 40 caracteres.");
  if (!/^\d{1,9}$/.test(phone)) errors.push("El teléfono debe contener solo números y un máximo de 9 cifras.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push("Escribe un correo electrónico válido.");
  if (!city) errors.push("Indica tu localidad.");
  if (!Number.isInteger(days) || days < 7 || days > 90) errors.push("El plazo debe ser un número entero entre 7 y 90 días.");
  if (!privacyAccepted) errors.push("Debes aceptar la política de privacidad.");

  if (errors.length) {
    message.textContent = errors.join(" ");
    return;
  }

  message.textContent = "";
  alert("Solicitud preparada correctamente. En la versión final se conectará el envío.");
}

function isValidText(text, maximumLength) {
  return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(text) && text.length > 0 && text.length <= maximumLength;
}

