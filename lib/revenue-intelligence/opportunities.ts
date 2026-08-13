// Oportunidades de Recuperação — agrupa relacionamentos Em Risco por procedimento
// e expõe os indicadores oficiais (Receita Recuperável, MPR, Prioridade Econômica,
// Nível de Intervenção) consumidos pelo Consultor Reativa+ (Decision Intelligence).

import type {
  InterventionLevel,
  RecoveryOpportunity,
  RelationshipEconomics,
} from "@/types/revenue-intelligence";
import { INTERVENTION_LEVEL_LABEL, priorityTier } from "./decision";

function dominantInterventionLevel(
  items: RelationshipEconomics[]
): InterventionLevel {
  const counts = new Map<InterventionLevel, number>();
  for (const e of items) {
    counts.set(e.nivelIntervencao, (counts.get(e.nivelIntervencao) ?? 0) + 1);
  }
  let best: InterventionLevel = 1;
  let bestCount = -1;
  for (const [level, count] of counts) {
    if (count > bestCount || (count === bestCount && level > best)) {
      best = level;
      bestCount = count;
    }
  }
  return best;
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((s, n) => s + n, 0) / nums.length;
}

type Draft = Omit<RecoveryOpportunity, "prioridadeTier" | "justification"> & {
  avgVep: number;
};

/**
 * Constrói as oportunidades de recuperação a partir da economia da carteira.
 * Ordenadas por Prioridade Econômica (desc). A justificativa de cada uma é o
 * superlativo que ela lidera na carteira (receita, volume, MPR, janela, valor).
 */
export function buildRecoveryOpportunities(
  economics: RelationshipEconomics[]
): RecoveryOpportunity[] {
  const byProc = new Map<string, RelationshipEconomics[]>();
  for (const e of economics) {
    if (e.state !== "em_risco") continue;
    const list = byProc.get(e.procedureName) ?? [];
    list.push(e);
    byProc.set(e.procedureName, list);
  }

  const drafts: Draft[] = [];
  for (const [procedureName, items] of byProc) {
    const level = dominantInterventionLevel(items);
    drafts.push({
      procedureName,
      receitaRecuperavel: Math.round(
        items.reduce((s, e) => s + e.receitaRecuperavel, 0)
      ),
      relationshipsAtRisk: items.length,
      avgMpr: Math.round(avg(items.map((e) => e.mpr))),
      prioridadeEconomica: Math.round(
        items.reduce((s, e) => s + e.prioridadeEconomica, 0)
      ),
      interventionLevel: level,
      interventionLabel: INTERVENTION_LEVEL_LABEL[level],
      cicloDias: items[0].ciclo,
      limiteRecuperacaoDias: items[0].limiteRecuperacaoDias,
      avgRemainingDays: Math.max(
        0,
        Math.round(avg(items.map((e) => e.limiteRecuperacaoDias - e.diasDecorridos)))
      ),
      avgVep: avg(items.map((e) => e.vep)),
    });
  }

  if (drafts.length === 0) return [];

  // Superlativos da carteira → justificativa por oportunidade.
  const leaderId = (sel: (d: Draft) => number, dir: "max" | "min") => {
    let best = drafts[0];
    for (const d of drafts) {
      const better = dir === "max" ? sel(d) > sel(best) : sel(d) < sel(best);
      if (better) best = d;
    }
    return best.procedureName;
  };
  const topReceita = leaderId((d) => d.receitaRecuperavel, "max");
  const topVolume = leaderId((d) => d.relationshipsAtRisk, "max");
  const topMpr = leaderId((d) => d.avgMpr, "max");
  const shortestWindow = leaderId((d) => d.avgRemainingDays, "min");
  const topValor = leaderId((d) => d.avgVep, "max");

  function justify(name: string): string {
    if (name === topReceita) return "Maior concentração de receita recuperável.";
    if (name === topVolume) return "Maior volume de relacionamentos em risco.";
    if (name === topMpr) return "Maior probabilidade de retorno.";
    if (name === shortestWindow) return "Janela de recuperação mais curta.";
    if (name === topValor) return "Maior valor econômico potencial.";
    return "Receita recuperável relevante na carteira.";
  }

  const maxPrioridade = Math.max(...drafts.map((d) => d.prioridadeEconomica));

  return drafts
    .map(({ avgVep, ...rest }) => {
      void avgVep;
      return {
        ...rest,
        prioridadeTier: priorityTier(rest.prioridadeEconomica, maxPrioridade),
        justification: justify(rest.procedureName),
      };
    })
    .sort((a, b) => b.prioridadeEconomica - a.prioridadeEconomica);
}

// ---------------------------------------------------------------------------
// Resultado esperado (Seção 6) e Plano de execução (Seção 7)
// ---------------------------------------------------------------------------
export type StrategyImpact = {
  receitaRecuperavel: number;
  relationships: number;
  mprMedio: number;
  /**
   * Potencial econômico acionável = Σ Receita Recuperável.
   *
   * Receita Recuperável já deriva de Receita Esperada (VEP × MPR), então o MPR
   * não é reaplicado aqui.
   */
  potencialAcionavel: number;
  /** Menor janela média de recuperação entre as oportunidades (dias). */
  prazoIdealDias: number;
};

/** Consolida o impacto econômico acionável da estratégia selecionada. */
export function buildStrategyImpact(
  items: RecoveryOpportunity[]
): StrategyImpact {
  const relationships = items.reduce((s, o) => s + o.relationshipsAtRisk, 0);
  const receitaRecuperavel = items.reduce(
    (s, o) => s + o.receitaRecuperavel,
    0
  );
  const mprMedio = relationships
    ? Math.round(
        items.reduce((s, o) => s + o.avgMpr * o.relationshipsAtRisk, 0) /
          relationships
      )
    : 0;
  const potencialAcionavel = receitaRecuperavel;
  const prazoIdealDias = items.length
    ? Math.min(...items.map((o) => o.avgRemainingDays))
    : 0;

  return {
    receitaRecuperavel,
    relationships,
    mprMedio,
    potencialAcionavel,
    prazoIdealDias,
  };
}

export type ExecutionStep = {
  prioridade: number;
  procedureName: string;
  interventionLevel: InterventionLevel;
  interventionLabel: string;
  acao: string;
};

const LEVEL_ACTION: Record<InterventionLevel, string> = {
  4: "Contato estratégico",
  3: "Contato personalizado",
  2: "Campanha assistida",
  1: "Automação",
};

/** Gera o plano "O que fazer agora", uma ação por oportunidade, em ordem. */
export function buildExecutionPlan(
  items: RecoveryOpportunity[]
): ExecutionStep[] {
  return items.map((o, i) => ({
    prioridade: i + 1,
    procedureName: o.procedureName,
    interventionLevel: o.interventionLevel,
    interventionLabel: o.interventionLabel,
    acao: `${LEVEL_ACTION[o.interventionLevel]} para ${o.procedureName}.`,
  }));
}
