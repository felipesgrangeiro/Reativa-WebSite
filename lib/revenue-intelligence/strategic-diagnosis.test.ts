import { describe, it, expect } from "vitest";
import { buildRelationshipEconomics } from "@/lib/revenue-intelligence/pipeline";
import { buildStrategicDiagnosis } from "@/lib/revenue-intelligence/strategic-diagnosis";
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
  ticketMedio: 1500,
  cicloEsperadoDias: 120,
  toleranciaDias: 30, // ignorado: limite usa a tolerância global 40 → 160 (150/160 em risco)
  ativo: true,
};

function patient(td: number, id: string): ReactivationPatient {
  return {
    id,
    nome: id,
    telefone: "1",
    procedureId: "botox",
    dataUltimoProcedimento: new Date(NOW.getTime() - td * MS_PER_DAY).toISOString(),
    totalVisitas: 5,
    engajamento: 0.6,
  };
}

describe("buildStrategicDiagnosis", () => {
  it("com carteira em risco: gera indicadores, recomendações e conclusão", () => {
    const economics = buildRelationshipEconomics(
      [patient(150, "Maria"), patient(160, "Joao"), patient(100, "Ana")],
      [botox],
      { now: NOW }
    );
    const d = buildStrategicDiagnosis(economics);

    expect(d.hasOpportunity).toBe(true);
    expect(d.indicators.pacientesEmRisco).toBe(2); // Ana (100) é ativo
    expect(d.indicators.receitaRecuperavel).toBeGreaterThan(0);
    expect(d.indicators.potencialAcionavel).toBe(
      d.indicators.receitaRecuperavel
    );
    expect(d.indicators.mprMedio).toBeGreaterThanOrEqual(0);

    // 4 recomendações oficiais, sem citar procedimentos.
    expect(d.recommendations.map((r) => r.id)).toEqual([
      "acao-prioritaria",
      "canal-recomendado",
      "segmento-prioritario",
      "janela-ideal",
    ]);
    const blob = JSON.stringify(d.recommendations);
    expect(blob).not.toContain("Botox");

    expect(d.interpretation).toMatch(/oportunidades/i);
    expect(d.conclusion).toMatch(/recupera/i);
  });

  it("a ação prioritária cita o nº de pacientes e a janela cita o prazo", () => {
    const economics = buildRelationshipEconomics(
      [patient(150, "Maria"), patient(160, "Joao")],
      [botox],
      { now: NOW }
    );
    const d = buildStrategicDiagnosis(economics);
    const acao = d.recommendations.find((r) => r.id === "acao-prioritaria")!;
    expect(acao.body).toContain("2 pacientes");
    const janela = d.recommendations.find((r) => r.id === "janela-ideal")!;
    expect(janela.body).toContain(`${d.indicators.prazoIdealDias} dias`);
  });

  it("sem ninguém em risco: sem recomendações e hasOpportunity falso", () => {
    const economics = buildRelationshipEconomics(
      [patient(100, "Ana")], // ativo
      [botox],
      { now: NOW }
    );
    const d = buildStrategicDiagnosis(economics);
    expect(d.hasOpportunity).toBe(false);
    expect(d.recommendations).toEqual([]);
    expect(d.indicators.pacientesEmRisco).toBe(0);
    expect(d.interpretation).toMatch(/saudável|não encontrou/i);
  });

  it("carteira vazia não quebra", () => {
    const d = buildStrategicDiagnosis([]);
    expect(d.hasOpportunity).toBe(false);
    expect(d.indicators.receitaRecuperavel).toBe(0);
    expect(d.indicators.potencialAcionavel).toBe(0);
  });
});
