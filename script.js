// -------------------- Firebase Modular SDK --------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBx_OnE3Eju46i2LCHDAUBg-Y-ZupdKIf8",
  authDomain: "zonemarkerapp.firebaseapp.com",
  projectId: "zonemarkerapp",
  storageBucket: "zonemarkerapp.firebasestorage.app",
  messagingSenderId: "613702079615",
  appId: "1:613702079615:web:8c99d82debc2a1897fdb4a"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// -------------------- Map Setup --------------------
let map = L.map('map').setView([36.75, 3.05], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

let drawControl = new L.Control.Draw({
  draw: {
    polygon: true,
    rectangle: false,
    circle: false,
    polyline: false,
    marker: false,
    circlemarker: false
  },
  edit: { featureGroup: drawnItems }
});
map.addControl(drawControl);

// -------------------- Globals --------------------
let bigZones = [];
let newZoneLayer = null;
let addStoreMode = false;
let storeTemp = { lat: null, lng: null };

// -------------------- Load Communes --------------------
fetch("algiers_communes.geojson")
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
        radius: 6,
        color: "gray",
        fillOpacity: 0.5
      }),
      onEachFeature: (feature, layer) => {
        const name = feature.properties.name || "Unnamed";
        const ar_name = feature.properties.ar_name || "";
        layer.bindPopup(`<strong>${name}</strong><br>${ar_name}`);
        bigZones.push({ id: name, layer: layer, latlng: layer.getLatLng() });

        const option = document.createElement("option");
        option.value = name;
        option.text = name;
        document.getElementById("communeSelector").appendChild(option);
      }
    }).addTo(map);
  });

// -------------------- Highlight Selection --------------------
function highlightMunicipality(name) {
  bigZones.forEach(z => {
    z.layer.setStyle({
      fillOpacity: z.id === name ? 0.8 : 0.2,
      color: z.id === name ? "blue" : "gray"
    });
  });
}

// -------------------- Draw Zones --------------------
map.on(L.Draw.Event.CREATED, function (e) {
  newZoneLayer = e.layer;
  document.getElementById("statusPopup").style.display = "flex";
});

function selectStatus(status) {
  const coords = newZoneLayer.getLatLngs()[0].map(p => ({ lat: p.lat, lng: p.lng }));
  const parent = getParentZone(coords);
  const color = {
    "completed": "#4caf50",
    "pending": "#ff9800",
    "not reached": "#f44336"
  }[status.toLowerCase()] || "gray";

  newZoneLayer.setStyle({ color, fillOpacity: 0.4 });
  drawnItems.addLayer(newZoneLayer);

  addDoc(collection(db, "zones"), {
    status,
    path: coords,
    parent
  });

  document.getElementById("statusPopup").style.display = "none";
}

function getParentZone(latlngs) {
  const bounds = L.polygon(latlngs).getBounds();
  for (let z of bigZones) {
    if (bounds.contains(z.latlng)) return z.id;
  }
  return "Unassigned";
}

function startSmallZone() {
  drawControl._toolbars.draw._modes.polygon.handler.enable();
}

// -------------------- Store Adding --------------------
function activateAddStore() {
  addStoreMode = true;
  alert("Click on the map to place the store");
}

map.on("click", function (e) {
  if (!addStoreMode) return;
  addStoreMode = false;
  storeTemp.lat = e.latlng.lat;
  storeTemp.lng = e.latlng.lng;
  document.getElementById("storePopup").style.display = "flex";
});

function saveStore() {
  const name = document.getElementById("storeName").value;
  const id = document.getElementById("retailerId").value;
  const type = document.getElementById("storeCategory").value;

  addDoc(collection(db, "stores"), {
    ...storeTemp,
    name,
    retailerId: id,
    type
  });

  document.getElementById("storePopup").style.display = "none";
}

// -------------------- Button Handlers --------------------
document.getElementById("btnSmallZone").addEventListener("click", startSmallZone);
document.getElementById("btnAddStore").addEventListener("click", activateAddStore);
document.getElementById("communeSelector").addEventListener("change", (e) => {
  highlightMunicipality(e.target.value);
});
document.querySelectorAll("#statusPopup button").forEach(btn => {
  btn.addEventListener("click", () => selectStatus(btn.textContent.toLowerCase()));
});

// -------------------- Expose Globals for HTML --------------------
window.selectStatus = selectStatus;
window.saveStore = saveStore;
window.highlightMunicipality = highlightMunicipality;
