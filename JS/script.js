var searchBtn = document.querySelector(".search-btn");
var searchInput = document.querySelector(".search-input");
var locationName = document.querySelector(".location-name");

// API key for weather service
const API_KEY = "403cddb4702a43bfbb6203446250407";

// get weather data for a specific city
function getWeatherData(city) {
  const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        Swal.fire({
          icon: "error",
          title: "City Not Found!",
          text: "Please check the city name and try again.",
          confirmButtonColor: "#007bff",
        });
        return;
      }
      updateWeatherDisplay(data);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      Swal.fire({
        icon: "error",
        title: "Connection Error!",
        text: "Unable to fetch weather data. Please check your internet connection and try again.",
        confirmButtonColor: "#007bff",
      });
    });
}

// Function to update the weather display with new data
function updateWeatherDisplay(data) {
  // Update location name
  locationName.textContent = data.location.name;

  // Get weather cards
  const todayCard = document.querySelector(".today");
  const tomorrowCard = document.querySelector(".tomorrow");
  const afterTomorrowCard = document.querySelector(".afterTomorrow");

  // Update today's weather
  updateCard(todayCard, data.forecast.forecastday[0]);

  // Update tomorrow's weather (if available)
  if (data.forecast.forecastday[1]) {
    updateCard(tomorrowCard, data.forecast.forecastday[1]);
  }

  // Update day after tomorrow's weather (if available)
  if (data.forecast.forecastday[2]) {
    updateCard(afterTomorrowCard, data.forecast.forecastday[2]);
  }
}

// Function to update individual weather card
function updateCard(card, dayData) {
  // Update date
  const date = new Date(dayData.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  card.querySelector(".date").textContent = formattedDate;

  // Update day name
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  card.querySelector(".day").textContent = dayName;

  // Update temperature
  card.querySelector(".temp").textContent =
    Math.round(dayData.day.avgtemp_c) + "°";

  // Update weather description
  card.querySelector(".description").textContent = dayData.day.condition.text;

  // Update weather icon
  const iconElement = card.querySelector(".cardBody i");
  const conditionText = dayData.day.condition.text.toLowerCase();

  // Weather icons
  if (conditionText.includes("sunny") || conditionText.includes("clear")) {
    iconElement.className = "fa-solid fa-sun fa-3x";
  } else if (conditionText.includes("cloud")) {
    iconElement.className = "fa-solid fa-cloud fa-3x";
  } else if (conditionText.includes("rain")) {
    iconElement.className = "fa-solid fa-cloud-rain fa-3x";
  } else if (conditionText.includes("snow")) {
    iconElement.className = "fa-solid fa-snowflake fa-3x";
  } else {
    iconElement.className = "fa-solid fa-cloud-sun fa-3x";
  }

  //  humidity
  card.querySelector(".humidity span").textContent =
    " " + dayData.day.avghumidity + "%";

  //  wind speed
  card.querySelector(".windSpeed span").textContent =
    " " + Math.round(dayData.day.maxwind_kph) + " km/h";

  // Wind direction
  card.querySelector(".windDir span").textContent =
    " " + (dayData.hour[12].wind_dir || "N/A");
}

// Event listener for search button
searchBtn.addEventListener("click", function () {
  const cityName = searchInput.value.trim();

  if (cityName === "") {
    Swal.fire({
      icon: "warning",
      title: "Missing City Name!",
      text: "Please enter a city name to search for weather information.",
      confirmButtonColor: "#007bff",
    });
    return;
  }

  // Get weather data for the entered city
  getWeatherData(cityName);
});

// Event listener for Enter key in search input
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

// Load default weather data for Cairo on page load
getWeatherData("Cairo");
