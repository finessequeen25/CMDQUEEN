const apiKey = "262464baa56ace00c2ed62da282e50fc"; // Replace with your OpenWeather API key

const searchButton = document.getElementById("searchButton");
const cityInput = document.getElementById("cityInput");
const weatherDetails = document.getElementById("weatherDetails");
const forecastDetails = document.getElementById("forecastDetails");
const toggleButton = document.getElementById("toggleButton");

let isCelsius = true; // Default to Celsius
let currentWeatherData = null; // Store current weather data for toggling
let currentForecastData = null; // Store forecast data for toggling

// Fetch weather and forecast data
searchButton.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

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
        console.error("Error fetching weather data:", error);
        weatherDetails.innerHTML = "<p>Unable to fetch weather data. Please try again.</p>";
        forecastDetails.innerHTML = "";
    }
}

// Display current weather
function displayCurrentWeather(data) {
    const temp = isCelsius ? data.main.temp : celsiusToFahrenheit(data.main.temp);
    const unit = isCelsius ? "°C" : "°F";

    weatherDetails.innerHTML = `
        <p>City: ${data.name}</p>
        <p>Temperature: ${temp.toFixed(1)} ${unit}</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

// Display 5-day forecast
function displayForecast(data) {
    forecastDetails.innerHTML = "";

    // Filter to show one forecast per day
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
        const unit = isCelsius ? "°C" : "°F";

        forecastDetails.innerHTML += `
            <div class="forecast-item">
                <h4>${date}</h4>
                <p>${forecast.weather[0].description}</p>
                <p>Temp: ${temp.toFixed(1)} ${unit}</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
            </div>
        `;
    });
}

// Toggle units
toggleButton.addEventListener("click", () => {
    isCelsius = !isCelsius;
    toggleButton.textContent = isCelsius ? "Switch to Fahrenheit" : "Switch to Celsius";

    if (currentWeatherData) displayCurrentWeather(currentWeatherData);
    if (currentForecastData) displayForecast(currentForecastData);
});

// Helper function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    return celsius * 9 / 5 + 32;
}
