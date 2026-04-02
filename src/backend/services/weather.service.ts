const OPEN_METEO_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=39.47&longitude=-0.38&current_weather=true";

interface OpenMeteoCurrentWeather {
  temperature?: number;
  windspeed?: number;
}

interface OpenMeteoResponse {
  current_weather?: OpenMeteoCurrentWeather;
}

export interface WeatherData {
  temperature: number;
  windspeed: number;
}

export class WeatherServiceError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 502) {
    super(message);
    this.name = "WeatherServiceError";
    this.statusCode = statusCode;
  }
}

export async function getWeatherData(): Promise<WeatherData> {
  let response: Response;

  try {
    response = await fetch(OPEN_METEO_URL);
  } catch {
    throw new WeatherServiceError("No se pudo conectar con Open-Meteo.");
  }

  if (!response.ok) {
    throw new WeatherServiceError(
      `Open-Meteo respondio con estado ${response.status}.`
    );
  }

  let payload: OpenMeteoResponse;

  try {
    payload = (await response.json()) as OpenMeteoResponse;
  } catch {
    throw new WeatherServiceError("Open-Meteo devolvio un JSON invalido.");
  }

  const currentWeather = payload.current_weather;

  if (
    !currentWeather ||
    typeof currentWeather.temperature !== "number" ||
    typeof currentWeather.windspeed !== "number"
  ) {
    throw new WeatherServiceError(
      "Open-Meteo no devolvio current_weather con temperature y windspeed validos."
    );
  }

  return {
    temperature: currentWeather.temperature,
    windspeed: currentWeather.windspeed
  };
}