"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherServiceError = void 0;
exports.getWeatherData = getWeatherData;
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast?latitude=39.47&longitude=-0.38&current_weather=true";
class WeatherServiceError extends Error {
    statusCode;
    constructor(message, statusCode = 502) {
        super(message);
        this.name = "WeatherServiceError";
        this.statusCode = statusCode;
    }
}
exports.WeatherServiceError = WeatherServiceError;
async function getWeatherData() {
    let response;
    try {
        response = await fetch(OPEN_METEO_URL);
    }
    catch {
        throw new WeatherServiceError("No se pudo conectar con Open-Meteo.");
    }
    if (!response.ok) {
        throw new WeatherServiceError(`Open-Meteo respondio con estado ${response.status}.`);
    }
    let payload;
    try {
        payload = (await response.json());
    }
    catch {
        throw new WeatherServiceError("Open-Meteo devolvio un JSON invalido.");
    }
    const currentWeather = payload.current_weather;
    if (!currentWeather ||
        typeof currentWeather.temperature !== "number" ||
        typeof currentWeather.windspeed !== "number" ||
        typeof currentWeather.winddirection !== "number" ||
        typeof currentWeather.weathercode !== "number") {
        throw new WeatherServiceError("Open-Meteo no devolvio current_weather con campos validos de temperatura, viento y codigo meteorologico.");
    }
    return {
        temperature: currentWeather.temperature,
        windspeed: currentWeather.windspeed,
        winddirection: currentWeather.winddirection,
        weathercode: currentWeather.weathercode
    };
}
