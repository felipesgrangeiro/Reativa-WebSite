// Camada 1 — Framework Operacional: classificação de relacionamento e receita.

import type {
  RelationshipState,
  RevenueState,
} from "@/types/revenue-intelligence";

/**
 * Limite de Recuperação (proxy v1) — em dias desde o último evento gerador.
 * = ciclo + tolerância. A tolerância representa exatamente os dias extras de
 * janela de recuperação além do ciclo. Calibração pendente.
 */
export function limiteRecuperacaoDias(
  ciclo: number,
  tolerancia: number
): number {
  return ciclo + tolerancia;
}

/**
 * Estado do relacionamento (Tempo Decorrido = dias desde o último evento):
 *  - Ativo:    TD ≤ Ciclo
 *  - Em Risco: Ciclo < TD ≤ Limite de Recuperação
 *  - Perdido:  TD > Limite de Recuperação
 *
 * A "ausência de novo evento gerador" da definição de Perdido é premissa do
 * input: `diasDecorridos` é sempre medido a partir do último evento conhecido.
 */
export function classifyRelationship(
  diasDecorridos: number,
  ciclo: number,
  limite: number
): RelationshipState {
  if (diasDecorridos <= ciclo) return "ativo";
  if (diasDecorridos <= limite) return "em_risco";
  return "perdido";
}

/** Estado da receita espelha o estado do relacionamento. */
export function revenueState(state: RelationshipState): RevenueState {
  if (state === "ativo") return "protegida";
  if (state === "em_risco") return "em_risco";
  return "perdida";
}
