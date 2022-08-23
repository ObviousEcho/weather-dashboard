// global var's
var apiKey = "842e73dda78b17a825098fd7bd7e267e";
var redirectUrl = "./404.html";
var submitForm = document.getElementById("search-input");
var searchHistory = [];
var forecastData = [];
var ul = document.getElementById("list");

// get and display search history to DOM
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
  // url for current weather conditions
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityInput +
    "&appid=" +
    apiKey +
    "&units=imperial";

  fetch(requestUrl)
    .then(function (response) {
      // if response other than 200, display error page
      if (response.status !== 200) {
        document.location.replace(redirectUrl);
      } else {
        return response.json();
      }
    })
    .then(function (data) {
      responseData.push(data);
      // function call stores city/response to local storage
      sendToLocalStorage(responseData);
      // function call deletes current weather info and appends new info when a new city is selected
      deleteThenAppendHistory(responseData);

      // var's to pass into createCurrentCard function
      var city = responseData[0].name;
      var date = responseData[0].dt;
      var icon = responseData[0].weather[0].icon;
      var temp = responseData[0].main.temp;
      var wind = responseData[0].wind.speed;
      var humid = responseData[0].main.humidity;
      // function dynamically creates card to display data from http request
      createCurrentCard(city, date, icon, temp, wind, humid);
    });
  // function call makes seperate http request for 5 day forecast
  fiveDayForecast(cityInput);
  // clears search bar after submit
  inputField.value = "";
}

// write a function witch fetches forecast data for search city
// ====================================================================
function fiveDayForecast(city) {
  // url for 5 day forecast
  var forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    apiKey +
    "&units=imperial";

  fetch(forecastUrl)
    .then(function (response) {
      // if response other than 200, display error page
      if (response.status !== 200) {
        document.location.replace(redirectUrl);
      } else {
        return response.json();
      }
    })
    .then(function (data) {
      // parse 5 day forecast results into array
      forecastData = data.list;
      fiveDayAppend(forecastData);
    });
}

// write a function which removes child nodes from history list, and then
// calls function to append local storage to history list
// this prevents prevents history list from double appending
// ===========================================================================
function deleteThenAppendHistory(arr) {
  while (ul.hasChildNodes()) {
    ul.removeChild(ul.firstChild);
  }
  appendHistory();
}

// write a function which dislpays current conditions for that city
// dynamically display city name, date, an icon, temp, humidity, and wind
// ===========================================================================
function createCurrentCard(city, date, icon, temp, wind, humid) {
  // crate elements
  var dashboard = document.getElementById("dashboard");
  var iconImg = document.createElement("img");
  var span = document.createElement("span");
  var cityName = document.createElement("h2");
  var temperature = document.createElement("p");
  var windSpeed = document.createElement("p");
  var humidity = document.createElement("p");
  // convert date (unix time) from response into standard format
  var miliseconds = date * 1000;
  var dateObject = new Date(miliseconds);
  var formattedDate = dateObject.toLocaleDateString();
  // base image url from openweather api to display icon codes from response
  var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
  // add border to current results card/box
  dashboard.style.border = "solid black 2px";
  // remove current results card/box to prevent new searches from appending below
  // only current selection will display
  if (dashboard !== null) {
    while (dashboard.hasChildNodes()) {
      dashboard.removeChild(dashboard.firstChild);
    }
  }
  // dynamically create elements for current forecast
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

// write function which dynamically parses the 5 day forcast, date, an icon,
// temp, wind speed, and humidity
// ===========================================================================
function fiveDayAppend(data) {
  var fiveDayArray = [];
  // loop through 5 day forecast response data
  for (i = 0; i < data.length; i++) {
    // convert date (unix time) from response into standard format
    var miliseconds = data[i].dt * 1000;
    var dateObject = new Date(miliseconds);
    var formattedDate = dateObject.toLocaleDateString();
    // store response data in var's
    var icon = data[i].weather[0].icon;
    var temperature = data[i].main.temp;
    var wind = data[i].wind.speed;
    var humid = data[i].main.humidity;
    // object storing response data
    var forecast = {
      date: formattedDate,
      icon: icon,
      temp: temperature,
      wind: wind,
      humidity: humid,
    };
    // store objects with desired 5 day forecast data in array, API only allows search in 3 hour
    // segments up to five days, array contains 40 - 3 hour blocks
    fiveDayArray.push(forecast);
  }
  // crate array with indexes to discard
  var removeValFromIndex = [
    1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23,
    25, 26, 27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38, 39,
  ];
  // loop through discard array backwards, and remove said indexes from fiveDayArray
  // without altering index positions in fiveDayArray
  for (var i of removeValFromIndex.reverse()) {
    fiveDayArray.splice(i, 1);
  }
  fiveDayToDOM(fiveDayArray);
}

// write function which appends 5 day forecast data to DOM
// ==============================================================
function fiveDayToDOM(data) {
  var fiveDayDiv = document.getElementById("five-day");
  // remove five day forecast so forecast from new search/selection does not append below
  // only one five day forecast will display at a time
  if (fiveDayDiv !== null) {
    while (fiveDayDiv.hasChildNodes()) {
      fiveDayDiv.removeChild(fiveDayDiv.firstChild);
    }
  }
  // loop through response data and create a display card for 5 days of weather
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
  // remove "5 Day Forecast" title to prevent it from double appending with new city search
  var fiveDayHeading = document.getElementById("five-day-heading");
  if (fiveDayHeading !== null) {
    fiveDayHeading.remove();
  }
  // dynamically crate "5 Day Forecast" title for cards
  var forecastDashboard = document.getElementById("dashboard");
  var title = document.createElement("h3");
  title.textContent = "5 Day Forecast";
  title.setAttribute("class", "ms-4 mt-4");
  title.setAttribute("id", "five-day-heading");
  forecastDashboard.after(title);
}

// write function which displays current forcast for cities from search history
// ===========================================================================
function appendCityToCurrent(event) {
  // event targets element clicked to display forecast from search history
  var btnClicked = event.target;
  var btnText = btnClicked.textContent;
  // loop through search history results
  for (i = 0; i < searchHistory.length; i++) {
    var city = searchHistory[i].city;
    var date = searchHistory[i].date;
    var icon = searchHistory[i].icon;
    var temp = searchHistory[i].temp;
    var wind = searchHistory[i].wind;
    var humid = searchHistory[i].humidity;
    // button clicked must match object in searchHistory array
    if (btnText === city) {
      // pass in data to dynamically create current forecast card
      createCurrentCard(city, date, icon, temp, wind, humid);
    }
  }
  // pass in city name from event to get 5 day forecast for city from search history
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
  };
  searchHistory.push(cityData);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// write function which dynamically displays search history
// ===========================================================================
function appendHistory() {
  // loop through searchHistory array if it is not empty and append to DOM
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
// forecast for clicked city
ul.addEventListener("click", appendCityToCurrent);

// create an event listener for submit button
// ===========================================================================
submitForm.addEventListener("submit", getApi);
