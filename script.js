let mymap = L.map("mapid").setView([28.6139, 77.209], 12);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiZGl2eWFuc2gwMDciLCJhIjoiY2txMHRsM2p6MDhhMzJvcWludHh0ZGoybiJ9.rEs-aZdz5HxYuS-KWFE3Aw",
  }
).addTo(mymap);

let marker = L.marker([28.6139, 77.209]).addTo(mymap);
marker.bindPopup("<b>New Delhi</b><br>India").openPopup();
