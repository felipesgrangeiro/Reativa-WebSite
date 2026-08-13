// Aba Segmentos — versão OFICIAL (Revenue Intelligence).
// Organiza a carteira ACIONÁVEL (relacionamentos Em Risco) por quatro lentes,
// derivadas do motor econômico (RelationshipEconomics): Nível de Intervenção,
// procedimento, comportamento e canal recomendado. Substitui o builder antigo
// baseado em RScore/PatientCycle (src/lib/reactivation-intelligence/segments.ts).
//
// O "score" exibido em cada paciente passa a ser o MPR (probabilidade de retorno,
// 0–100) — a Prioridade Econômica é em R$, então não serve como score 0–100.

import type {
  CarteiraSegment,
  SegmentMember,
  SegmentsData,
  SegmentsSummary,
} from "@/types/reactivation-intelligence";
import type {
  InterventionLevel,
  RelationshipEconomics,
} from "@/types/revenue-intelligence";
import { RELATIONSHIP_COLORS } from "@/lib/relationship-colors";
import {
  INTERVENTION_LEVEL_LABEL,
  recommendedAction,
  type ActionChannel,
} from "./decision";
import { MPR_ALTA } from "./constants";

/** Ticket econômico (VEP) a partir do qual um relacionamento é "alto valor". */
const HIGH_VEP = 1500;
/** DT a partir do qual a janela de recuperação está "fechando". */
const DT_JANELA_FECHANDO = 60;

function avg(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return Math.round(nums.reduce((s, n) => s + n, 0) / nums.length);
}

function sumRecuperavel(items: RelationshipEconomics[]): number {
  return items.reduce((s, e) => s + e.receitaRecuperavel, 0);
}

function daysOutOfCycle(e: RelationshipEconomics): number {
  return Math.max(e.diasDecorridos - e.ciclo, 0);
}

function toMember(e: RelationshipEconomics): SegmentMember {
  const { label } = recommendedAction(e.nivelIntervencao, e.mpr);
  return {
    patientId: e.patientId,
    patientName: e.patientName,
    procedureName: e.procedureName,
    daysOutOfCycle: daysOutOfCycle(e),
    revenue: Math.round(e.receitaRecuperavel),
    // Campo `rScore` mantido por contrato de UI; agora carrega o MPR (0–100).
    rScore: Math.round(e.mpr),
    actionLabel: label,
  };
}

/** Membros ordenados por Prioridade Econômica (decrescente). */
function membersOf(items: RelationshipEconomics[]): SegmentMember[] {
  return [...items]
    .sort((a, b) => b.prioridadeEconomica - a.prioridadeEconomica)
    .map(toMember);
}

function baseSegment(
  items: RelationshipEconomics[],
  fields: Pick<
    CarteiraSegment,
    "id" | "group" | "label" | "color" | "actionLabel"
  > &
    Partial<Pick<CarteiraSegment, "emoji" | "description" | "metricLabel">>
): CarteiraSegment {
  return {
    ...fields,
    patientCount: items.length,
    revenue: Math.round(sumRecuperavel(items)),
    avgScore: avg(items.map((e) => e.mpr)),
    members: membersOf(items),
  };
}

// ---------------------------------------------------------------------------
// 1. Segmentos prioritários — por Nível de Intervenção oficial (4 → 1)
// ---------------------------------------------------------------------------
const LEVEL_META: Record<
  InterventionLevel,
  { emoji: string; color: string; description: string }
> = {
  4: {
    emoji: "💎",
    color: "#FBBF24",
    description: "Maior receita recuperável — exige toque estratégico.",
  },
  3: {
    emoji: "🥈",
    color: "#CBD5E1",
    description: "Alto valor recuperável — abordagem personalizada.",
  },
  2: {
    emoji: "🥉",
    color: "#D97706",
    description: "Valor moderado — abordagem assistida.",
  },
  1: {
    emoji: "⚙️",
    color: "#64748B",
    description: "Baixo valor — automação de retorno.",
  },
};

function buildValueSegments(atRisk: RelationshipEconomics[]): CarteiraSegment[] {
  const levels: InterventionLevel[] = [4, 3, 2, 1];
  return levels
    .map((level) => {
      const items = atRisk.filter((e) => e.nivelIntervencao === level);
      const meta = LEVEL_META[level];
      return baseSegment(items, {
        id: `value-nivel-${level}`,
        group: "value",
        label: INTERVENTION_LEVEL_LABEL[level],
        emoji: meta.emoji,
        color: meta.color,
        description: meta.description,
        actionLabel: `Nível ${level}`,
      });
    })
    .filter((s) => s.patientCount > 0);
}

// ---------------------------------------------------------------------------
// 2. Segmentos por procedimento (ordenados por receita recuperável)
// ---------------------------------------------------------------------------
function buildProcedureSegments(
  atRisk: RelationshipEconomics[]
): CarteiraSegment[] {
  const byProc = new Map<string, RelationshipEconomics[]>();
  for (const e of atRisk) {
    const list = byProc.get(e.procedureName) ?? [];
    list.push(e);
    byProc.set(e.procedureName, list);
  }

  return [...byProc.entries()]
    .map(([procedureName, items]) =>
      baseSegment(items, {
        id: `procedure-${procedureName}`,
        group: "procedure",
        label: procedureName,
        color: "#00d6b8",
        actionLabel: "Campanha por procedimento",
        metricLabel: `MPR médio ${avg(items.map((e) => e.mpr)) ?? 0}%`,
      })
    )
    .sort((a, b) => b.revenue - a.revenue);
}

// ---------------------------------------------------------------------------
// 3. Segmentos por comportamento
// ---------------------------------------------------------------------------
function buildBehaviorSegments(
  atRisk: RelationshipEconomics[]
): CarteiraSegment[] {
  const hidden = atRisk.filter((e) => e.mpr >= MPR_ALTA);
  const highTicket = atRisk.filter((e) => e.vep >= HIGH_VEP);
  const closing = atRisk.filter((e) => e.dt >= DT_JANELA_FECHANDO);

  const avgVep =
    highTicket.length > 0
      ? Math.round(
          highTicket.reduce((s, e) => s + e.vep, 0) / highTicket.length
        )
      : 0;

  const segments: CarteiraSegment[] = [
    baseSegment(hidden, {
      id: "behavior-hidden",
      group: "behavior",
      label: "Ativos Ocultos",
      color: "#00d6b8",
      description: "Em risco, mas com alta probabilidade de retorno (MPR alta).",
      actionLabel: "Reativação prioritária",
    }),
    baseSegment(highTicket, {
      id: "behavior-high-ticket",
      group: "behavior",
      label: "Alto Ticket em Risco",
      color: RELATIONSHIP_COLORS.risk,
      description: "Maior potencial econômico (VEP) fora do ciclo.",
      actionLabel: "Oferta de recuperação",
      metricLabel: highTicket.length ? `VEP médio R$ ${avgVep}` : undefined,
    }),
    baseSegment(closing, {
      id: "behavior-closing",
      group: "behavior",
      label: "Janela Fechando",
      color: "#EAB308",
      description: "Decaimento avançado (DT alto) — perto do limite de recuperação.",
      actionLabel: "Contato imediato",
    }),
  ];

  return segments.filter((s) => s.patientCount > 0);
}

// ---------------------------------------------------------------------------
// 4. Segmentos por canal recomendado (Ação Recomendada oficial)
// ---------------------------------------------------------------------------
const CHANNEL_META: Record<ActionChannel, { label: string; color: string }> = {
  automacao: { label: "Automação", color: "#00d6b8" },
  whatsapp: { label: "WhatsApp", color: "#22D3EE" },
  ligacao: { label: "Ligação", color: "#FB923C" },
  oferta: { label: "Oferta de retorno", color: "#A855F7" },
};

function buildActionSegments(
  atRisk: RelationshipEconomics[]
): CarteiraSegment[] {
  const byChannel = new Map<ActionChannel, RelationshipEconomics[]>();
  for (const e of atRisk) {
    const { channel } = recommendedAction(e.nivelIntervencao, e.mpr);
    const list = byChannel.get(channel) ?? [];
    list.push(e);
    byChannel.set(channel, list);
  }

  return (Object.keys(CHANNEL_META) as ActionChannel[])
    .filter((channel) => (byChannel.get(channel)?.length ?? 0) > 0)
    .map((channel) => {
      const items = byChannel.get(channel)!;
      const meta = CHANNEL_META[channel];
      return baseSegment(items, {
        id: `action-${channel}`,
        group: "action",
        label: meta.label,
        color: meta.color,
        actionLabel: meta.label,
      });
    })
    .sort((a, b) => b.patientCount - a.patientCount);
}

// ---------------------------------------------------------------------------
// Consolidação
// ---------------------------------------------------------------------------
export function buildSegmentsFromEconomics(
  economics: RelationshipEconomics[]
): SegmentsData {
  const atRisk = economics.filter((e) => e.state === "em_risco");

  const valueSegments = buildValueSegments(atRisk);
  const procedureSegments = buildProcedureSegments(atRisk);
  const behaviorSegments = buildBehaviorSegments(atRisk);
  const actionSegments = buildActionSegments(atRisk);

  const summary: SegmentsSummary = {
    activeSegments:
      valueSegments.length +
      procedureSegments.length +
      behaviorSegments.length +
      actionSegments.length,
    monitoredPatients: economics.length,
    revenueAtRisk: Math.round(sumRecuperavel(atRisk)),
    hiddenAssets: atRisk.filter((e) => e.mpr >= MPR_ALTA).length,
  };

  return {
    summary,
    valueSegments,
    procedureSegments,
    behaviorSegments,
    actionSegments,
  };
}
