// FONTE ÚNICA da montagem dos componentes 0–100 do pipeline (VER/HR/DT/MPR) a
// partir dos dados brutos do relacionamento. Usada tanto pelo motor da carteira
// (Dashboard/Central, via pipeline.ts) quanto pela tela de Clientes Inativos
// (recoverable-revenue.ts), para que o MESMO paciente produza o MESMO MPR em
// todas as telas — sem proxies divergentes entre adaptadores.
//
// Proxies/decisões v1 (calibração pendente):
//  - Monetary        = valor monetário do relacionamento normalizado na carteira
//  - Recency         = 100 × (1 − TD / Limite de Recuperação)
//  - Return Count    = nº de visitas saturado em MAX_RETURN_COUNT
//  - Regularity      = consistência dos intervalos reais; sem histórico (<2
//                      intervalos) → engajamento × 100
//  - Cycle Adherence = proximidade dos intervalos ao ciclo; sem histórico → 100 − DT

import {
  clamp,
  computeCycleAdherence,
  computeDT,
  computeHR,
  computeMPR,
  computeRegularity,
  computeVER,
} from "./revenue";
import { MAX_RETURN_COUNT } from "./constants";

/** Engajamento proxy (0–1): cresce com a frequência de visitas, satura ~9. */
export function engagementProxy(totalVisitas: number): number {
  return Math.min(1, 0.3 + totalVisitas * 0.08);
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Intervalos (dias) entre datas consecutivas de visita, em ordem crescente.
 * Descarta intervalos não positivos (mesmo dia / duplicatas). Fonte única da
 * extração de intervalos usada por todos os adaptadores.
 */
export function intervalsFromDates(isoDates: string[]): number[] {
  const sorted = isoDates
    .map((d) => new Date(d).getTime())
    .sort((a, b) => a - b);
  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const dias = Math.round((sorted[i] - sorted[i - 1]) / MS_PER_DAY);
    if (dias > 0) intervals.push(dias);
  }
  return intervals;
}

export type MprComponentsInput = {
  /** Tempo Decorrido desde a última visita (dias). */
  diasDecorridos: number;
  ciclo: number;
  limite: number;
  /** Valor monetário bruto do relacionamento (ex.: visitas × ticket, total gasto). */
  monetary: number;
  /** Maior valor monetário da carteira — base de normalização do Monetary. */
  maxMonetary: number;
  /** Total de visitas/procedimentos (base do Return Count). */
  totalVisitas: number;
  /** Intervalos reais (dias) entre visitas — Regularity e Cycle Adherence. */
  intervalosDias?: number[];
  /** Engajamento (0–1) — fallback de Regularity sem histórico de intervalos. */
  engajamento?: number;
};

export type MprComponents = {
  monetary: number;
  recency: number;
  returnCount: number;
  regularity: number;
  cycleAdherence: number;
  ver: number;
  hr: number;
  dt: number;
  /** MPR BRUTO (antes de calibração de coorte, aplicada à parte). */
  mpr: number;
};

/** Monta os componentes e o MPR bruto a partir dos dados do relacionamento. */
export function computeMprComponents(input: MprComponentsInput): MprComponents {
  const dt = computeDT(input.diasDecorridos, input.ciclo, input.limite);

  const monetary = clamp(
    (input.monetary / Math.max(1, input.maxMonetary)) * 100
  );
  const recency = clamp(
    input.limite > 0 ? 100 * (1 - input.diasDecorridos / input.limite) : 0
  );
  const returnCount = clamp((input.totalVisitas / MAX_RETURN_COUNT) * 100);

  // Regularity / Cycle Adherence reais a partir dos intervalos; sem histórico
  // suficiente as funções retornam null e caímos nos proxies (engajamento / 100−DT).
  const intervalos = input.intervalosDias ?? [];
  const engaj = input.engajamento ?? engagementProxy(input.totalVisitas);
  const regularity = computeRegularity(intervalos) ?? clamp(engaj * 100);
  const cycleAdherence =
    computeCycleAdherence(intervalos, input.ciclo) ?? clamp(100 - dt);

  const ver = computeVER(monetary, recency);
  const hr = computeHR(returnCount, regularity, cycleAdherence);
  const mpr = computeMPR(ver, hr, dt);

  return {
    monetary,
    recency,
    returnCount,
    regularity,
    cycleAdherence,
    ver,
    hr,
    dt,
    mpr,
  };
}
