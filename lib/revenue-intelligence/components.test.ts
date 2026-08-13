import { describe, it, expect } from "vitest";
import {
  computeMprComponents,
  engagementProxy,
  intervalsFromDates,
} from "@/lib/revenue-intelligence/components";

describe("intervalsFromDates", () => {
  it("ordena por data e devolve os intervalos em dias", () => {
    expect(
      intervalsFromDates([
        "2024-04-01T00:00:00.000Z",
        "2024-01-01T00:00:00.000Z", // fora de ordem de propósito
        "2024-02-01T00:00:00.000Z",
      ])
    ).toEqual([31, 60]); // jan→fev = 31, fev→abr = 60
  });

  it("descarta intervalos não positivos (mesmo dia / duplicata)", () => {
    expect(
      intervalsFromDates([
        "2024-01-01T00:00:00.000Z",
        "2024-01-01T10:00:00.000Z",
        "2024-01-15T00:00:00.000Z",
      ])
    ).toEqual([14]);
  });

  it("lista vazia com menos de duas datas", () => {
    expect(intervalsFromDates([])).toEqual([]);
    expect(intervalsFromDates(["2024-01-01T00:00:00.000Z"])).toEqual([]);
  });
});

describe("engagementProxy", () => {
  it("cresce com a frequência e satura em 1", () => {
    expect(engagementProxy(0)).toBeCloseTo(0.3, 5);
    expect(engagementProxy(5)).toBeCloseTo(0.7, 5);
    expect(engagementProxy(100)).toBe(1);
  });
});

describe("computeMprComponents", () => {
  // Mesma base do pipeline.test (Botox, ciclo 120, limite 180), sozinho na
  // carteira → monetary normalizado = 100; TD = 150 → DT = 50.
  const base = {
    diasDecorridos: 150,
    ciclo: 120,
    limite: 180,
    monetary: 4500,
    maxMonetary: 4500,
    totalVisitas: 5,
  };

  it("reproduz o caso de fallback (engajamento) do pipeline", () => {
    const c = computeMprComponents({ ...base, engajamento: 0.6 });
    expect(c.ver).toBeCloseTo(66.6667, 3);
    expect(c.hr).toBeCloseTo(53, 5); // 0,5×50 + 0,3×60 + 0,2×50
    expect(c.dt).toBeCloseTo(50, 5);
    expect(c.mpr).toBeCloseTo(55.2167, 3);
  });

  it("intervalos reais regulares/aderentes elevam o HR vs fallback", () => {
    const real = computeMprComponents({
      ...base,
      intervalosDias: [120, 120, 120],
    });
    const fallback = computeMprComponents({ ...base, engajamento: 0.6 });
    // Regularity=100 e CycleAdherence=100 → HR maior que o fallback.
    expect(real.hr).toBeGreaterThan(fallback.hr);
    expect(real.mpr).toBeGreaterThan(fallback.mpr);
  });

  it("sem engajamento, o fallback usa o proxy derivado das visitas", () => {
    // engagementProxy(5) = 0,7 → regularity = 70 (sem intervalos).
    const c = computeMprComponents(base);
    expect(c.regularity).toBeCloseTo(70, 5);
  });
});
