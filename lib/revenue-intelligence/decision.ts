// Camada 3 — Decision Intelligence: priorização e nível de intervenção.

import type { InterventionLevel } from "@/types/revenue-intelligence";
import { MPR_MEDIA, NIVEL_INTERVENCAO_FAIXAS } from "./constants";
import { INTERVENTION_CONCEPT } from "./decision-concepts";

/**
 * Prioridade Econômica = Receita Recuperável × (DT / 100).
 *
 * O PRC (Potencial de Recuperação) é conceito consolidado mas com fórmula
 * "em observação" no framework v1.0, justamente para evitar dupla aplicação do
 * fator probabilístico. Por isso a Prioridade é derivada direto de Receita
 * Recuperável e DT — o MPR já está embutido na Receita Recuperável (via Receita
 * Esperada), e não é reaplicado aqui.
 */
export function prioridadeEconomica(
  receitaRecuperavel: number,
  dt: number
): number {
  return receitaRecuperavel * (dt / 100);
}

/** Fila Inteligente — ordenação decrescente por Prioridade Econômica. */
export function filaInteligente<T extends { prioridadeEconomica: number }>(
  items: T[]
): T[] {
  return [...items].sort(
    (a, b) => b.prioridadeEconomica - a.prioridadeEconomica
  );
}

/**
 * Nível de Intervenção (regra inicial) por Receita Recuperável:
 *  1 Automação · 2 Assistido · 3 Personalizado · 4 Estratégico.
 * As faixas são placeholder — o documento define os níveis, não os limiares.
 */
export function nivelIntervencao(receitaRecuperavel: number): InterventionLevel {
  const [baixo, medio, alto] = NIVEL_INTERVENCAO_FAIXAS;
  if (receitaRecuperavel < baixo) return 1;
  if (receitaRecuperavel < medio) return 2;
  if (receitaRecuperavel < alto) return 3;
  return 4;
}

/** Rótulo curto de cada Nível de Intervenção. */
export const INTERVENTION_LEVEL_LABEL: Record<InterventionLevel, string> = {
  ...INTERVENTION_CONCEPT.levels,
};

export type ActionChannel = "automacao" | "whatsapp" | "ligacao" | "oferta";

export type RecommendedAction = {
  channel: ActionChannel;
  label: string;
};

/**
 * Ação recomendada = Nível de Intervenção (quanto esforço) modulado pelo MPR
 * (qual canal). Maior valor pede toque mais forte; menor probabilidade pede
 * canal mais persuasivo (ligação/oferta) em vez de mensagem.
 */
export function recommendedAction(
  nivel: InterventionLevel,
  mpr: number
): RecommendedAction {
  switch (nivel) {
    case 1:
      return { channel: "automacao", label: "WhatsApp automático" };
    case 2:
      return { channel: "whatsapp", label: "WhatsApp assistido" };
    case 3:
      return mpr >= MPR_MEDIA
        ? { channel: "whatsapp", label: "WhatsApp personalizado" }
        : { channel: "ligacao", label: "Ligação" };
    case 4:
      return mpr >= MPR_MEDIA
        ? { channel: "ligacao", label: "Ligação estratégica" }
        : { channel: "oferta", label: "Oferta de retorno" };
  }
}

export type PriorityTier = "alta" | "media" | "baixa";

/** Faixa de prioridade relativa ao maior valor da fila (Alta/Média/Baixa). */
export function priorityTier(
  prioridade: number,
  maxPrioridade: number
): PriorityTier {
  if (maxPrioridade <= 0) return "baixa";
  const ratio = prioridade / maxPrioridade;
  if (ratio >= 0.66) return "alta";
  if (ratio >= 0.33) return "media";
  return "baixa";
}
