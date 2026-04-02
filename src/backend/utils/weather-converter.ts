function validateWindSpeed(value: number, unitLabel: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`La velocidad del viento en ${unitLabel} debe ser un numero finito.`);
  }

  if (value < 0) {
    throw new Error(`La velocidad del viento en ${unitLabel} no puede ser negativa.`);
  }
}

function roundToTwoDecimals(value: number): number {
  return Number(value.toFixed(2));
}

export function kmhToMs(kmh: number): number {
  validateWindSpeed(kmh, "km/h");
  return roundToTwoDecimals(kmh / 3.6);
}

export function msToMph(ms: number): number {
  validateWindSpeed(ms, "m/s");
  return roundToTwoDecimals(ms * 2.23694);
}