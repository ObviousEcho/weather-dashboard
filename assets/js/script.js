// global var's
var apiKey = "842e73dda78b17a825098fd7bd7e267e";
var submitForm = document.getElementById("search-input");

// write a function to make an API call for a specific city, which returns data
// function should submit city input from form into API endpoint
// function should add city to search history
// ===========================================================================
function getApi(event) {
  event.preventDefault();
  var cityInput = document.getElementById("input-field").value;
  console.log(cityInput);
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityInput +
    "&appid=" +
    apiKey;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
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

// write function which dynamically displays search history
// ===========================================================================

// create an event listener for submit button
// ===========================================================================

submitForm.addEventListener("submit", getApi);
