import { describe, it, expect } from "vitest";
import { buildRelationshipEconomics } from "@/lib/revenue-intelligence/pipeline";
import { buildSegmentsFromEconomics } from "@/lib/revenue-intelligence/segments";
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
  toleranciaDias: 30, // limite = 180
  ativo: true,
};

const preenchimento: Procedure = {
  id: "preench",
  nome: "Preenchimento",
  categoria: "Injetável",
  ticketMedio: 1800, // alto VEP
  cicloEsperadoDias: 120,
  toleranciaDias: 30,
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
    dataUltimoProcedimento: new Date(
      NOW.getTime() - td * MS_PER_DAY
    ).toISOString(),
    totalVisitas: 5,
    engajamento: 0.6,
    ...o,
  };
}

// 2 em risco no Botox (150/175), 1 ativo (100), 1 perdido (200),
// 1 em risco no Preenchimento (150, alto ticket).
const economics = buildRelationshipEconomics(
  [
    patient(150, { id: "Maria" }),
    patient(175, { id: "Joao" }),
    patient(100, { id: "Ana" }),
    patient(200, { id: "Pedro" }),
    patient(150, { id: "Bia", procedureId: "preench", totalVisitas: 8 }),
  ],
  [botox, preenchimento],
  { now: NOW }
);

describe("buildSegmentsFromEconomics", () => {
  const data = buildSegmentsFromEconomics(economics);

  it("considera apenas relacionamentos Em Risco", () => {
    // 3 em risco (Maria, Joao, Bia); Ana (ativo) e Pedro (perdido) fora.
    expect(data.summary.monitoredPatients).toBe(5); // toda a carteira
    const allMembers = [
      ...data.valueSegments,
      ...data.procedureSegments,
    ].flatMap((s) => s.members.map((m) => m.patientId));
    expect(allMembers).not.toContain("Ana");
    expect(allMembers).not.toContain("Pedro");
  });

  it("segmenta por procedimento ordenado por receita recuperável", () => {
    const names = data.procedureSegments.map((s) => s.label);
    expect(names).toContain("Botox");
    expect(names).toContain("Preenchimento");
    const revenues = data.procedureSegments.map((s) => s.revenue);
    expect(revenues).toEqual([...revenues].sort((a, b) => b - a));
  });

  it("expõe o MPR como score do membro (0–100)", () => {
    const member = data.procedureSegments[0].members[0];
    expect(member.rScore).toBeGreaterThanOrEqual(0);
    expect(member.rScore).toBeLessThanOrEqual(100);
  });

  it("identifica Alto Ticket em Risco pelo VEP", () => {
    const highTicket = data.behaviorSegments.find(
      (s) => s.id === "behavior-high-ticket"
    );
    expect(highTicket?.members.some((m) => m.patientName === "Bia")).toBe(true);
  });

  it("soma a receita em risco no resumo e conta segmentos não vazios", () => {
    expect(data.summary.revenueAtRisk).toBeGreaterThan(0);
    const nonEmpty =
      data.valueSegments.length +
      data.procedureSegments.length +
      data.behaviorSegments.length +
      data.actionSegments.length;
    expect(data.summary.activeSegments).toBe(nonEmpty);
  });

  it("não gera segmentos sem ninguém em risco", () => {
    const onlyActive = buildRelationshipEconomics(
      [patient(100, { id: "Ana" })],
      [botox],
      { now: NOW }
    );
    const empty = buildSegmentsFromEconomics(onlyActive);
    expect(empty.summary.activeSegments).toBe(0);
    expect(empty.valueSegments).toHaveLength(0);
  });
});
