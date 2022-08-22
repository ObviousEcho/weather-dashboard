// global var's
var apiKey = "842e73dda78b17a825098fd7bd7e267e";
var submitForm = document.getElementById("search-input");
var searchHistory = [];
var forecastData = [];
var ul = document.getElementById("list");

getLocalStorage();
appendHistory();

// write a function to make an API call for a specific city, which returns data
// function should submit city input from form into API endpoint
// function should add city to search history
// ===========================================================================
function getApi(event) {
  event.preventDefault();
  var responseData = [];
  var inputField = document.getElementById("input-field");
  var cityInput = inputField.value;
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityInput +
    "&appid=" +
    apiKey +
    "&units=imperial";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      responseData.push(data);
      sendToLocalStorage(responseData);
      deleteThenAppendHistory(responseData);

      var city = responseData[0].name;
      var date = responseData[0].dt;
      var icon = responseData[0].weather[0].icon;
      var temp = responseData[0].main.temp;
      var wind = responseData[0].wind.speed;
      var humid = responseData[0].main.humidity;

      createCurrentCard(city, date, icon, temp, wind, humid);
    });
  fiveDayForecast(cityInput);
  inputField.value = "";
}

// write a function witch fetches forecast data for search city
function fiveDayForecast(city) {
  var forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    apiKey +
    "&units=imperial";

  fetch(forecastUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // forecastData.push(data.list);
      forecastData = data.list;
      fiveDayAppend(forecastData);
    });
}

// write a function which removes child nodes from history list, and then
// calls function to append local storage to history list
// this prevents prevents history list from double appending
function deleteThenAppendHistory(arr) {
  while (ul.hasChildNodes()) {
    ul.removeChild(ul.firstChild);
  }
  appendHistory();
}

// write a function which dislpays current conditoins for that city
// dynamically display city name, date, an icon, temp, humidity, wind and uv index
// uv index to be color coded
// ===========================================================================
function createCurrentCard(city, date, icon, temp, wind, humid) {
  var dashboard = document.getElementById("dashboard");
  var iconImg = document.createElement("img");
  var span = document.createElement("span");
  var cityName = document.createElement("h2");
  var temperature = document.createElement("p");
  var windSpeed = document.createElement("p");
  var humidity = document.createElement("p");

  var miliseconds = date * 1000;
  var dateObject = new Date(miliseconds);
  var formattedDate = dateObject.toLocaleDateString();

  var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";

  dashboard.style.border = "solid black 2px";

  if (dashboard !== null) {
    while (dashboard.hasChildNodes()) {
      dashboard.removeChild(dashboard.firstChild);
    }
  }

  iconImg.setAttribute("src", iconUrl);
  span.appendChild(iconImg);

  cityName.textContent = city + " (" + formattedDate + ") ";
  cityName.appendChild(span);
  // include unicode character for degree symbol
  temperature.textContent = "Temp: " + temp + "\u00B0 F";
  windSpeed.textContent = "Wind: " + wind + " MPH";
  humidity.textContent = "Humidity: " + humid + "%";

  dashboard.appendChild(cityName);
  dashboard.appendChild(temperature);
  dashboard.appendChild(windSpeed);
  dashboard.appendChild(humidity);
}

// write function which dynamically displays the 5 day forcast, date, an icon,
// temp, wind speed, and humidity
// ===========================================================================
function fiveDayAppend(data) {
  var fiveDayArray = [];
  for (i = 0; i < data.length; i++) {
    // console.log(data[i]);

    var miliseconds = data[i].dt * 1000;
    var dateObject = new Date(miliseconds);
    var formattedDate = dateObject.toLocaleDateString();
    var icon = data[i].weather[0].icon;
    var temperature = data[i].main.temp;
    var wind = data[i].wind.speed;
    var humid = data[i].main.humidity;

    var forecast = {
      date: formattedDate,
      icon: icon,
      temp: temperature,
      wind: wind,
      humidity: humid,
    };

    fiveDayArray.push(forecast);
  }
  var removeValFromIndex = [
    1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23,
    25, 26, 27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38, 39,
  ];

  for (var i of removeValFromIndex.reverse()) {
    fiveDayArray.splice(i, 1);
  }
  fiveDayToDOM(fiveDayArray);
}

// write function which appends 5 day forecast data to DOM
function fiveDayToDOM(data) {
  var fiveDayDiv = document.getElementById("five-day");
  console.log(data);

  if (fiveDayDiv !== null) {
    while (fiveDayDiv.hasChildNodes()) {
      fiveDayDiv.removeChild(fiveDayDiv.firstChild);
    }
  }

  for (i = 0; i < data.length; i++) {
    var iconUrl = "http://openweathermap.org/img/w/" + data[i].icon + ".png";
    var div = document.createElement("div");
    var date = document.createElement("h4");
    var icon = document.createElement("img");
    var temp = document.createElement("p");
    var wind = document.createElement("p");
    var humid = document.createElement("p");

    div.setAttribute("class", "forecast-box p-3");

    date.textContent = data[i].date;
    icon.setAttribute("src", iconUrl);
    temp.textContent = "Temp: " + data[i].temp + "\u00B0 F";
    wind.textContent = "Wind: " + data[i].wind + " MPH";
    humid.textContent = "Humidity: " + data[i].humidity + " %";

    div.appendChild(date);
    div.appendChild(icon);
    div.appendChild(temp);
    div.appendChild(wind);
    div.appendChild(humid);
    fiveDayDiv.appendChild(div);
  }
}

// write function which displays current forcast for cities from search history
// ===========================================================================
function appendCityToCurrent(event) {
  var btnClicked = event.target;
  var btnText = btnClicked.textContent;
  console.log(btnText);
  console.log(searchHistory);
  for (i = 0; i < searchHistory.length; i++) {
    var city = searchHistory[i].city;
    var date = searchHistory[i].date;
    var icon = searchHistory[i].icon;
    var temp = searchHistory[i].temp;
    var wind = searchHistory[i].wind;
    var humid = searchHistory[i].humidity;
    if (btnText === city) {
      createCurrentCard(city, date, icon, temp, wind, humid);
    }
  }
  fiveDayForecast(btnText);
}

// write function which accesses local storage if it exists
// ===========================================================================
function getLocalStorage() {
  var history = JSON.parse(localStorage.getItem("searchHistory"));
  if (history !== null) {
    searchHistory = history;
  }
}

// write function which stores search history to local storage
// ===========================================================================
function sendToLocalStorage(arr) {
  var obj = arr[0];
  var cityData = {
    city: obj.name,
    date: obj.dt,
    icon: obj.weather[0].icon,
    temp: obj.main.temp,
    humidity: obj.main.humidity,
    wind: obj.wind.speed,
    // uv: uv
  };
  searchHistory.push(cityData);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// write function which dynamically displays search history
// ===========================================================================
function appendHistory() {
  if (searchHistory !== null) {
    for (i = 0; i < searchHistory.length; i++) {
      var listItem = document.createElement("button");
      listItem.textContent = searchHistory[i].city;
      listItem.setAttribute("type", "button");
      listItem.setAttribute("class", "btn btn-secondary my-2");
      listItem.setAttribute("id", `button-${[i]}`);
      ul.appendChild(listItem);
    }
  }
}

// create event delegation listener for search history button which displays
// forcast for clicked city
ul.addEventListener("click", appendCityToCurrent);

// create an event listener for submit button
// ===========================================================================
submitForm.addEventListener("submit", getApi);
