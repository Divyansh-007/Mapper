getMap("New Delhi","India",28.6139, 77.209);

getDateAndTime();

getData(28.6139, 77.209);

function getMap(city,country,lat,long){
  let coor = [lat,long];
  console.log(coor);
  let mymap = L.map("mapid").setView(coor, 12);

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

let marker = L.marker(coor).addTo(mymap);
marker.bindPopup(`<b>${city}</b><br>${country}`).openPopup();
}

function extraZeros(value){
  return value < 10 ? "0" + value : value;
}

function getMeridian(value){
  return value < 12 ? "AM" : "PM";
}

function getDateAndTime(){
  let date = new Date();
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let hrs = date.getHours();
  let min = date.getMinutes();
  if(hrs < 12){
    hrs = hrs;
  }else{
    hrs = hrs - 12;
  }

  document.getElementById('date').innerHTML = `<i class="far fa-calendar-alt"></i> ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  document.getElementById('time').innerHTML = `<i class="far fa-clock"></i> ${extraZeros(hrs)} : ${extraZeros(min)} ${getMeridian(date.getHours())}`;
}

function convertDate(value){
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let date = new Date(value*1000);

  return extraZeros(date.getDate()) + " " + months[date.getMonth()];
}

function getData(lat,long){
  let xhrRequest = new XMLHttpRequest();

  xhrRequest.onload = function () {
    let responseJSON = JSON.parse(xhrRequest.response);
    console.log(responseJSON);

    document.getElementById('temp').innerHTML = `${responseJSON.current.temp} &#8451;`;
    document.getElementById('weather_img').src = `http://openweathermap.org/img/wn/${responseJSON.current.weather[0].icon}@2x.png`;
    document.getElementById('weather_description').innerText = `(${responseJSON.current.weather[0].main})`;
    document.getElementById('pressure').setAttribute('title',`Pressure: ${responseJSON.current.pressure} hPA`);
    document.getElementById('humidity').setAttribute('title',`Humidity: ${responseJSON.current.humidity} %`);
    document.getElementById('wind').setAttribute('title',`Winds: ${responseJSON.current.wind_speed} m/s`);
    document.getElementById('clouds').setAttribute('title',`Cloudiness: ${responseJSON.current.clouds} %`);

    let daily = responseJSON.daily;
    console.log(daily);
    let html = "";
    document.getElementById('forecast').innerHTML = html;

    daily.forEach((day) =>{
      html += `<div class="forecast_item">
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" />
                <p>(${day.weather[0].main})</p>
                <p>${convertDate(day.dt)}</p>
              </div>`;
    });

    document.getElementById('forecast').innerHTML = html;
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