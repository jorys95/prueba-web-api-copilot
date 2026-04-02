import { kmhToMs, msToMph } from "../src/backend/utils/weather-converter";

describe("kmhToMs", () => {
  it("debe convertir 10 km/h a m/s con 2 decimales", () => {
    expect(kmhToMs(10)).toBe(2.78);
  });

  it("debe convertir 36 km/h a m/s", () => {
    expect(kmhToMs(36)).toBe(10);
  });

  it("debe devolver 0 cuando recibe 0", () => {
    expect(kmhToMs(0)).toBe(0);
  });

  it("debe lanzar error cuando recibe un valor negativo", () => {
    expect(() => kmhToMs(-1)).toThrow("no puede ser negativa");
  });
});

describe("msToMph", () => {
  it("debe convertir 10 m/s a mph con 2 decimales", () => {
    expect(msToMph(10)).toBe(22.37);
  });

  it("debe convertir 5.5 m/s a mph", () => {
    expect(msToMph(5.5)).toBe(12.3);
  });

  it("debe devolver 0 cuando recibe 0", () => {
    expect(msToMph(0)).toBe(0);
  });

  it("debe lanzar error cuando recibe un valor negativo", () => {
    expect(() => msToMph(-0.01)).toThrow("no puede ser negativa");
  });
});