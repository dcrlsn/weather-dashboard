// enter city


//  I am presented with the city name, the date, an icon representation of 
//            weather conditions, 
//            the temperature, 
//             the humidity, 
//              the wind speed, 

// get uv index


// get 5 day forecast
//color something based on weather severity

// save search to local storage, click to recall api.
var searchInput = document.querySelector('#city-input')
var searchFormElement = document.querySelector('form')
var params = new URLSearchParams(document.location.search);
var searchTerm = params.get('q');

var token = "5e12ee56c52dd79263a134af142e0ceb"
var searchLocation = "";

var imgIcon = '';

//https://api.openweathermap.org/data/2.5/weather?q=charlotte&appid=5e12ee56c52dd79263a134af142e0ceb

function getLocationData() {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${token}&units=imperial`

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) return response.json();
      else alert('Error: ' + response.statusText);
    })
    .then(function (data) {
      searchLocation = data.name
      getWeatherData(data.coord.lon, data.coord.lat)
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeatherMap");
    });
  ;
};

function getWeatherData(lon, lat) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${token}&units=imperial`;

  console.log(apiUrl);

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) return response.json();
      else alert('Error: ' + response.statusText);
    })
    .then(function (data) {
      displayCurrentForecast(data);
      console.log(data)
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeatherMap OneCall");
    });
  ;
}

function displayCurrentForecast(data) {
  var resultsContainer = document.querySelector('#results')
  if (!data) return resultsContainer.textContent = 'Your search returned no results';
  console.log(data)
  var resultsDiv = document.createElement('div');

  var titleElement = document.createElement('h1');
  titleElement.textContent = searchLocation;
  resultsDiv.appendChild(titleElement);

  var windSpeed = document.createElement('p');
  windSpeed.textContent = `${data.current.wind_speed} mph`;
  resultsDiv.appendChild(windSpeed);
  resultsContainer.appendChild(resultsDiv);

  var dailyForecast = document.createElement('div');
  resultsContainer.appendChild(dailyForecast);
  dailyForecast.classList = 'row justify-content-center';


  for (i = 0; i < 5; i++) {
    var day = data.daily[i]
    var dayOfWeek = document.createElement('div');
    dayOfWeek.classList = 'col-2'

    var dayOfWeekTitle = document.createElement('h4');
    dayOfWeekTitle.textContent = moment(day.dt, 'X').format('dddd')

    var dayIcon = document.createElement('img')
    dayIcon.src = `http://openweathermap.org/img/w/${day.weather[0].icon}.png`
    dayIcon.alt = `${day.weather[0].main}`

    var dayOfWeekHumidity = document.createElement('p');
    dayOfWeekHumidity.textContent = `${day.humidity}% Humidity`
    var dayOfWeekTemperature = document.createElement('h5');
    dayOfWeekTemperature.textContent = `${Math.floor(day.temp.day)} F`

    dayOfWeek.appendChild(dayOfWeekTitle)
    dayOfWeek.appendChild(dayIcon)
    dayOfWeek.appendChild(dayOfWeekTemperature)
    dayOfWeek.appendChild(dayOfWeekHumidity)
    dailyForecast.appendChild(dayOfWeek)
  }
};
if (searchTerm) {
  getLocationData()
};

searchFormElement.addEventListener('submit',
  function (event) {
    event.preventDefault();
    var search = searchInput.value.replace(/\s/g, "+");
    if (search) {
      location.replace(`index.html?q=${search}`);
    } else alert('Please enter a search term');
  })