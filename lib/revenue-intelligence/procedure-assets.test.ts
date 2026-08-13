import { describe, it, expect } from "vitest";
import { buildRelationshipEconomics } from "@/lib/revenue-intelligence/pipeline";
import { buildProcedureAssetsFromEconomics } from "@/lib/revenue-intelligence/procedure-assets";
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
  toleranciaDias: 30,
  ativo: true,
};

const preenchimento: Procedure = {
  id: "preench",
  nome: "Preenchimento",
  categoria: "Injetável",
  ticketMedio: 1800, // maior ticket, ciclo mais curto
  cicloEsperadoDias: 90,
  toleranciaDias: 30,
  ativo: true,
};

function patient(
  procedureId: string,
  o: { id: string }
): ReactivationPatient {
  return {
    id: o.id,
    nome: o.id,
    telefone: "1",
    procedureId,
    dataUltimoProcedimento: new Date(NOW.getTime() - 60 * MS_PER_DAY).toISOString(),
    totalVisitas: 5,
    engajamento: 0.6,
  };
}

// 3 pacientes no Botox, 1 no Preenchimento.
const economics = buildRelationshipEconomics(
  [
    patient("botox", { id: "Maria" }),
    patient("botox", { id: "Joao" }),
    patient("botox", { id: "Ana" }),
    patient("preench", { id: "Bia" }),
  ],
  [botox, preenchimento],
  { now: NOW }
);

describe("buildProcedureAssetsFromEconomics", () => {
  const assets = buildProcedureAssetsFromEconomics(
    [botox, preenchimento],
    economics
  );
  const byId = new Map(assets.map((a) => [a.procedure.id, a]));

  it("conta pacientes por procedimento a partir da economia real", () => {
    expect(byId.get("botox")!.patientsMonitored).toBe(3);
    expect(byId.get("preench")!.patientsMonitored).toBe(1);
  });

  it("calcula receita (Σ VEP) e participação somando 100%", () => {
    const botoxA = byId.get("botox")!;
    const preenchA = byId.get("preench")!;
    expect(botoxA.revenue).toBeGreaterThan(0);
    expect(botoxA.sharePct + preenchA.sharePct).toBe(100);
  });

  it("atribui os selos de destaque", () => {
    // Botox: mais pacientes (3) e maior receita total (3 × ticket).
    expect(byId.get("botox")!.badges).toContain("most_patients");
    expect(byId.get("botox")!.badges).toContain("top_revenue");
    // Preenchimento: maior ticket e ciclo mais curto.
    expect(byId.get("preench")!.badges).toContain("top_ticket");
    expect(byId.get("preench")!.badges).toContain("shortest_cycle");
  });

  it("zera procedimentos sem relacionamentos na economia", () => {
    const semVisita: Procedure = { ...botox, id: "x", nome: "Inexistente" };
    const a = buildProcedureAssetsFromEconomics([semVisita], []);
    expect(a[0].patientsMonitored).toBe(0);
    expect(a[0].revenue).toBe(0);
    expect(a[0].sharePct).toBe(0);
  });
});
