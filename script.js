const apiKey = "1065debd2c3eec6cb974de56009c4597"; // Replace with your API key
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherDisplay = document.getElementById("weatherDisplay");
const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const weatherType = document.getElementById("weatherType");
const hourlyForecast = document.getElementById("hourlyForecast");
const forecastItems = document.getElementById("forecastItems");


// Dark/Light Mode Toggle
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// Function to apply the correct theme
function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    themeIcon.classList.replace("fa-moon", "fa-sun");
  } else {
    document.documentElement.classList.remove("dark");
    themeIcon.classList.replace("fa-sun", "fa-moon");
  }
}

// Initialize theme from localStorage
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

// Toggle Dark/Light Mode
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("theme", currentTheme);
  applyTheme(currentTheme);
});



// Fetch Weather Data
async function fetchWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  );
  const data = await response.json();
  return data;
}

// Fetch Hourly Forecast Data
async function fetchHourlyForecast(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  );
  const data = await response.json();
  return data;
}

// Display Weather Data
function displayWeather(data) {
  cityName.textContent = data.name;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherType.textContent = data.weather[0].description;
  weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">`;
  weatherDisplay.classList.remove("hidden");
}

// Display Hourly Forecast
function displayHourlyForecast(data) {
  forecastItems.innerHTML = ""; // Clear previous forecast data
  data.list.slice(0, 5).forEach((forecast) => {
    const forecastItem = document.createElement("div");
    forecastItem.className = "flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg";
    forecastItem.innerHTML = `
      <span>${new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      <span>${Math.round(forecast.main.temp)}°C</span>
      <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
      <span>${forecast.weather[0].description}</span>
    `;
    forecastItems.appendChild(forecastItem);
  });
  hourlyForecast.classList.remove("hidden");
}

// Search Button Event Listener
searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (city) {
    const weatherData = await fetchWeather(city);
    const forecastData = await fetchHourlyForecast(city);
    displayWeather(weatherData);
    displayHourlyForecast(forecastData);
  }
});