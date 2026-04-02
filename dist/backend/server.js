"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const weather_routes_1 = __importDefault(require("./routes/weather.routes"));
const app = (0, express_1.default)();
const port = 3000;
const frontendPath = path_1.default.join(process.cwd(), "src", "frontend");
app.use(express_1.default.static(frontendPath));
app.use("/api/weather", weather_routes_1.default);
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
