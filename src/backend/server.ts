import express from "express";
import path from "path";
import weatherRouter from "./routes/weather.routes";

const app = express();
const port = 3000;
const frontendPath = path.join(process.cwd(), "src", "frontend");

app.use(express.static(frontendPath));
app.use("/api/weather", weatherRouter);

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});