"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // El mapa comienza en la ubicación del estudio BunkerG en Málaga.
  var destination = L.latLng(36.71963, -4.42029);
  var map = L.map("dynamic-map").setView(destination, 15);
  var routeControl = null;
  var status = document.getElementById("route-status");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  L.marker(destination).addTo(map)
    .bindPopup("<strong>BunkerG Studio</strong><br>Calle Marqués de Larios 24, Málaga")
    .openPopup();

  document.getElementById("calculate-route").addEventListener("click", function () {
    // La ubicación solo se solicita cuando la persona quiere calcular una ruta.
    if (!navigator.geolocation) {
      status.textContent = "Tu navegador no permite obtener la ubicación para calcular la ruta.";
      return;
    }

    status.textContent = "Buscando tu ubicación para calcular la ruta...";

    navigator.geolocation.getCurrentPosition(function (position) {
      var origin = L.latLng(position.coords.latitude, position.coords.longitude);

      if (routeControl) {
        map.removeControl(routeControl);
      }

      routeControl = L.Routing.control({
        waypoints: [origin, destination],
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        routeWhileDragging: false,
        show: false,
        createMarker: function (index, waypoint) {
          if (index === 0) return L.marker(waypoint.latLng).bindPopup("Tu ubicación");
          return L.marker(waypoint.latLng).bindPopup("BunkerG Studio");
        }
      }).addTo(map);

      status.textContent = "Ruta calculada desde tu ubicación hasta BunkerG Studio.";
    }, function () {
      status.textContent = "No se pudo obtener tu ubicación. Revisa los permisos del navegador e inténtalo de nuevo.";
    }, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  });
});

