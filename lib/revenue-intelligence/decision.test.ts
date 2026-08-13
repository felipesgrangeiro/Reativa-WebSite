import { describe, it, expect } from "vitest";
import {
  prioridadeEconomica,
  filaInteligente,
  nivelIntervencao,
  recommendedAction,
  priorityTier,
} from "@/lib/revenue-intelligence/decision";

describe("prioridadeEconomica", () => {
  it("= Receita Recuperável × DT/100", () => {
    expect(prioridadeEconomica(305, 50)).toBe(152.5);
    expect(prioridadeEconomica(1000, 100)).toBe(1000);
    expect(prioridadeEconomica(1000, 0)).toBe(0);
  });
});

describe("filaInteligente", () => {
  it("ordena por Prioridade Econômica desc sem mutar a entrada", () => {
    const input = [
      { id: "a", prioridadeEconomica: 100 },
      { id: "b", prioridadeEconomica: 300 },
      { id: "c", prioridadeEconomica: 200 },
    ];
    const fila = filaInteligente(input);
    expect(fila.map((x) => x.id)).toEqual(["b", "c", "a"]);
    expect(input.map((x) => x.id)).toEqual(["a", "b", "c"]);
  });
});

describe("nivelIntervencao", () => {
  it("classifica por faixa de Receita Recuperável", () => {
    expect(nivelIntervencao(200)).toBe(1); // < 300
    expect(nivelIntervencao(300)).toBe(2); // [300, 800)
    expect(nivelIntervencao(799)).toBe(2);
    expect(nivelIntervencao(800)).toBe(3); // [800, 2000)
    expect(nivelIntervencao(1999)).toBe(3);
    expect(nivelIntervencao(2000)).toBe(4); // ≥ 2000
  });
});

describe("recommendedAction", () => {
  it("escala o canal pelo nível e modula pelo MPR", () => {
    expect(recommendedAction(1, 90).channel).toBe("automacao");
    expect(recommendedAction(2, 50).channel).toBe("whatsapp");
    // Nível 3: MPR baixo → ligação; MPR ok → WhatsApp personalizado
    expect(recommendedAction(3, 20).channel).toBe("ligacao");
    expect(recommendedAction(3, 65).channel).toBe("whatsapp");
    // Nível 4: MPR baixo → oferta; MPR ok → ligação estratégica
    expect(recommendedAction(4, 20).channel).toBe("oferta");
    expect(recommendedAction(4, 80).channel).toBe("ligacao");
  });
});

describe("priorityTier", () => {
  it("classifica relativo ao maior valor da fila", () => {
    expect(priorityTier(100, 100)).toBe("alta");
    expect(priorityTier(70, 100)).toBe("alta");
    expect(priorityTier(50, 100)).toBe("media");
    expect(priorityTier(10, 100)).toBe("baixa");
    expect(priorityTier(5, 0)).toBe("baixa"); // sem base
  });
});
