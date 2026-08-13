import { describe, expect, it } from "vitest";
import { buildRelationshipEconomics } from "./pipeline";
import { reproduceEconomicCalculation } from "./reproduction";
import type { Procedure, ReactivationPatient } from "@/types/reactivation-intelligence";

describe("reprodução econômica", () => {
  it("refaz os resultados usando somente versão e trace armazenados", () => {
    const procedure: Procedure = {
      id: "botox",
      nome: "Botox",
      categoria: "Injetável",
      ticketMedio: 800,
      cicloEsperadoDias: 90,
      toleranciaDias: 60,
      ativo: true,
    };
    const patient: ReactivationPatient = {
      id: "p1",
      nome: "Ana",
      telefone: "",
      procedureId: "botox",
      dataUltimoProcedimento: "2026-03-14T12:00:00.000Z",
      totalVisitas: 3,
      engajamento: 0.7,
      intervalosDias: [88, 92],
      totalGasto: 2400,
      ticketMedioHistorico: 800,
      ultimoTicket: 900,
    };
    const [original] = buildRelationshipEconomics([patient], [procedure], {
      now: new Date("2026-07-12T12:00:00.000Z"),
      toleranceDays: 60,
    });

    const reproduced = reproduceEconomicCalculation(
      original.formulaVersion,
      original.calculationTrace
    );

    expect(reproduced).toMatchObject({
      ver: original.ver,
      hr: original.hr,
      dt: original.dt,
      mpr: original.mpr,
      vep: original.vep,
      receitaEsperada: original.receitaEsperada,
      receitaNaoRealizada: original.receitaNaoRealizada,
      receitaRecuperavel: original.receitaRecuperavel,
      prioridadeEconomica: original.prioridadeEconomica,
      nivelIntervencao: original.nivelIntervencao,
    });
  });
});

