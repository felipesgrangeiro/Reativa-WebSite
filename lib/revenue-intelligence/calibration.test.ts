import { describe, it, expect } from "vitest";
import {
  calibrateMpr,
  applyCalibration,
  cohortKeyFor,
  summarizeCalibration,
  MIN_CONFIDENCE_N,
  FACTOR_MIN,
  FACTOR_MAX,
  type CalibrationObservation,
} from "@/lib/revenue-intelligence/calibration";
import { buildRelationshipEconomics } from "@/lib/revenue-intelligence/pipeline";
import type {
  Procedure,
  ReactivationPatient,
} from "@/types/reactivation-intelligence";

/** Gera n observações de uma coorte com MPR previsto e nº de retornos. */
function cohort(
  key: string,
  predictedMpr: number,
  n: number,
  returns: number
): CalibrationObservation[] {
  return Array.from({ length: n }, (_, i) => ({
    cohortKey: key,
    predictedMpr,
    returned: i < returns,
  }));
}

describe("cohortKeyFor", () => {
  it("classifica por faixa de MPR (alta/média/baixa)", () => {
    expect(cohortKeyFor("Botox", 80)).toBe("Botox|alta");
    expect(cohortKeyFor("Botox", 50)).toBe("Botox|media");
    expect(cohortKeyFor("Botox", 20)).toBe("Botox|baixa");
  });
});

describe("calibrateMpr — encolhimento por confiança", () => {
  it("coorte pequena mantém fator próximo de 1", () => {
    // 3 contatos, previa 70%, ninguém voltou → observado 0%, mas amostra mínima.
    const factors = calibrateMpr(cohort("Botox|alta", 70, 3, 0));
    const f = factors["Botox|alta"];
    // w = 3/(3+20) ≈ 0.13 → fator ≈ 1·0.87 + 0·0.13 = 0.87 (perto de 1).
    expect(f).toBeGreaterThan(0.82);
    expect(f).toBeLessThanOrEqual(1);
  });

  it("coorte madura ajusta o MPR para baixo quando o observado é menor", () => {
    // 40 contatos, previa 70%, 20 voltaram (50% observado < 70% previsto).
    const factors = calibrateMpr(cohort("Botox|alta", 70, 40, 20));
    const f = factors["Botox|alta"];
    expect(f).toBeLessThan(0.9); // puxa o MPR para baixo
    expect(f).toBeGreaterThan(FACTOR_MIN);
  });

  it("coorte madura ajusta para cima quando o observado é maior", () => {
    // 50 contatos, previa 40%, 30 voltaram (60% observado).
    const factors = calibrateMpr(cohort("Limpeza|media", 40, 50, 30));
    expect(factors["Limpeza|media"]).toBeGreaterThan(1);
  });

  it("não calibra coorte sem previsão (predictedMpr 0)", () => {
    const factors = calibrateMpr(cohort("X|baixa", 0, 30, 10));
    expect(factors["X|baixa"]).toBeUndefined();
  });

  it("limita o fator entre FACTOR_MIN e FACTOR_MAX", () => {
    // Observado extremo (todos voltaram) sobre previsão baixa → fator estouraria.
    const up = calibrateMpr(cohort("A|baixa", 10, 100, 100));
    expect(up["A|baixa"]).toBeLessThanOrEqual(FACTOR_MAX);
    // Observado zero sobre previsão alta → fator despencaria.
    const down = calibrateMpr(cohort("B|alta", 90, 100, 0));
    expect(down["B|alta"]).toBeGreaterThanOrEqual(FACTOR_MIN);
  });
});

describe("applyCalibration", () => {
  const factors = { "Botox|alta": 0.8, "Limpeza|media": 1.25 };

  it("aplica o fator da coorte ao MPR bruto", () => {
    expect(applyCalibration(70, "Botox|alta", factors)).toBeCloseTo(56, 5);
    expect(applyCalibration(40, "Limpeza|media", factors)).toBeCloseTo(50, 5);
  });

  it("sem fator para a coorte, mantém o MPR bruto", () => {
    expect(applyCalibration(63, "Desconhecida|alta", factors)).toBe(63);
    expect(applyCalibration(63, "qualquer", {})).toBe(63);
  });

  it("MPR calibrado nunca passa de 0 a 100", () => {
    expect(applyCalibration(90, "k", { k: FACTOR_MAX })).toBeLessThanOrEqual(100);
    expect(applyCalibration(5, "k", { k: FACTOR_MIN })).toBeGreaterThanOrEqual(0);
    // 90 × 1.4 = 126 → clampa em 100.
    expect(applyCalibration(90, "k", { k: 1.4 })).toBe(100);
  });
});

describe("summarizeCalibration — selo Proxy vs Calibrado", () => {
  it("sem observações → inativo (Proxy)", () => {
    const s = summarizeCalibration([]);
    expect(s.active).toBe(false);
    expect(s.matureCohorts).toBe(0);
  });

  it("coorte pequena (< confiança mínima) → inativo (Proxy)", () => {
    const s = summarizeCalibration(cohort("Botox|alta", 70, MIN_CONFIDENCE_N - 1, 5));
    expect(s.active).toBe(false);
  });

  it("coorte madura (≥ confiança mínima) → ativo (Calibrado)", () => {
    const s = summarizeCalibration(cohort("Botox|alta", 70, MIN_CONFIDENCE_N, 10));
    expect(s.active).toBe(true);
    expect(s.matureCohorts).toBe(1);
    expect(s.totalObservations).toBe(MIN_CONFIDENCE_N);
  });
});

describe("fluxo de serviço — sem obs mantém bruto; obs maduras calibram", () => {
  it("sem observações, calibrateMpr retorna {} (MPR bruto preservado)", () => {
    expect(calibrateMpr([])).toEqual({});
  });

  it("observações maduras produzem fator que altera o MPR", () => {
    const factors = calibrateMpr(cohort("Botox|alta", 70, 40, 20)); // 50% obs
    const key = "Botox|alta";
    expect(factors[key]).toBeLessThan(1);
    // ponta-a-ponta: o MPR bruto é ajustado pelo fator aprendido.
    expect(applyCalibration(70, key, factors)).toBeLessThan(70);
  });
});

describe("hook opt-in no buildRelationshipEconomics", () => {
  const NOW = new Date("2024-06-01T12:00:00.000Z");
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const botox: Procedure = {
    id: "botox",
    nome: "Botox",
    categoria: "Injetável",
    ticketMedio: 900,
    cicloEsperadoDias: 120,
    toleranciaDias: 30,
    ativo: true,
  };
  const patient: ReactivationPatient = {
    id: "Maria",
    nome: "Maria",
    telefone: "1",
    procedureId: "botox",
    dataUltimoProcedimento: new Date(NOW.getTime() - 150 * MS_PER_DAY).toISOString(),
    totalVisitas: 5,
    engajamento: 0.6,
  };

  it("sem fatores, mantém o MPR bruto (comportamento atual)", () => {
    const base = buildRelationshipEconomics([patient], [botox], { now: NOW })[0];
    const semFatores = buildRelationshipEconomics([patient], [botox], {
      now: NOW,
      calibration: {},
    })[0];
    expect(semFatores.mpr).toBe(base.mpr);
  });

  it("com fator para a coorte, aplica a calibração só no MPR", () => {
    const base = buildRelationshipEconomics([patient], [botox], { now: NOW })[0];
    const key = cohortKeyFor("Botox", base.mpr);
    const calibrated = buildRelationshipEconomics([patient], [botox], {
      now: NOW,
      calibration: { [key]: 0.8 },
    })[0];

    expect(calibrated.mpr).toBeCloseTo(applyCalibration(base.mpr, key, { [key]: 0.8 }), 5);
    expect(calibrated.mpr).toBeLessThan(base.mpr);
    // VER / HR / DT intactos — só o MPR muda.
    expect(calibrated.ver).toBe(base.ver);
    expect(calibrated.hr).toBe(base.hr);
    expect(calibrated.dt).toBe(base.dt);
  });
});
