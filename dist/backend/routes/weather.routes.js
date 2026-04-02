"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const weather_controller_1 = require("../controllers/weather.controller");
const weatherRouter = (0, express_1.Router)();
weatherRouter.get("/", weather_controller_1.getWeather);
exports.default = weatherRouter;
