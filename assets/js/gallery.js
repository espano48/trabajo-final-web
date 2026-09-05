"use strict";

// Estos datos se vuelven a mostrar al seleccionar un filtro de la galería.
var projects = [
  { number: 1, name: "Core Compact", category: "core", description: "Setup individual en una habitación pequeña." },
  { number: 2, name: "Core Night", category: "core", description: "Iluminación fría y escritorio despejado." },
  { number: 3, name: "Arena Duo", category: "arena", description: "Zona de juego preparada para dos personas." },
  { number: 4, name: "Arena Lounge", category: "arena", description: "Salón social con consola y pantalla principal." },
  { number: 5, name: "Creator Stream", category: "creator", description: "Estudio de streaming con iluminación controlada." },
  { number: 6, name: "Creator Focus", category: "creator", description: "Zona híbrida para edición, estudio y creación." }
];

document.addEventListener("DOMContentLoaded", function () {
  var filters = document.querySelectorAll(".filter");

  renderProjects("all");

  filters.forEach(function (filter) {
    filter.addEventListener("click", function () {
      filters.forEach(function (button) { button.classList.remove("active"); });
      filter.classList.add("active");
      renderProjects(filter.dataset.filter);
    });
  });
});

function renderProjects(category) {
  var container = document.getElementById("projects-gallery");
  var selection = projects.filter(function (project) {
    return category === "all" || project.category === category;
  });

  container.innerHTML = selection.map(function (project) {
    return "<article class='project-card " + project.category + "'>" +
      "<div class='project-visual'><span class='project-number'>" + String(project.number).padStart(2, "0") + "</span></div>" +
      "<div class='project-content'><small>" + project.category + "</small><h3>" + project.name + "</h3><p>" + project.description + "</p></div>" +
      "</article>";
  }).join("");
}

