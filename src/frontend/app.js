const statusPanel = document.getElementById("status-panel");
const statusText = document.getElementById("status-text");
const metricsSection = document.getElementById("metrics");

const temperatureValue = document.getElementById("temperature-value");
const windMsValue = document.getElementById("wind-ms");
const windMphValue = document.getElementById("wind-mph");

function showLoadingState(message) {
  statusPanel.classList.remove("is-error");
  statusText.textContent = message;
  metricsSection.hidden = true;
  metricsSection.classList.remove("is-visible");
}

function showErrorState(message) {
  statusPanel.classList.add("is-error");
  statusText.textContent = message;
  metricsSection.hidden = true;
  metricsSection.classList.remove("is-visible");
}

function showSuccessState() {
  statusPanel.classList.remove("is-error");
  statusText.textContent = "Ultima actualizacion completada correctamente.";
  metricsSection.hidden = false;
  metricsSection.classList.add("is-visible");
}

function renderWeather(data) {
  temperatureValue.textContent = `${data.temperature_celsius.toFixed(2)} C`;
  windMsValue.textContent = `${data.wind_speed.ms.toFixed(2)} m/s`;
  windMphValue.textContent = `${data.wind_speed.mph.toFixed(2)} mph`;
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