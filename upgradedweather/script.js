const apiKey = "262464baa56ace00c2ed62da282e50fc";
let isCelsius = true;

// DOM Elements
const searchButton = document.getElementById("searchButton");
const cityInput = document.getElementById("cityInput");
const weatherDetails = document.getElementById("weatherDetails");
const forecastDetails = document.getElementById("forecastDetails");
const toggleTemp = document.getElementById("toggleTemp");

// Search for Weather
searchButton.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

// Fetch Current Weather and Forecast
async function fetchWeather(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            displayCurrentWeather(data);
            fetchForecast(data.coord.lat, data.coord.lon);
        } else {
            weatherDetails.innerHTML = `<p>City not found. Please try again.</p>`;
        }
    } catch (error) {
        weatherDetails.innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
        console.error(error);
    }
}

// Display Current Weather
function displayCurrentWeather(data) {
    const temp = isCelsius ? data.main.temp : (data.main.temp * 9) / 5 + 32;
    const unit = isCelsius ? "°C" : "°F";

    weatherDetails.innerHTML = `
        <p><strong>${data.name}</strong></p>
        <p>${temp.toFixed(1)} ${unit}</p>
        <p>${data.weather[0].description}</p>
    `;
}

// Fetch 7-Day Forecast
async function fetchForecast(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            displayForecast(data.daily);
        } else {
            forecastDetails.innerHTML = `<p>Unable to fetch forecast data.</p>`;
        }
    } catch (error) {
        forecastDetails.innerHTML = `<p>Error fetching forecast data. Please try again later.</p>`;
        console.error(error);
    }
}

// Display 7-Day Forecast
function displayForecast(daily) {
    forecastDetails.innerHTML = ""; // Clear previous forecast
    daily.slice(0, 7).forEach((day) => {
        const temp = isCelsius ? day.temp.day : (day.temp.day * 9) / 5 + 32;
        const unit = isCelsius ? "°C" : "°F";

        const forecastItem = document.createElement("div");
        forecastItem.className = "forecast-item";
        forecastItem.innerHTML = `
            <p>${new Date(day.dt * 1000).toLocaleDateString()}</p>
            <p>${temp.toFixed(1)} ${unit}</p>
            <p>${day.weather[0].description}</p>
        `;

        forecastDetails.appendChild(forecastItem);
    });
}

// Toggle Temperature Unit
toggleTemp.addEventListener("click", () => {
    isCelsius = !isCelsius;
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});
