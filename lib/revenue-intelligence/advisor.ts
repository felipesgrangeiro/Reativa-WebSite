// Consultor Reativa+ + Estratégia Ativa — versão oficial e determinística.
// Gera os mesmos tipos consumidos pela tela (AdvisorInsight / DiagnosisAction /
// ActiveStrategy), mas a partir do motor oficial (RelationshipEconomics):
// Receita Recuperável, Prioridade Econômica, MPR. Não altera VER/HR/DT/MPR.

import type {
  ActiveStrategy,
  AdvisorInsight,
  DiagnosisAction,
  RecommendedActionType,
} from "@/types/reactivation-intelligence";
import type {
  InterventionLevel,
  RelationshipEconomics,
} from "@/types/revenue-intelligence";
import { INTERVENTION_LEVEL_LABEL } from "./decision";
import { formatCurrency } from "@/lib/utils";

function pct(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

/** Nível de Intervenção predominante (moda) de um grupo de relacionamentos. */
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
    // Empate → nível maior (intervenção mais forte) prevalece.
    if (count > bestCount || (count === bestCount && level > best)) {
      best = level;
      bestCount = count;
    }
  }
  return best;
}

/** Agregado por procedimento (Em Risco), com sinais para a recomendação. */
type RiskGroup = {
  procedureName: string;
  revenueAtRisk: number;
  patientsAtRisk: number;
  avgMpr: number;
  avgVep: number;
  /** Σ Prioridade Econômica do grupo (R$). */
  prioridadeEconomica: number;
  /** Nível de Intervenção predominante do grupo (1–4). */
  interventionLevel: InterventionLevel;
  interventionLabel: string;
  /** Perdidos ÷ (Em Risco + Perdidos) — pressão de perda do procedimento. */
  lostShare: number;
  ciclo: number;
  limiteRecuperacaoDias: number;
};

function riskGroups(economics: RelationshipEconomics[]): RiskGroup[] {
  const byProc = new Map<
    string,
    { emRisco: RelationshipEconomics[]; perdidos: number }
  >();
  for (const e of economics) {
    if (e.state !== "em_risco" && e.state !== "perdido") continue;
    const entry = byProc.get(e.procedureName) ?? { emRisco: [], perdidos: 0 };
    if (e.state === "em_risco") entry.emRisco.push(e);
    else entry.perdidos += 1;
    byProc.set(e.procedureName, entry);
  }

  const groups: RiskGroup[] = [];
  for (const { emRisco, perdidos } of byProc.values()) {
    if (emRisco.length === 0) continue;
    const count = emRisco.length;
    const level = dominantInterventionLevel(emRisco);
    groups.push({
      procedureName: emRisco[0].procedureName,
      revenueAtRisk: emRisco.reduce((s, e) => s + e.receitaRecuperavel, 0),
      patientsAtRisk: count,
      avgMpr: Math.round(emRisco.reduce((s, e) => s + e.mpr, 0) / count),
      avgVep: emRisco.reduce((s, e) => s + e.vep, 0) / count,
      prioridadeEconomica: Math.round(
        emRisco.reduce((s, e) => s + e.prioridadeEconomica, 0)
      ),
      interventionLevel: level,
      interventionLabel: INTERVENTION_LEVEL_LABEL[level],
      lostShare: perdidos / (count + perdidos),
      ciclo: emRisco[0].ciclo,
      limiteRecuperacaoDias: emRisco[0].limiteRecuperacaoDias,
    });
  }
  return groups.sort(
    (a, b) =>
      b.prioridadeEconomica - a.prioridadeEconomica ||
      b.revenueAtRisk - a.revenueAtRisk
  );
}

// ---------------------------------------------------------------------------
// Diagnósticos (fonte única para insights e ações — relação 1:1)
// ---------------------------------------------------------------------------
type DiagnosisFact =
  | {
      kind: "top-leak";
      procedureName: string;
      revenueAtRisk: number;
      sharePct: number;
      prioridadeEconomica: number;
      interventionLabel: string;
      windowStart: number;
      windowEnd: number;
    }
  | { kind: "loss-risk"; count: number; sharePct: number }
  | {
      kind: "best-segment";
      procedureName: string;
      avgMpr: number;
      interventionLabel: string;
    };

function buildDiagnoses(economics: RelationshipEconomics[]): DiagnosisFact[] {
  const facts: DiagnosisFact[] = [];
  const totalRecoverable = economics.reduce(
    (s, e) => s + e.receitaRecuperavel,
    0
  );
  const groups = riskGroups(economics);

  // 1 — maior impacto de agir agora (prioridade econômica agregada)
  const top = groups[0];
  if (top && totalRecoverable > 0) {
    facts.push({
      kind: "top-leak",
      procedureName: top.procedureName,
      revenueAtRisk: top.revenueAtRisk,
      sharePct: pct(top.revenueAtRisk, totalRecoverable),
      prioridadeEconomica: top.prioridadeEconomica,
      interventionLabel: top.interventionLabel,
      windowStart: top.ciclo,
      windowEnd: top.limiteRecuperacaoDias,
    });
  }

  // 2 — pacientes perdidos (além do limite de recuperação)
  const lost = economics.filter((e) => e.state === "perdido");
  if (lost.length > 0) {
    const totalVep = economics.reduce((s, e) => s + e.vep, 0);
    facts.push({
      kind: "loss-risk",
      count: lost.length,
      sharePct: pct(
        lost.reduce((s, e) => s + e.vep, 0),
        totalVep
      ),
    });
  }

  // 3 — segmento de maior probabilidade de retorno (MPR médio)
  const bestSegment = [...groups].sort((a, b) => b.avgMpr - a.avgMpr)[0];
  if (bestSegment) {
    facts.push({
      kind: "best-segment",
      procedureName: bestSegment.procedureName,
      avgMpr: bestSegment.avgMpr,
      interventionLabel: bestSegment.interventionLabel,
    });
  }

  return facts;
}

function factToInsight(fact: DiagnosisFact): AdvisorInsight {
  switch (fact.kind) {
    case "top-leak":
      return {
        id: "top-leak",
        tone: "opportunity",
        title: `${fact.procedureName} concentra a maior prioridade econômica`,
        body: `O ${fact.procedureName} representa ${fact.sharePct}% da receita recuperável estimada da carteira e lidera a fila com ${formatCurrency(fact.prioridadeEconomica)} de Prioridade Econômica. Nível de Intervenção sugerido pela regra inicial: ${fact.interventionLabel}. Foque nos pacientes entre ${fact.windowStart} e ${fact.windowEnd} dias da última aplicação.`,
      };
    case "loss-risk":
      return {
        id: "loss-risk",
        tone: "warning",
        title: `${fact.count} paciente(s) perdido(s)`,
        body: `Há ${fact.count} paciente(s) além do limite de recuperação, somando ${fact.sharePct}% do valor potencial da carteira. Revise se ainda vale uma reabordagem antes de descartá-los.`,
      };
    case "best-segment":
      return {
        id: "best-segment",
        tone: "info",
        title: `${fact.procedureName} reúne a maior probabilidade de retorno`,
        body: `Os pacientes de ${fact.procedureName} em risco têm MPR médio estimado de ${fact.avgMpr}% — o melhor da carteira. Nível de intervenção sugerido pela regra inicial: ${fact.interventionLabel}. Priorize este segmento para recuperar mais faturamento.`,
      };
  }
}

const MEDALS = ["🥇", "🥈", "🥉"];

function factToAction(fact: DiagnosisFact, index: number): DiagnosisAction {
  const medal = MEDALS[index] ?? `#${index + 1}`;
  switch (fact.kind) {
    case "top-leak":
      return {
        id: "top-leak",
        medal,
        title: `${medal} Recuperar receita concentrada em ${fact.procedureName}`,
        reason: `${fact.procedureName} representa ${fact.sharePct}% da receita recuperável estimada e lidera a prioridade econômica (${formatCurrency(fact.prioridadeEconomica)}).`,
        recommendedAction: `Aplicar o nível ${fact.interventionLabel}, sugerido pela regra inicial: campanha de recuperação para pacientes entre ${fact.windowStart} e ${fact.windowEnd} dias da última aplicação.`,
        impact: `${formatCurrency(fact.revenueAtRisk)} recuperáveis.`,
        interventionLabel: fact.interventionLabel,
        procedureId: fact.procedureName,
      };
    case "loss-risk":
      return {
        id: "loss-risk",
        medal,
        title: `${medal} Revisar pacientes além do limite de recuperação`,
        reason:
          fact.count === 1
            ? "Existe paciente além do limite de recuperação."
            : `Existem ${fact.count} pacientes além do limite de recuperação.`,
        recommendedAction:
          "Avaliar uma reabordagem pessoal (WhatsApp ou ligação) antes do descarte definitivo.",
        impact: `${fact.sharePct}% do valor potencial da carteira está nesse grupo.`,
        procedureId: null,
      };
    case "best-segment":
      return {
        id: "best-segment",
        medal,
        title: `${medal} Priorizar o segmento com maior probabilidade de retorno`,
        reason: `Pacientes de ${fact.procedureName} têm MPR médio ${fact.avgMpr}%, o melhor da carteira.`,
        recommendedAction: `Aplicar o Nível ${fact.interventionLabel} nas próximas campanhas e acompanhamentos deste segmento.`,
        impact: "Maior probabilidade de conversão entre os pacientes em risco.",
        interventionLabel: fact.interventionLabel,
        procedureId: fact.procedureName,
      };
  }
}

export function buildAdvisorInsights(
  economics: RelationshipEconomics[]
): AdvisorInsight[] {
  return buildDiagnoses(economics).map(factToInsight);
}

export function buildDiagnosisActions(
  economics: RelationshipEconomics[]
): DiagnosisAction[] {
  return buildDiagnoses(economics).map(factToAction);
}

// ---------------------------------------------------------------------------
// Estratégia Ativa — derivada do procedimento nº 1 em receita recuperável.
// ---------------------------------------------------------------------------
const STRATEGY_CHANNEL: Record<RecommendedActionType, string> = {
  whatsapp: "WhatsApp",
  oferta: "WhatsApp",
  consulta: "WhatsApp",
  ligacao: "Ligação",
};

const STRATEGY_OFFER: Record<
  RecommendedActionType,
  { label: string; subtext: string }
> = {
  oferta: {
    label: "Oferta Especial",
    subtext: "desconto de retorno por tempo limitado",
  },
  consulta: {
    label: "Consulta de retorno",
    subtext: "agenda prioritária na semana",
  },
  whatsapp: {
    label: "Campanha de retorno",
    subtext: "lembrete personalizado com benefício",
  },
  ligacao: {
    label: "Contato consultivo",
    subtext: "ligação pessoal antes do abandono",
  },
};

/**
 * Ação recomendada para um procedimento a partir do agregado da carteira:
 *  - Oferta:   muita pressão de perda + valor recuperável alto
 *  - Consulta: ticket alto (VEP) + MPR alto + poucos pacientes
 *  - WhatsApp: muitos pacientes (recorrente)
 *  - Ligação:  padrão
 */
function recommendProcedureAction(group: RiskGroup): RecommendedActionType {
  if (group.lostShare >= 0.5 && group.revenueAtRisk >= 3000) return "oferta";
  if (group.avgVep >= 1000 && group.avgMpr >= 70 && group.patientsAtRisk <= 2)
    return "consulta";
  if (group.patientsAtRisk >= 3) return "whatsapp";
  return "ligacao";
}

export function buildActiveStrategy(
  economics: RelationshipEconomics[]
): ActiveStrategy | null {
  const top = riskGroups(economics)[0];
  if (!top) return null;

  const channelType = recommendProcedureAction(top);
  const offer = STRATEGY_OFFER[channelType];

  const members = economics
    .filter((e) => e.state === "em_risco" && e.procedureName === top.procedureName)
    .sort((a, b) => b.prioridadeEconomica - a.prioridadeEconomica);

  const prioridadeEconomica = members.reduce(
    (s, e) => s + e.prioridadeEconomica,
    0
  );
  const interventionLevel = dominantInterventionLevel(members);

  return {
    procedureId: top.procedureName,
    procedureName: top.procedureName,
    headline: `Agir na maior prioridade econômica: ${top.procedureName}`,
    criticalPatients: top.patientsAtRisk,
    avgMpr: top.avgMpr,
    revenueAtRisk: top.revenueAtRisk,
    prioridadeEconomica: Math.round(prioridadeEconomica),
    interventionLevel,
    interventionLabel: INTERVENTION_LEVEL_LABEL[interventionLevel],
    channelLabel: STRATEGY_CHANNEL[channelType],
    channelType,
    objective: "Recuperar pacientes fora do ciclo.",
    offerLabel: offer.label,
    offerSubtext: offer.subtext,
    patientNames: members.map((e) => e.patientName),
  };
}
