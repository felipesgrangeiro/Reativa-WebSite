// Camada 2 — Revenue Intelligence: pipeline econômico oficial.
// VER + HR + DT → MPR → VEP → Receita Esperada → Não Realizada → Recuperável.

import type { RelationshipState } from "@/types/revenue-intelligence";
import {
  HR_WEIGHTS,
  MPR_WEIGHTS,
  VEP_WEIGHTS,
  VER_WEIGHTS,
} from "./constants";

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

/** VER — Valor Econômico do Relacionamento. Componentes 0–100 → [0,100]. */
export function computeVER(monetary: number, recency: number): number {
  return clamp(VER_WEIGHTS.monetary * monetary + VER_WEIGHTS.recency * recency);
}

/** HR — Histórico de Recorrência. Componentes 0–100 → [0,100]. */
export function computeHR(
  returnCount: number,
  regularity: number,
  cycleAdherence: number
): number {
  return clamp(
    HR_WEIGHTS.returnCount * returnCount +
      HR_WEIGHTS.regularity * regularity +
      HR_WEIGHTS.cycleAdherence * cycleAdherence
  );
}

/**
 * Regularity (v1) — regularidade da recorrência ∈ [0,100], componente do HR.
 * Mede a CONSISTÊNCIA dos intervalos entre visitas: intervalos uniformes →
 * nota alta; erráticos → nota baixa. Base: 100 × (1 − CV), onde CV é o
 * coeficiente de variação (desvio-padrão ÷ média) dos intervalos.
 *
 * Precisa de ≥ 2 intervalos (≥ 3 visitas) para ter variabilidade mensurável;
 * abaixo disso retorna null e o caller usa o proxy (engajamento). Método v1 —
 * hipótese a validar estatisticamente, como os demais pesos do framework.
 */
export function computeRegularity(intervalosDias: number[]): number | null {
  if (intervalosDias.length < 2) return null;
  const mean =
    intervalosDias.reduce((sum, v) => sum + v, 0) / intervalosDias.length;
  if (mean <= 0) return null;
  const variance =
    intervalosDias.reduce((sum, v) => sum + (v - mean) ** 2, 0) /
    intervalosDias.length;
  const cv = Math.sqrt(variance) / mean;
  return clamp(100 * (1 - cv));
}

/**
 * Cycle Adherence (v1) — aderência ao ciclo ∈ [0,100], componente do HR.
 * Mede quão PRÓXIMOS os intervalos reais ficam do ciclo esperado do
 * procedimento. Base: 100 × (1 − desvio relativo médio), com desvio relativo
 * = |intervalo − ciclo| ÷ ciclo por visita.
 *
 * Precisa de ≥ 1 intervalo (≥ 2 visitas) e ciclo > 0; senão retorna null e o
 * caller usa o proxy (100 − DT). Método v1 — hipótese a validar.
 */
export function computeCycleAdherence(
  intervalosDias: number[],
  ciclo: number
): number | null {
  if (intervalosDias.length < 1 || ciclo <= 0) return null;
  const meanRelDev =
    intervalosDias.reduce((sum, v) => sum + Math.abs(v - ciclo) / ciclo, 0) /
    intervalosDias.length;
  return clamp(100 * (1 - meanRelDev));
}

/**
 * DT — Deterioração Temporal. ((TD − Ciclo) / (Limite − Ciclo)) × 100 → [0,100].
 * 0 enquanto dentro do ciclo; 100 ao atingir/ultrapassar o limite.
 */
export function computeDT(
  diasDecorridos: number,
  ciclo: number,
  limite: number
): number {
  const span = limite - ciclo;
  if (span <= 0) return diasDecorridos > ciclo ? 100 : 0;
  return clamp(((diasDecorridos - ciclo) / span) * 100);
}

/** MPR — Motor de Probabilidade de Retorno. [0,100]. */
export function computeMPR(ver: number, hr: number, dt: number): number {
  return clamp(
    MPR_WEIGHTS.ver * ver +
      MPR_WEIGHTS.hr * hr +
      MPR_WEIGHTS.decay * (100 - dt)
  );
}

/** VEP — Valor Econômico Potencial. Monetário (≥ 0). */
export function computeVEP(
  ticketMedioHistorico: number,
  ultimoTicket: number
): number {
  return Math.max(
    0,
    VEP_WEIGHTS.ticketMedioHistorico * ticketMedioHistorico +
      VEP_WEIGHTS.ultimoTicket * ultimoTicket
  );
}

/** Receita Esperada = VEP × (MPR / 100). */
export function receitaEsperada(vep: number, mpr: number): number {
  return vep * (mpr / 100);
}

/** Receita Não Realizada = MAX(0, Receita Esperada − Receita Real). */
export function receitaNaoRealizada(esperada: number, real: number): number {
  return Math.max(0, esperada - real);
}

/** Receita Recuperável = Receita Não Realizada se Em Risco; caso contrário 0. */
export function receitaRecuperavel(
  naoRealizada: number,
  state: RelationshipState
): number {
  return state === "em_risco" ? naoRealizada : 0;
}
