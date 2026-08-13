import { describe, it, expect } from "vitest";
import { buildRelationshipEconomics } from "@/lib/revenue-intelligence/pipeline";
import {
  buildRecoveryOpportunities,
  buildStrategyImpact,
  buildExecutionPlan,
} from "@/lib/revenue-intelligence/opportunities";
import type {
  Procedure,
  ReactivationPatient,
} from "@/types/reactivation-intelligence";
import type { RecoveryOpportunity } from "@/types/revenue-intelligence";

const NOW = new Date("2024-06-01T12:00:00.000Z");
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const botox: Procedure = {
  id: "botox",
  nome: "Botox",
  categoria: "Injetável",
  ticketMedio: 1800, // alto ticket → maior receita recuperável
  cicloEsperadoDias: 120,
  toleranciaDias: 30, // ignorado: limite usa a tolerância global 40 → 160 (150/160 em risco)
  ativo: true,
};

const limpeza: Procedure = {
  id: "limpeza",
  nome: "Limpeza de Pele",
  categoria: "Estética",
  ticketMedio: 300,
  cicloEsperadoDias: 30,
  toleranciaDias: 15,
  ativo: true,
};

function patient(
  procedureId: string,
  td: number,
  o: { id: string }
): ReactivationPatient {
  return {
    id: o.id,
    nome: o.id,
    telefone: "1",
    procedureId,
    dataUltimoProcedimento: new Date(
      NOW.getTime() - td * MS_PER_DAY
    ).toISOString(),
    totalVisitas: 5,
    engajamento: 0.6,
  };
}

// Botox: 2 em risco (150/160). Limpeza: 3 em risco (35/38/40), ciclo curto.
const economics = buildRelationshipEconomics(
  [
    patient("botox", 150, { id: "Maria" }),
    patient("botox", 160, { id: "Joao" }),
    patient("limpeza", 35, { id: "Ana" }),
    patient("limpeza", 38, { id: "Bia" }),
    patient("limpeza", 40, { id: "Rui" }),
    patient("botox", 100, { id: "AtivoBotox" }), // ativo, fora
  ],
  [botox, limpeza],
  { now: NOW }
);

describe("buildRecoveryOpportunities", () => {
  const opps = buildRecoveryOpportunities(economics);

  it("agrupa apenas Em Risco por procedimento", () => {
    const names = opps.map((o) => o.procedureName).sort();
    expect(names).toEqual(["Botox", "Limpeza de Pele"]);
    const botoxOpp = opps.find((o) => o.procedureName === "Botox")!;
    expect(botoxOpp.relationshipsAtRisk).toBe(2); // o ativo não conta
  });

  it("expõe os indicadores oficiais (tier, nível, justificativa)", () => {
    const o = opps[0];
    expect(["alta", "media", "baixa"]).toContain(o.prioridadeTier);
    expect(o.interventionLabel).toBeTruthy();
    expect(o.justification).toBeTruthy();
  });

  it("atribui justificativas de superlativo distintas", () => {
    const botoxOpp = opps.find((o) => o.procedureName === "Botox")!;
    const limpezaOpp = opps.find((o) => o.procedureName === "Limpeza de Pele")!;
    // Botox lidera receita recuperável (alto ticket).
    expect(botoxOpp.justification).toMatch(/receita recuperável/i);
    // Limpeza lidera volume de relacionamentos.
    expect(limpezaOpp.justification).toMatch(/volume|probabilidade|janela/i);
  });

  it("ordena por Prioridade Econômica desc", () => {
    const prios = opps.map((o) => o.prioridadeEconomica);
    expect(prios).toEqual([...prios].sort((a, b) => b - a));
  });
});

describe("buildStrategyImpact / buildExecutionPlan", () => {
  const opps = buildRecoveryOpportunities(economics);

  it("consolida o impacto da estratégia", () => {
    const impact = buildStrategyImpact(opps);
    expect(impact.relationships).toBe(5); // 2 botox + 3 limpeza
    expect(impact.receitaRecuperavel).toBeGreaterThan(0);
    expect(impact.potencialAcionavel).toBeGreaterThan(0);
    expect(impact.mprMedio).toBeGreaterThanOrEqual(0);
  });

  it("não reaplica MPR sobre a Receita Recuperável", () => {
    const impact = buildStrategyImpact([
      {
        procedureName: "Botox",
        receitaRecuperavel: 1000,
        relationshipsAtRisk: 2,
        avgMpr: 50,
        prioridadeEconomica: 600,
        prioridadeTier: "alta",
        interventionLevel: 3,
        interventionLabel: "Personalizado",
        cicloDias: 120,
        limiteRecuperacaoDias: 160,
        avgRemainingDays: 10,
        justification: "Teste",
      },
    ] satisfies RecoveryOpportunity[]);

    expect(impact.receitaRecuperavel).toBe(1000);
    expect(impact.potencialAcionavel).toBe(1000);
  });

  it("gera um passo por oportunidade, em ordem", () => {
    const plan = buildExecutionPlan(opps);
    expect(plan).toHaveLength(opps.length);
    expect(plan[0].prioridade).toBe(1);
    expect(plan[0].acao).toContain(opps[0].procedureName);
  });

  it("impacto vazio sem oportunidades", () => {
    const empty = buildStrategyImpact([]);
    expect(empty.relationships).toBe(0);
    expect(empty.prazoIdealDias).toBe(0);
  });
});
