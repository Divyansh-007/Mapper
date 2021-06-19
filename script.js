// by default on start of application mapping to New Delhi
getMap("New Delhi", "India", 28.6139, 77.209);
// getDateAndTime();
getData(28.6139, 77.209);

// creating references
let searchButton = document.getElementById("search_btn");
var mymap;
var marker;

// popup for map
var popup = L.popup();

function onMapClick(e) {
  let lat = e.latlng.lat;
  let long = e.latlng.lng;

  let xhrRequest = new XMLHttpRequest();

  xhrRequest.onload = function () {
    let responseJSON = JSON.parse(xhrRequest.response);

    popup
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + responseJSON.poi.addr_full)
      .openOn(mymap);
  };

  xhrRequest.onerror = function () {
    console.log("Request Failed");
  };

  xhrRequest.open(
    "get",
    `https://geocode.xyz/${lat},${long}?json=1&auth=622698092329576449049x34543`,
    true
  );

  xhrRequest.send();
}

mymap.on("click", onMapClick);

// maping to the place specified and re-rendering all the data
searchButton.addEventListener("click", function () {
  let area = document.getElementById("city_name").value;
  let city = area.split(",")[0];
  let country = area.split(",")[1];

  // console.log(city + " " + country);

  let xhrRequest = new XMLHttpRequest();

  xhrRequest.onload = function () {
    let responseJSON = JSON.parse(xhrRequest.response);
    getMap(city, country, responseJSON.latt, responseJSON.longt);
    getData(responseJSON.latt, responseJSON.longt);
  };

  xhrRequest.onerror = function () {
    console.log("Request Failed");
  };

  xhrRequest.open(
    "get",
    `https://geocode.xyz/${city},${country}?json=1&auth=622698092329576449049x34543`,
    true
  );

  xhrRequest.send();
});

// map rendering function
function getMap(city, country, lat, long) {
  let coor = [lat, long];

  if (mymap instanceof L.Map) {
    mymap.panTo(coor, 12);
    marker = L.marker(coor).addTo(mymap);
    marker.bindPopup(`<b>${city}</b><br>${country}`).openPopup();
  } else {
    mymap = new L.map("mapid").setView(coor, 12);

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

    marker = L.marker(coor).addTo(mymap);
    marker.bindPopup(`<b>${city}</b><br>${country}`).openPopup();
  }
}

// function to prefix zeros for value < 10
function extraZeros(value) {
  return value < 10 ? "0" + value : value;
}

// function to find meridian according to hours
function getMeridian(value) {
  return value < 12 ? "AM" : "PM";
}

// function for converting date and time zones
function convertTZ(date, tzString) {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

// function to convert date in human readable format
function convertDate(value) {
  let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let date = new Date(value * 1000);

  return extraZeros(date.getDate()) + " " + months[date.getMonth()];
}

// additional data rendering function
function getData(lat, long) {
  let xhrRequest = new XMLHttpRequest();

  xhrRequest.onload = function () {
    let responseJSON = JSON.parse(xhrRequest.response);

    // temperature
    document.getElementById(
      "temp"
    ).innerHTML = `${responseJSON.current.temp} &#8451;`;

    // weather image
    document.getElementById(
      "weather_img"
    ).src = `http://openweathermap.org/img/wn/${responseJSON.current.weather[0].icon}@2x.png`;

    // weather description
    document.getElementById(
      "weather_description"
    ).innerText = `(${responseJSON.current.weather[0].main})`;

    // pressure
    document
      .getElementById("pressure")
      .setAttribute("title", `Pressure: ${responseJSON.current.pressure} hPA`);
    
    // humidity
    document
      .getElementById("humidity")
      .setAttribute("title", `Humidity: ${responseJSON.current.humidity} %`);

    // wind speed
    document
      .getElementById("wind")
      .setAttribute("title", `Winds: ${responseJSON.current.wind_speed} m/s`);

    // clouds
    document
      .getElementById("clouds")
      .setAttribute("title", `Cloudiness: ${responseJSON.current.clouds} %`);

    // date and time 
    let date = new Date(responseJSON.current.dt*1000);
    let correctDate = convertTZ(date,responseJSON.timezone);
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  
    let hrs = correctDate.getHours();
    let min = correctDate.getMinutes();
  
    if (hrs < 12) {
      hrs = hrs;
    } else {
      hrs = hrs - 12;
    }

    document.getElementById(
      "date"
    ).innerHTML = `<i class="far fa-calendar-alt"></i> ${correctDate.getDate()} ${
      months[correctDate.getMonth()]
    }, ${correctDate.getFullYear()}`;
  
    document.getElementById(
      "time"
    ).innerHTML = `<i class="far fa-clock"></i> ${extraZeros(hrs)} : ${extraZeros(
      min
    )} ${getMeridian(correctDate.getHours())}`;

    // forecast rendering
    let daily = responseJSON.daily;
    let html = "";
    document.getElementById("forecast").innerHTML = html;

    daily.forEach((day) => {
      html += `<div class="forecast_item">
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" />
                <p>(${day.weather[0].main})</p>
                <p>${convertDate(day.dt)}</p>
              </div>`;
    });

    document.getElementById("forecast").innerHTML = html;
  };

  xhrRequest.onerror = function () {
    console.log("Request Failed");
  };

  xhrRequest.open(
    "get",
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&units=metric&appid=1e899c74916c2762a82d4800a880e8ae`,
    true
  );

  xhrRequest.send();
}
