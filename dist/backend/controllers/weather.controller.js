"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeather = getWeather;
const weather_converter_1 = require("../utils/weather-converter");
const weather_service_1 = require("../services/weather.service");
async function getWeather(req, res) {
    try {
        const { temperature, windspeed } = await (0, weather_service_1.getWeatherData)();
        const windSpeedMs = (0, weather_converter_1.kmhToMs)(windspeed);
        const windSpeedMph = (0, weather_converter_1.msToMph)(windSpeedMs);
        res.status(200).json({
            success: true,
            data: {
                temperature_celsius: temperature,
                wind_speed: {
                    ms: windSpeedMs,
                    mph: windSpeedMph
                }
            }
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Ocurrio un error interno al obtener el clima.";
        res.status(500).json({
            success: false,
            error: message
        });
    }
}
