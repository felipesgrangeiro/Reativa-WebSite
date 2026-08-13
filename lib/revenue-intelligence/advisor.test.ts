import { describe, it, expect } from "vitest";
import { buildRelationshipEconomics } from "@/lib/revenue-intelligence/pipeline";
import {
  buildAdvisorInsights,
  buildDiagnosisActions,
  buildActiveStrategy,
} from "@/lib/revenue-intelligence/advisor";
import type {
  Procedure,
  ReactivationPatient,
} from "@/types/reactivation-intelligence";

const NOW = new Date("2024-06-01T12:00:00.000Z");
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const botox: Procedure = {
  id: "botox",
  nome: "Botox",
  categoria: "Injetável",
  ticketMedio: 900,
  cicloEsperadoDias: 120,
  toleranciaDias: 30, // ignorado pelo motor (limite usa a tolerância global)
  ativo: true,
};

function patient(
  td: number,
  o: Partial<ReactivationPatient> & { id: string }
): ReactivationPatient {
  return {
    nome: o.id,
    telefone: "1",
    procedureId: "botox",
    dataUltimoProcedimento: new Date(NOW.getTime() - td * MS_PER_DAY).toISOString(),
    totalVisitas: 5,
    engajamento: 0.6,
    ...o,
  };
}

// limite = 120 + 40 (global) = 160 → 2 em risco (150/155), 1 ativo (100), 1 perdido (200)
const economics = buildRelationshipEconomics(
  [
    patient(150, { id: "Maria" }),
    patient(155, { id: "Joao" }),
    patient(100, { id: "Ana" }),
    patient(200, { id: "Pedro" }),
  ],
  [botox],
  { now: NOW }
);

describe("buildActiveStrategy (oficial)", () => {
  it("deriva do procedimento com mais receita recuperável", () => {
    const s = buildActiveStrategy(economics)!;
    expect(s).not.toBeNull();
    expect(s.procedureName).toBe("Botox");
    expect(s.criticalPatients).toBe(2); // só em risco
    expect(s.revenueAtRisk).toBeGreaterThan(0);
    expect(s.patientNames).toContain("Maria");
    expect(["whatsapp", "ligacao", "oferta", "consulta"]).toContain(s.channelType);
  });

  it("retorna null sem ninguém em risco", () => {
    const onlyActive = buildRelationshipEconomics(
      [patient(100, { id: "Ana" })],
      [botox],
      { now: NOW }
    );
    expect(buildActiveStrategy(onlyActive)).toBeNull();
  });
});

describe("insights e ações (1:1)", () => {
  it("gera insight e ação de maior vazamento + perdidos", () => {
    const insights = buildAdvisorInsights(economics);
    const actions = buildDiagnosisActions(economics);
    expect(insights.map((i) => i.id)).toContain("top-leak");
    expect(insights.map((i) => i.id)).toContain("loss-risk");
    expect(actions).toHaveLength(insights.length);
    expect(actions[0].medal).toBe("🥇");
  });

  it("fala nos conceitos oficiais (Prioridade Econômica + Nível de Intervenção)", () => {
    const insights = buildAdvisorInsights(economics);
    const actions = buildDiagnosisActions(economics);

    const topLeakInsight = insights.find((i) => i.id === "top-leak")!;
    expect(topLeakInsight.body).toMatch(/Prioridade Econômica/);
    expect(topLeakInsight.body).toMatch(/Nível de Intervenção/);

    // Ações de procedimento carregam o Nível; a de perdidos não.
    const topLeakAction = actions.find((a) => a.id === "top-leak")!;
    expect(topLeakAction.interventionLabel).toBeTruthy();
    const lossAction = actions.find((a) => a.id === "loss-risk")!;
    expect(lossAction.interventionLabel).toBeUndefined();
  });
});
