import { Request, Response } from "express";
import { msToMph, kmhToMs } from "../utils/weather-converter";
import { getWeatherData } from "../services/weather.service";

export async function getWeather(req: Request, res: Response): Promise<void> {
  try {
    const { temperature, windspeed } = await getWeatherData();
    const windSpeedMs = kmhToMs(windspeed);
    const windSpeedMph = msToMph(windSpeedMs);

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
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ocurrio un error interno al obtener el clima.";

    res.status(500).json({
      success: false,
      error: message
    });
  }
}