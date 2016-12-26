
var city = document.getElementById('cityName').value;
var main = document.getElementById('main');

var container = document.createElement('div');
container.classList.add('container');
main.appendChild(container);

function getWeather() {

  var weatherReq = new XMLHttpRequest();
    weatherReq.addEventListener('load', weatherReqListener);
    weatherReq.open('GET', 'http://api.openweathermap.org/data/2.5/forecast?q=Honolulu,us&units=imperial&mode=json&appid=3cbfd5118bdcf7dea13501c1c1135c2e');
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


