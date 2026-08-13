import { describe, it, expect } from "vitest";
import {
  clamp,
  computeVER,
  computeHR,
  computeDT,
  computeMPR,
  computeVEP,
  computeRegularity,
  computeCycleAdherence,
  receitaEsperada,
  receitaNaoRealizada,
  receitaRecuperavel,
} from "@/lib/revenue-intelligence/revenue";

describe("clamp", () => {
  it("limita ao intervalo [0,100] por padrão", () => {
    expect(clamp(-5)).toBe(0);
    expect(clamp(150)).toBe(100);
    expect(clamp(42)).toBe(42);
  });
});

describe("computeVER", () => {
  it("= 0,60·Monetary + 0,40·Recency", () => {
    expect(computeVER(100, 50)).toBe(80); // 60 + 20
    expect(computeVER(0, 0)).toBe(0);
    expect(computeVER(100, 100)).toBe(100);
  });
});

describe("computeHR", () => {
  it("= 0,50·ReturnCount + 0,30·Regularity + 0,20·CycleAdherence", () => {
    expect(computeHR(50, 60, 50)).toBe(53); // 25 + 18 + 10
    expect(computeHR(100, 100, 100)).toBe(100);
  });
});

describe("computeRegularity", () => {
  it("intervalos perfeitamente uniformes → 100 (CV = 0)", () => {
    expect(computeRegularity([90, 90, 90])).toBe(100);
  });

  it("intervalos variáveis reduzem a nota (1 − CV)", () => {
    // [60,120] → média 90, desvio 30, CV = 1/3 → 100×(1−1/3) ≈ 66,67.
    expect(computeRegularity([60, 120])).toBeCloseTo(66.6667, 3);
  });

  it("null com menos de 2 intervalos (variabilidade não mensurável)", () => {
    expect(computeRegularity([])).toBeNull();
    expect(computeRegularity([90])).toBeNull();
  });
});

describe("computeCycleAdherence", () => {
  it("intervalos iguais ao ciclo → 100 (desvio zero)", () => {
    expect(computeCycleAdherence([120, 120], 120)).toBe(100);
  });

  it("desvio relativo médio reduz a aderência", () => {
    // ciclo 100; [80,140] → desvios 0,2 e 0,4 → média 0,3 → 100×(1−0,3)=70.
    expect(computeCycleAdherence([80, 140], 100)).toBeCloseTo(70, 5);
  });

  it("null sem intervalos ou com ciclo inválido", () => {
    expect(computeCycleAdherence([], 120)).toBeNull();
    expect(computeCycleAdherence([120], 0)).toBeNull();
  });
});

describe("computeDT", () => {
  it("0 dentro do ciclo, escala linear até 100 no limite", () => {
    expect(computeDT(100, 120, 180)).toBe(0); // antes do ciclo
    expect(computeDT(120, 120, 180)).toBe(0); // borda do ciclo
    expect(computeDT(150, 120, 180)).toBe(50); // meio
    expect(computeDT(180, 120, 180)).toBe(100); // limite
    expect(computeDT(200, 120, 180)).toBe(100); // além do limite (clamp)
  });

  it("trata span não positivo sem dividir por zero", () => {
    expect(computeDT(130, 120, 120)).toBe(100); // TD > ciclo
    expect(computeDT(110, 120, 120)).toBe(0); // TD ≤ ciclo
  });
});

describe("computeMPR", () => {
  it("= 0,25·VER + 0,35·HR + 0,40·(100 − DT)", () => {
    // 0.25*80 + 0.35*53 + 0.40*(100-50) = 20 + 18.55 + 20 = 58.55
    expect(computeMPR(80, 53, 50)).toBeCloseTo(58.55, 5);
    expect(computeMPR(100, 100, 0)).toBe(100);
  });
});

describe("computeVEP", () => {
  it("= 0,70·TicketMédioHistórico + 0,30·ÚltimoTicket", () => {
    expect(computeVEP(900, 600)).toBe(810); // 630 + 180
    expect(computeVEP(900, 900)).toBe(900);
  });
});

describe("cadeia de receita", () => {
  it("Receita Esperada = VEP × MPR/100", () => {
    expect(receitaEsperada(810, 50)).toBe(405);
  });

  it("Receita Não Realizada = max(0, Esperada − Real)", () => {
    expect(receitaNaoRealizada(405, 100)).toBe(305);
    expect(receitaNaoRealizada(100, 300)).toBe(0);
  });

  it("Receita Recuperável só existe para Em Risco", () => {
    expect(receitaRecuperavel(305, "em_risco")).toBe(305);
    expect(receitaRecuperavel(305, "ativo")).toBe(0);
    expect(receitaRecuperavel(305, "perdido")).toBe(0);
  });
});
