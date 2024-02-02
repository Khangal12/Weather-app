const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const cityInput=document.querySelector(".city-input");
const weatherCardsDiv= document.querySelector(".weather-cards");
const currentWeatherDiv= document.querySelector(".current-weather");
const API_KEY="62876587701ad927e106bed98bed3d39";
const createWeatherCard = (cityName,weatherItem,index)=>{
    if(index===0)
    {
return ` <div class="details">
<h2>${cityName}(${weatherItem.dt_txt.split(" ")[0]})</h2>
<h4>Temperature: ${(weatherItem.main.temp)}°C</h4>
<h4>Wind: ${weatherItem.wind.speed} M/S</h4>
<h4>Humidity: ${weatherItem.main.humidity}%</h4>
</div>
<div class="icon">
<img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
<h4>${weatherItem.weather[0].description}</h4>
</div>`;
    }

    else {
        return `<li class="card">
    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
    <h2>${weatherItem.dt_txt.split(" ")[0]}</h2>
<h4>Temperature: ${weatherItem.main.temp}°C</h4>
<h4>Wind: ${weatherItem.wind.speed} M/S</h4>
<h4>Humidity: ${weatherItem.main.humidity}%</h4>
</li>`
    }
}

const getWeatherDetails = (cityName, lat , lon) => {
     const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
      console.log(data);
      const uniqueForecastDays = [];
       const fiveDaysForecast = data.list.filter(forecast =>{
            const forecastDate= new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }

        });
        //clearing previous weather data
        cityInput.value="";
        weatherCardsDiv.innerHTML="";
        currentWeatherDiv.innerHTML="";
        //creating weather cards and adding item to the DOM
        fiveDaysForecast.forEach((weatherItem,index) => {
        if(index===0) 
        {
                    currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));
        }
        else
        {
            weatherCardsDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));
        }
         })
    }).catch(()=>{
        alert("An error occurred while fetching the weather forecast!");
    });

}

const getCityCoordinates = () =>{
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const GEOCODING_API_URL=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL).then( res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates for ${cityName}`);
        const {name , lat, lon } = data[0];
        getWeatherDetails(name,lat,lon);
    }).catch(()=>{
        alert("An error occurred while fetching the coordinates!");
    });
}
const getUserCoordinates = () =>{
    navigator.geolocation.getCurrentPosition(
        position=>{
           const {latitude,longitude}=position.coords;
           const REVERSE_GEOCODING_URL=`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
           //get city name from coordiantes using reverse geocoding api
           fetch(REVERSE_GEOCODING_URL).then( res => res.json()).then(data => {
            if(!data.length) return alert(`No coordinates for ${cityName}`);
            const {name} = data[0];
            getWeatherDetails(name,latitude,longitude);
        }).catch(()=>{
            alert("An error occurred while fetching the city!");
        });
        },
        error=>{
            if(error.code === error.PERMISSION_DENIED){
                alert("Geolocation request denied. Please reset loaction permission to grant access a  ")
            }
        }
    );
}

searchButton.addEventListener("click", getCityCoordinates);
locationButton.addEventListener("click", getUserCoordinates);
cityInput.addEventListener("keyup", e=> e.key==="Enter" && getCityCoordinates())