const apiKey = "262464baa56ace00c2ed62da282e50fc"; // Replace with your OpenWeather API key

const searchButton = document.getElementById("searchButton");
const cityInput = document.getElementById("cityInput");
const weatherDetails = document.getElementById("weatherDetails");
const forecastDetails = document.getElementById("forecastDetails");

let isCelsius = true; // Default to Celsius
let currentWeatherData = null; // To store current weather data for toggling
let currentForecastData = null; // To store forecast data for toggling

searchButton.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

// Toggle Temperature Units
function toggleUnits() {
    isCelsius = !isCelsius; // Toggle the unit state
    if (currentWeatherData) {
        displayCurrentWeather(currentWeatherData);
    }
    if (currentForecastData) {
        displayForecast(currentForecastData);
    }
}

// Fetch weather and forecast data
async function fetchWeather(city) {
    try {
        // Fetch current weather
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        currentWeatherData = await weatherResponse.json();

        displayCurrentWeather(currentWeatherData);

        // Fetch 5-day forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );
        currentForecastData = await forecastResponse.json();

        displayForecast(currentForecastData);

    } catch (error) {
        weatherDetails.innerHTML = `<p>Error fetching weather data. Please try again.</p>`;
    }
}

// Display current weather
function displayCurrentWeather(data) {
    const temp = isCelsius ? data.main.temp : celsiusToFahrenheit(data.main.temp);
    const tempUnit = isCelsius ? "°C" : "°F";

    weatherDetails.innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p>Temperature: ${temp.toFixed(1)}${tempUnit}</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <button id="toggleButton" onclick="toggleUnits()">Switch to ${isCelsius ? "Fahrenheit" : "Celsius"}</button>
    `;
}

// Display forecast
function displayForecast(data) {
    forecastDetails.innerHTML = ""; // Clear previous forecast

    // Filter data to show one forecast per day
    const dailyForecasts = data.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
    );

    dailyForecasts.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });

        const temp = isCelsius
            ? forecast.main.temp
            : celsiusToFahrenheit(forecast.main.temp);
        const tempUnit = isCelsius ? "°C" : "°F";

        forecastDetails.innerHTML += `
            <div class="forecast-item">
                <h4>${date}</h4>
                <p>${forecast.weather[0].description}</p>
                <p>Temp: ${temp.toFixed(1)}${tempUnit}</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
            </div>
        `;
    });
}

// Helper function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    return celsius * 9 / 5 + 32;
}
function displayForecast(data) {
    if (!data || !data.list) {
        console.error("Forecast data is missing or invalid:", data);
        forecastDetails.innerHTML = "<p>Unable to fetch forecast data.</p>";
        return;
    }

    // Proceed to display forecast
    forecastDetails.innerHTML = ""; // Clear previous forecast

    const dailyForecasts = data.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
    );

    dailyForecasts.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });

        forecastDetails.innerHTML += `
            <div class="forecast-item">
                <h4>${date}</h4>
                <p>${forecast.weather[0].description}</p>
                <p>Temp: ${forecast.main.temp}°C</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
            </div>
        `;
    });
}
