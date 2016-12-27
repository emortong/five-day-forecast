
var main = document.getElementById('main');

var cityTitle = document.createElement('h1');
cityTitle.id = 'cityTitle';
main.appendChild(cityTitle);

var didYouMean = document.createElement('div');
didYouMean.classList.add('didYouMean')
main.appendChild(didYouMean);

var didYouMeanTitle = document.createElement('h3');
didYouMean.appendChild(didYouMeanTitle);

var optionsUl = document.createElement('ul');
didYouMean.appendChild(optionsUl);

var container = document.createElement('div');
container.classList.add('container');
main.appendChild(container);

var units = 'imperial';
var unitBtn = document.getElementById('unit');
var x = document.getElementById('cel');
var y = document.getElementById('far');
var cityId;


function changeUnit() {
  if(units === 'imperial') {
    units = 'metric';
    x.style.color = '#16a9b8';
    y.style.color = 'grey';
  } else {
    units = 'imperial';
    x.style.color = 'grey';
    y.style.color = '#16a9b8';
  }
  if(cityId !== undefined) {
    showWeather(cityId);
  }
}


function getWeather() {
  var cityIdObjects = [];
  var city = document.getElementById('cityName').value;
  city = toTitleCase(city);
  cityTitle.innerHTML = city;
  document.getElementById('cityName').value = '';
  while (optionsUl.hasChildNodes()) {
    optionsUl.removeChild(optionsUl.lastChild);
  }
  while (container.hasChildNodes()) {
    container.removeChild(container.lastChild);
  }


  var locationReq = new XMLHttpRequest();
  locationReq.addEventListener('load', locationReqListener);
  locationReq.open('GET', '/city.list.json');
  locationReq.send()

  function locationReqListener() {

    var cities = JSON.parse(this.responseText);
    cities.forEach(function(cities) {
      if(cities.name === city) {
          cityIdObjects.push(cities);
          console.log(cityIdObjects);
        }
      })

      if(cityIdObjects.length > 0) {
        didYouMeanTitle.innerHTML = 'Did You Mean...'

        cityIdObjects.forEach(function(city) {
        var li = document.createElement('li');
        li.innerHTML = city.name + ', ' + city.country;
        optionsUl.appendChild(li);

          li.addEventListener('click', function() {
           while (optionsUl.hasChildNodes()) {
             optionsUl.removeChild(optionsUl.lastChild);
             didYouMeanTitle.innerHTML = ''
            }

            cityId = city._id;
            cityTitle.innerHTML = city.name + ', ' + city.country;;
            showWeather(cityId);
          })
        })
      }
    }
  }




function showWeather(cityId) {

  var weatherReq = new XMLHttpRequest();
    weatherReq.addEventListener('load', weatherReqListener);
    weatherReq.open('GET', `http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=${units}&mode=json&appid=3cbfd5118bdcf7dea13501c1c1135c2e`);
    weatherReq.send();

  function weatherReqListener() {
    while (container.hasChildNodes()) {
    container.removeChild(container.lastChild);
    }

    var data = JSON.parse(this.responseText);
    console.log(data);
    console.log(data.list.length)
    for(var i = 0; i < data.list.length; i+=8) {
      var date = data.list[i].dt;
      date = moment.unix(date).format("ddd, hA")

      var humidity = data.list[i].main.humidity;
      var temp = Math.floor(data.list[i].main.temp) + '°';
      var temp_max = Math.floor(data.list[i].main.temp_max) + '°';
      var temp_min = Math.floor(data.list[i].main.temp_min) + '°';
      var description = data.list[i].weather[0].description;
      var mainDescription = data.list[i].weather[0].main;

      var weatherDiv = document.createElement('div');
      weatherDiv.classList.add('weatherDiv');
      container.appendChild(weatherDiv);

      var day = document.createElement('div');
      day.classList.add('day');
      day.innerHTML = date;
      weatherDiv.appendChild(day);

      var icon = document.createElement('div');
      icon.classList.add('icon');
        if(mainDescription === 'Clear') {
          icon.style.backgroundImage = 'url(/assets/sun.svg)'
        } else if(mainDescription === 'Clouds') {
          if(description === 'overcast clouds') {
            icon.style.backgroundImage = 'url(/assets/cloud.svg)'
          } else {
            icon.style.backgroundImage = 'url(/assets/sun-cloud.svg)'
          }
        } else if(mainDescription === 'Rain') {
          icon.style.backgroundImage = 'url(/assets/rainy.svg)'
        }
      weatherDiv.appendChild(icon);

      var textDiv = document.createElement('div');
      textDiv.classList.add('textDiv');
      weatherDiv.appendChild(textDiv);

      var mainTemp = document.createElement('h1');
      mainTemp.innerHTML = temp;
      textDiv.appendChild(mainTemp);

      var maxMinTemp = document.createElement('h3');
      maxMinTemp.innerHTML = `${temp_max}/${temp_min}`;
      textDiv.appendChild(maxMinTemp);

      var describeWeather = document.createElement('p');
      describeWeather.innerHTML = description;
      textDiv.appendChild(describeWeather);

      }
    }
  }

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
