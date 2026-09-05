"use strict";

document.addEventListener("DOMContentLoaded", function () {
  setupMenu();
  setupConcepts();
  setupPackages();

  if (document.getElementById("news-list")) {
    loadNews();
  }
});

// Estos son los tres conceptos disponibles desde la página de inicio.
var heroConcepts = [
  {
    theme: "core",
    name: "BunkerG Core",
    image: "assets/img/bunkerg-core-hero.png?v=final-1",
    alt: "Escritorio BunkerG Core con monitor panorámico, torre iluminada y ambiente frío morado y cian"
  },
  {
    theme: "arena",
    name: "BunkerG Arena",
    image: "assets/img/bunkerg-arena-hero.png?v=final-1",
    alt: "Salón BunkerG Arena con sofá modular, iluminación ambiental, televisor gaming, lámpara Glowstone y sillón Cougar"
  },
  {
    theme: "creator",
    name: "BunkerG Creator",
    image: "assets/img/bunkerg-creator-hero.png?v=final-1",
    alt: "Estudio BunkerG Creator con doble monitor, cámara, micrófono, tableta gráfica y luz ambiental ámbar"
  }
];

var heroConceptIndex = 0;

function setupConcepts() {
  var previousButton = document.getElementById("concept-prev");
  var nextButton = document.getElementById("concept-next");

  if (!previousButton || !nextButton) return;

  previousButton.addEventListener("click", function () {
    showConcept(heroConceptIndex - 1, true);
  });

  nextButton.addEventListener("click", function () {
    showConcept(heroConceptIndex + 1, true);
  });
}

function showConcept(index, syncPackage) {
  var image = document.getElementById("concept-image");
  var conceptName = document.getElementById("concept-name");
  var counter = document.getElementById("concept-counter");
  var visual = document.querySelector(".hero-visual");

  if (!image || !conceptName || !counter || !visual) return;

  if (index < 0) index = heroConcepts.length - 1;
  if (index >= heroConcepts.length) index = 0;

  heroConceptIndex = index;
  var concept = heroConcepts[heroConceptIndex];

  image.classList.add("changing");
  image.src = concept.image;
  image.alt = concept.alt;
  conceptName.textContent = concept.name;
  counter.textContent = (heroConceptIndex + 1) + " / " + heroConcepts.length;
  visual.dataset.concept = concept.theme;
  visual.classList.toggle("theme-core", concept.theme === "core");
  visual.classList.toggle("theme-arena", concept.theme === "arena");
  visual.classList.toggle("theme-creator", concept.theme === "creator");

  window.setTimeout(function () {
    image.classList.remove("changing");
  }, 180);

  if (syncPackage) {
    selectPackage(concept.theme);
  }
}

function showConceptByTheme(theme) {
  heroConcepts.forEach(function (concept, index) {
    if (concept.theme === theme) {
      showConcept(index, false);
    }
  });
}

function selectPackage(theme) {
  document.querySelectorAll(".package-card").forEach(function (button) {
    var isSelected = button.dataset.theme === theme;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", isSelected ? "true" : "false");
  });
}

function setupMenu() {
  var menuButton = document.querySelector(".menu-toggle");
  var menu = document.querySelector(".main-nav");

  if (!menuButton || !menu) return;

  menuButton.addEventListener("click", function () {
    var isOpen = menu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", isOpen);
  });
}

function setupPackages() {
  var packageButtons = document.querySelectorAll(".package-card");

  packageButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      packageButtons.forEach(function (item) {
        item.classList.remove("selected");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("selected");
      button.setAttribute("aria-pressed", "true");
      showConceptByTheme(button.dataset.theme);
    });
  });
}

function loadNews() {
  // Las noticias se guardan fuera del HTML y se cargan con AJAX.
  var container = document.getElementById("news-list");
  var request = new XMLHttpRequest();

  request.open("GET", "data/news.json", true);

  request.onreadystatechange = function () {
    if (request.readyState !== 4) return;

    if (request.status === 200) {
      var news = JSON.parse(request.responseText);
      renderNews(news, container);
    } else {
      container.innerHTML = "<p class='loading-state'>No se pudieron cargar las noticias. Abre el proyecto con un servidor local.</p>";
    }
  };

  request.send();
}

function renderNews(news, container) {
  var markup = "";

  news.forEach(function (item) {
    markup += "<article class='news-item'>";
    markup += "<time datetime='" + item.dateIso + "'>" + item.dateLabel + "</time>";
    markup += "<div><h3>" + item.title + "</h3><p>" + item.summary + "</p></div>";
    markup += "</article>";
  });

  container.innerHTML = markup;
}

