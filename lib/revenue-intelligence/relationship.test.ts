import { describe, it, expect } from "vitest";
import {
  classifyRelationship,
  limiteRecuperacaoDias,
  revenueState,
} from "@/lib/revenue-intelligence/relationship";

describe("limiteRecuperacaoDias", () => {
  it("= ciclo + tolerância (proxy v1)", () => {
    expect(limiteRecuperacaoDias(120, 30)).toBe(150);
    expect(limiteRecuperacaoDias(45, 15)).toBe(60);
  });
});

describe("classifyRelationship", () => {
  const ciclo = 120;
  const limite = 180;

  it("Ativo quando TD ≤ ciclo (inclusive na borda)", () => {
    expect(classifyRelationship(100, ciclo, limite)).toBe("ativo");
    expect(classifyRelationship(120, ciclo, limite)).toBe("ativo");
  });

  it("Em Risco quando ciclo < TD ≤ limite (inclusive na borda)", () => {
    expect(classifyRelationship(121, ciclo, limite)).toBe("em_risco");
    expect(classifyRelationship(180, ciclo, limite)).toBe("em_risco");
  });

  it("Perdido quando TD > limite", () => {
    expect(classifyRelationship(181, ciclo, limite)).toBe("perdido");
    expect(classifyRelationship(999, ciclo, limite)).toBe("perdido");
  });
});

describe("revenueState", () => {
  it("espelha o estado do relacionamento", () => {
    expect(revenueState("ativo")).toBe("protegida");
    expect(revenueState("em_risco")).toBe("em_risco");
    expect(revenueState("perdido")).toBe("perdida");
  });
});
