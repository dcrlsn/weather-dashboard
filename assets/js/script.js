var searchInput = document.querySelector('#city-input');
var searchFormElement = document.querySelector('#search');
var prevSearchElement = document.querySelector('#prev-search');
var prevSearchElementBtn = document.querySelectorAll('#prev-search button');
var resultsContainer = document.querySelector('#results');
var params = new URLSearchParams(document.location.search);
var searchTerm = params.get('q');
var token = '5e12ee56c52dd79263a134af142e0ceb';
var searchLocation = '';
var imgIcon = '';

function getLocationData() {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${token}&units=imperial`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        store(searchTerm);
        return response.json();
      }
      else resultsContainer.textContent = `Error: ${response.statusText}`;
    })
    .then(function (data) {
      console.log(data)
      searchLocation = data.name;
      getWeatherData(data.coord.lon, data.coord.lat);
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeatherMap");
    });
  ;
};

function getWeatherData(lon, lat) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${token}&units=imperial`;
  var resultsContainer = document.querySelector('#results')
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) return response.json();
      else alert(`Error: ${response.statusText}`);
    })
    .then(function (data) {
      displayCurrentForecast(data);
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeatherMap OneCall");
      resultsContainer.textContent = 'Your search returned no results';
    });
  ;
}

function colorBorder(element, temp) {
  switch (temp) {
    case Math.floor(temp) < 30: color = `border-primary`;
      break;
    case Math.floor(temp) > 90: color = `border-danger`;
      break;
    default: color = `border-success`;
      break;
  }
  element.classList.add(`${color}`);
}

function displayCurrentForecast(data) {
  console.log(data)
  resultsContainer.classList = "row justify-content-center col-9";
  var searchFormHeader = document.querySelector('header');
  searchFormHeader.classList = 'col-3 justify-content-left p-2';
  searchFormElement.classList = 'col-12 text-center';

  var currentDiv = document.createElement('div');
  currentDiv.classList = 'order-0 row text-center pt-5 pb-5 justify-content-evenly border m-5 bg-dark col-8 rounded';
  colorBorder(currentDiv, data.current.temp);
  resultsContainer.appendChild(currentDiv);

  var resultsDiv = document.createElement('div');
  resultsDiv.classList = "col-4 order-0 text-center pt-5 pb-5";
  currentDiv.appendChild(resultsDiv);

  var iconDiv = document.createElement('div');
  iconDiv.classList = 'col-4 d-flex order-1 text-center align-content-center justify-content-center pt-5 pb-5';
  currentDiv.appendChild(iconDiv);

  var titleElement = document.createElement('h1');
  titleElement.textContent = searchLocation;
  resultsDiv.appendChild(titleElement);

  var weatherIcon = document.createElement('img');
  weatherIcon.src = `http://openweathermap.org/img/w/${data.current.weather[0].icon}.png`;
  iconDiv.appendChild(weatherIcon);

  var tempElement = document.createElement('h2');
  tempElement.textContent = `${Math.floor(data.current.temp)} F`;
  resultsDiv.appendChild(tempElement);

  var UVElement = document.createElement('h5');
  UVElement.textContent = `${data.current.uvi} UVI`;
  resultsDiv.appendChild(UVElement);

  var windSpeed = document.createElement('p');
  windSpeed.textContent = `${data.current.wind_speed} mph`;
  resultsDiv.appendChild(windSpeed);

  var dailyForecast = document.createElement('div');
  resultsContainer.appendChild(dailyForecast);
  dailyForecast.classList = 'row justify-content-between order-2 text-center';


  for (i = 0; i < 5; i++) {
    var day = data.daily[i];
    var dayOfWeek = document.createElement('div');
    dayOfWeek.classList = 'col-2 bg-dark m-2 pt-3 border rounded'
    colorBorder(dayOfWeek, data.daily[i].temp.day);

    var dayOfWeekTitle = document.createElement('h4');
    dayOfWeekTitle.textContent = moment(day.dt, 'X').format('dddd');

    var dayIcon = document.createElement('img');
    dayIcon.src = `http://openweathermap.org/img/w/${day.weather[0].icon}.png`;
    dayIcon.alt = `${day.weather[0].main}`;

    var dayOfWeekHumidity = document.createElement('p');
    dayOfWeekHumidity.textContent = `${day.humidity}% Humidity`
    var dayOfWeekTemperature = document.createElement('h5');
    dayOfWeekTemperature.textContent = `${Math.floor(day.temp.day)} F`;

    dayOfWeek.appendChild(dayOfWeekTitle);
    dayOfWeek.appendChild(dayIcon);
    dayOfWeek.appendChild(dayOfWeekTemperature);
    dayOfWeek.appendChild(dayOfWeekHumidity);
    dailyForecast.appendChild(dayOfWeek);
  }
};

function init() {
  var prevSearch = JSON.parse(localStorage.getItem("prevSearch")) || [];
  renderPrevSearch(prevSearch);

}

function renderPrevSearch(prevSearch) {
  for (i = 0; i < prevSearch.length; i++) {
    var prevSearchBtn = document.createElement('button');
    prevSearchBtn.textContent = prevSearch[i];
    prevSearchBtn.classList = "btn btn-primary m-1"
    prevSearchBtn.setAttribute('data-search', prevSearch[i].replace(/\s/g, "+"));
    prevSearchBtn.setAttribute('type', 'button');
    prevSearchBtn.addEventListener('click', function () {
      location.replace(`index.html?q=${this.dataset.search}`);
    })
    prevSearchElement.appendChild(prevSearchBtn);
  }
}

function store(str) {
  var prevSearch = JSON.parse(localStorage.getItem("prevSearch")) || [];
  if (!prevSearch.includes(str) && !null) {
    prevSearch.unshift(str);
    if (prevSearch.length > 5) {
      prevSearch.length = 5;
    }
  }
  localStorage.setItem('prevSearch', JSON.stringify(prevSearch));
}

init();

if (searchTerm) {
  getLocationData();
};

searchFormElement.addEventListener('submit',
  function (event) {
    event.preventDefault();
    var search = searchInput.value.replace(/\s/g, "+");
    if (search) {
      location.replace(`index.html?q=${search}`);
    } else alert('Please enter a search term');
  })
