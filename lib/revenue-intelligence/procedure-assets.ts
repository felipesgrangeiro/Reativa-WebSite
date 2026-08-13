// Procedimentos como ativos de receita — versão OFICIAL (Revenue Intelligence).
// Deriva os agregados por procedimento (pacientes, receita, participação, selos)
// do motor econômico (RelationshipEconomics) em vez da contagem sobre o mock.
// A "receita associada" passa a ser a soma do VEP (potencial econômico) dos
// relacionamentos do procedimento — Ativos, Em Risco e Perdidos.
//
// Substitui src/lib/reactivation-intelligence/procedure-assets.ts.

import type { Procedure } from "@/types/reactivation-intelligence";
import type { RelationshipEconomics } from "@/types/revenue-intelligence";

export type ProcedureBadge =
  | "top_revenue"
  | "top_ticket"
  | "most_patients"
  | "shortest_cycle";

export type ProcedureAsset = {
  procedure: Procedure;
  patientsMonitored: number;
  revenue: number;
  sharePct: number;
  badges: ProcedureBadge[];
};

export function buildProcedureAssetsFromEconomics(
  procedures: Procedure[],
  economics: RelationshipEconomics[]
): ProcedureAsset[] {
  // Agrega por nome do procedimento (a economia carrega procedureName).
  const byName = new Map<string, { count: number; revenue: number }>();
  for (const e of economics) {
    const cur = byName.get(e.procedureName) ?? { count: 0, revenue: 0 };
    cur.count += 1;
    cur.revenue += e.vep;
    byName.set(e.procedureName, cur);
  }

  const base = procedures.map((procedure) => {
    const agg = byName.get(procedure.nome) ?? { count: 0, revenue: 0 };
    return {
      procedure,
      patientsMonitored: agg.count,
      revenue: Math.round(agg.revenue),
    };
  });

  const totalRevenue = base.reduce((sum, b) => sum + b.revenue, 0);

  // Vencedor (primeira ocorrência) de cada destaque.
  const winnerId = (
    selector: (b: (typeof base)[number]) => number,
    requirePositive = true
  ): string | null => {
    let bestId: string | null = null;
    let best = -Infinity;
    for (const b of base) {
      const v = selector(b);
      if (v > best) {
        best = v;
        bestId = b.procedure.id;
      }
    }
    return !requirePositive || best > 0 ? bestId : null;
  };

  const shortestCycleId = base.length
    ? base.reduce((min, b) =>
        b.procedure.cicloEsperadoDias < min.procedure.cicloEsperadoDias ? b : min
      ).procedure.id
    : null;

  const topRevenueId = winnerId((b) => b.revenue);
  const topTicketId = winnerId((b) => b.procedure.ticketMedio, false);
  const mostPatientsId = winnerId((b) => b.patientsMonitored);

  return base.map((b) => {
    const badges: ProcedureBadge[] = [];
    if (b.procedure.id === topRevenueId) badges.push("top_revenue");
    if (b.procedure.id === topTicketId) badges.push("top_ticket");
    if (b.procedure.id === mostPatientsId) badges.push("most_patients");
    if (b.procedure.id === shortestCycleId) badges.push("shortest_cycle");
    return {
      ...b,
      sharePct:
        totalRevenue > 0 ? Math.round((b.revenue / totalRevenue) * 100) : 0,
      badges,
    };
  });
}
