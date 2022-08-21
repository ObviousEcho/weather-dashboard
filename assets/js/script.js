// global var's
var apiKey = "842e73dda78b17a825098fd7bd7e267e";
var submitForm = document.getElementById("search-input");
var searchHistory = [];

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
      console.log(responseData);
      sendToLocalStorage(responseData);
    });
  inputField.value = "";
}

// write a function which dislpays current conditoins for that city
// dynamically display city name, date, an icon, temp, humidity, wind and uv index
// uv index to be color coded
// ===========================================================================

// write function which dynamically displays the 5 day forcast, date, an icon,
// temp, wind speed, and humidity
// ===========================================================================

// write function which displays current and 5 day forcast for cities from search history
// ===========================================================================

// write function which accesses local storage if it exists
// ===========================================================================
function getLocalStorage() {
  var history = JSON.parse(localStorage.getItem("searchHistory"));
  if (history !== null) {
    searchHistory = history;
    console.log(searchHistory);
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
  var ul = document.getElementById("list");
  if (searchHistory !== null) {
    for (i = 0; i < searchHistory.length; i++) {
      var listItem = document.createElement("button");
      listItem.textContent = searchHistory[i].city;
      listItem.setAttribute("type", "button");
      listItem.setAttribute("class", "btn btn-secondary my-2");
      listItem.setAttribute("id", `button-${[i]}`);
      ul.appendChild(listItem);
    }
    console.log(ul.childNodes[1]);
  }
}

// create event delegation listener for search history button which displays
// forcast for clicked city

// create an event listener for submit button
// ===========================================================================
submitForm.addEventListener("submit", getApi);
