"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kmhToMs = kmhToMs;
exports.msToMph = msToMph;
function validateWindSpeed(value, unitLabel) {
    if (!Number.isFinite(value)) {
        throw new Error(`La velocidad del viento en ${unitLabel} debe ser un numero finito.`);
    }
    if (value < 0) {
        throw new Error(`La velocidad del viento en ${unitLabel} no puede ser negativa.`);
    }
}
function roundToTwoDecimals(value) {
    return Number(value.toFixed(2));
}
function kmhToMs(kmh) {
    validateWindSpeed(kmh, "km/h");
    return roundToTwoDecimals(kmh / 3.6);
}
function msToMph(ms) {
    validateWindSpeed(ms, "m/s");
    return roundToTwoDecimals(ms * 2.23694);
}
