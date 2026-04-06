const statusPanel = document.getElementById("status-panel");
const statusText = document.getElementById("status-text");
const metricsSection = document.getElementById("metrics");

const temperatureValue = document.getElementById("temperature-value");
const windMsValue = document.getElementById("wind-ms");
const windMphValue = document.getElementById("wind-mph");
const windDirectionValue = document.getElementById("wind-direction");
const weatherConditionValue = document.getElementById("weather-condition");
const weatherCodeValue = document.getElementById("weather-code");
const thermometerElement = document.getElementById("thermometer");
const thermometerFill = document.getElementById("thermo-fill");
const thermalStateValue = document.getElementById("thermal-state");
const conditionVisual = document.getElementById("condition-visual");
const conditionIcon = document.getElementById("condition-icon");
const conditionCaption = document.getElementById("condition-caption");

const weatherCodeLabels = {
  0: "Cielo despejado",
  1: "Principalmente despejado",
  2: "Parcialmente nuboso",
  3: "Cubierto",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna moderada",
  55: "Llovizna intensa",
  61: "Lluvia ligera",
  63: "Lluvia moderada",
  65: "Lluvia intensa",
  71: "Nieve ligera",
  73: "Nieve moderada",
  75: "Nieve intensa",
  80: "Chubascos ligeros",
  81: "Chubascos moderados",
  82: "Chubascos violentos",
  95: "Tormenta",
  96: "Tormenta con granizo ligero",
  99: "Tormenta con granizo fuerte"
};

function setStatusMode(modeClassName) {
  statusPanel.classList.remove("is-loading", "is-live", "is-error");
  statusPanel.classList.add(modeClassName);
}

function formatLastUpdateTime(date) {
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
}

function showLoadingState(message) {
  setStatusMode("is-loading");
  statusText.textContent = message;
  metricsSection.hidden = true;
  metricsSection.classList.remove("is-visible");
}

function showErrorState(message) {
  setStatusMode("is-error");
  statusText.textContent = message;
  metricsSection.hidden = true;
  metricsSection.classList.remove("is-visible");
}

function showSuccessState() {
  const lastUpdateTime = formatLastUpdateTime(new Date());

  setStatusMode("is-live");
  statusText.textContent = `En directo · Ultima actualizacion: ${lastUpdateTime}`;
  metricsSection.hidden = false;
  metricsSection.classList.add("is-visible");
}

function getWeatherDescription(code) {
  if (Object.prototype.hasOwnProperty.call(weatherCodeLabels, code)) {
    return weatherCodeLabels[code];
  }

  return "Condicion no clasificada";
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateThermometer(temperatureCelsius) {
  if (!thermometerElement || !thermometerFill || !thermalStateValue) {
    return;
  }

  thermometerElement.classList.remove("is-mild", "is-hot");

  if (typeof temperatureCelsius !== "number" || !Number.isFinite(temperatureCelsius)) {
    thermometerFill.style.height = "10%";
    thermalStateValue.textContent = "No disponible";
    return;
  }

  const normalized = clamp((temperatureCelsius + 10) / 55, 0, 1);
  const fillPercent = 8 + normalized * 92;
  thermometerFill.style.height = `${fillPercent.toFixed(0)}%`;

  if (temperatureCelsius < 14) {
    thermalStateValue.textContent = "Fresco";
    return;
  }

  if (temperatureCelsius < 27) {
    thermometerElement.classList.add("is-mild");
    thermalStateValue.textContent = "Templado";
    return;
  }

  thermometerElement.classList.add("is-hot");
  thermalStateValue.textContent = "Calido";
}

function updateConditionVisual(weatherCode) {
  if (!conditionVisual || !conditionIcon || !conditionCaption) {
    return;
  }

  conditionVisual.classList.remove(
    "is-sunny",
    "is-cloudy",
    "is-fog",
    "is-rain",
    "is-storm",
    "is-snow"
  );

  if (typeof weatherCode !== "number" || !Number.isFinite(weatherCode)) {
    conditionIcon.textContent = "○";
    conditionCaption.textContent = "Sin clasificar";
    return;
  }

  if (weatherCode <= 1) {
    conditionVisual.classList.add("is-sunny");
    conditionIcon.textContent = "☀";
    conditionCaption.textContent = "Cielo abierto";
    return;
  }

  if (weatherCode <= 3) {
    conditionVisual.classList.add("is-cloudy");
    conditionIcon.textContent = "☁";
    conditionCaption.textContent = "Nubosidad variable";
    return;
  }

  if (weatherCode === 45 || weatherCode === 48) {
    conditionVisual.classList.add("is-fog");
    conditionIcon.textContent = "☁";
    conditionCaption.textContent = "Bruma y niebla";
    return;
  }

  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
    conditionVisual.classList.add("is-rain");
    conditionIcon.textContent = "☂";
    conditionCaption.textContent = "Lluvia activa";
    return;
  }

  if ([71, 73, 75].includes(weatherCode)) {
    conditionVisual.classList.add("is-snow");
    conditionIcon.textContent = "❄";
    conditionCaption.textContent = "Nieve";
    return;
  }

  if ([95, 96, 99].includes(weatherCode)) {
    conditionVisual.classList.add("is-storm");
    conditionIcon.textContent = "⚡";
    conditionCaption.textContent = "Tormenta";
    return;
  }

  conditionIcon.textContent = "◌";
  conditionCaption.textContent = "Sin icono dedicado";
}

function formatMetric(value, decimals, unit) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "N/D";
  }

  return `${value.toFixed(decimals)} ${unit}`;
}

function renderWeather(data) {
  temperatureValue.textContent = formatMetric(data.temperature_celsius, 2, "C");
  windMsValue.textContent = formatMetric(data.wind_speed?.ms, 2, "m/s");
  windMphValue.textContent = formatMetric(data.wind_speed?.mph, 2, "mph");
  updateThermometer(data.temperature_celsius);

  if (windDirectionValue) {
    windDirectionValue.textContent =
      typeof data.wind_direction_degrees === "number" &&
      Number.isFinite(data.wind_direction_degrees)
        ? `${data.wind_direction_degrees.toFixed(0)} grados`
        : "N/D";
  }

  if (weatherConditionValue && weatherCodeValue) {
    if (typeof data.weather_code === "number" && Number.isFinite(data.weather_code)) {
      weatherConditionValue.textContent = getWeatherDescription(data.weather_code);
      weatherCodeValue.textContent = `(WMO ${data.weather_code})`;
      updateConditionVisual(data.weather_code);
    } else {
      weatherConditionValue.textContent = "Condicion no disponible";
      weatherCodeValue.textContent = "(WMO N/D)";
      updateConditionVisual(undefined);
    }
  }
}

async function loadWeather() {
  showLoadingState("Sincronizando datos de observacion...");

  try {
    const response = await fetch("/api/weather");

    if (!response.ok) {
      throw new Error("No se pudieron recuperar los datos meteorologicos.");
    }

    const payload = await response.json();

    if (!payload.success || !payload.data) {
      throw new Error("El servidor devolvio una respuesta invalida.");
    }

    renderWeather(payload.data);
    showSuccessState();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error inesperado al cargar el panel meteorologico.";

    showErrorState(message);
  }
}

document.addEventListener("DOMContentLoaded", loadWeather);