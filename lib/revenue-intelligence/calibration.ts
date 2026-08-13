// Estágio 2 — Calibração do MPR (fecha o loop de Decision Intelligence).
// Compara o MPR PREVISTO no momento do contato com o RETORNO OBSERVADO e ajusta
// o MPR final por coorte. NÃO altera VER / HR / DT — atua somente no MPR.
//
// MPR_calibrado = clamp(MPR_bruto × fator(coorte), 0, 100)
//   fatorBruto = taxaObservada / taxaPrevista
//   w = n / (n + k)                  (confiança pela amostra)
//   fator = 1·(1 − w) + fatorBruto·w (coorte fria → ~1; madura → confia no observado)

import { MPR_ALTA, MPR_MEDIA } from "./constants";
import { clamp } from "./revenue";

/** Força do prior (k): nº de contatos para a coorte "confiar" no observado. */
export const CALIBRATION_PRIOR_STRENGTH = 20;
/** Limites de segurança do fator de calibração. */
export const FACTOR_MIN = 0.6;
export const FACTOR_MAX = 1.4;
/** Contatos mínimos para a coorte ser considerada "calibrada" (w ≥ 0,5). */
export const MIN_CONFIDENCE_N = CALIBRATION_PRIOR_STRENGTH;

/** Um desfecho observado, com o MPR previsto e a coorte no momento do contato. */
export type CalibrationObservation = {
  cohortKey: string;
  /** MPR previsto pelo motor quando o paciente foi contatado (0–100). */
  predictedMpr: number;
  /** Se o paciente efetivamente retornou (reativado). */
  returned: boolean;
};

/** Mapa coorte → fator de calibração (ausência = 1, neutro). */
export type CalibrationFactors = Record<string, number>;

function clampFactor(factor: number): number {
  return Math.min(FACTOR_MAX, Math.max(FACTOR_MIN, factor));
}

/** Chave de coorte: procedimento × faixa de MPR (alta / média / baixa). */
export function cohortKeyFor(procedureName: string, mpr: number): string {
  const band = mpr >= MPR_ALTA ? "alta" : mpr >= MPR_MEDIA ? "media" : "baixa";
  return `${procedureName}|${band}`;
}

/**
 * Aprende um fator de calibração por coorte a partir dos desfechos observados.
 * Coortes com poucos contatos ficam com fator próximo de 1 (encolhimento).
 */
export function calibrateMpr(
  observations: CalibrationObservation[],
  priorStrength: number = CALIBRATION_PRIOR_STRENGTH
): CalibrationFactors {
  const groups = new Map<
    string,
    { n: number; returns: number; sumPredicted: number }
  >();

  for (const obs of observations) {
    const g = groups.get(obs.cohortKey) ?? {
      n: 0,
      returns: 0,
      sumPredicted: 0,
    };
    g.n += 1;
    g.returns += obs.returned ? 1 : 0;
    g.sumPredicted += obs.predictedMpr;
    groups.set(obs.cohortKey, g);
  }

  const factors: CalibrationFactors = {};
  for (const [key, g] of groups) {
    const predictedRate = g.sumPredicted / g.n / 100; // média do MPR como fração
    if (predictedRate <= 0) continue; // sem previsão → não há o que calibrar
    const observedRate = g.returns / g.n;
    const fatorBruto = observedRate / predictedRate;
    const w = g.n / (g.n + priorStrength);
    const fator = 1 * (1 - w) + fatorBruto * w;
    factors[key] = clampFactor(fator);
  }
  return factors;
}

/**
 * Aplica o fator da coorte ao MPR bruto. Sem fator para a coorte (ou sem
 * fatores), retorna o MPR bruto inalterado. Resultado sempre em [0, 100].
 */
export function applyCalibration(
  rawMpr: number,
  cohortKey: string,
  factors: CalibrationFactors
): number {
  const factor = factors[cohortKey] ?? 1;
  return clamp(rawMpr * factor);
}

/** Cobertura da calibração — base do selo "Proxy" vs "Calibrado" na UI. */
export type CalibrationSummary = {
  /** Há ao menos uma coorte com confiança mínima. */
  active: boolean;
  /** Coortes com n ≥ MIN_CONFIDENCE_N. */
  matureCohorts: number;
  totalObservations: number;
};

export function summarizeCalibration(
  observations: CalibrationObservation[]
): CalibrationSummary {
  const counts = new Map<string, number>();
  for (const obs of observations) {
    counts.set(obs.cohortKey, (counts.get(obs.cohortKey) ?? 0) + 1);
  }
  let matureCohorts = 0;
  for (const n of counts.values()) {
    if (n >= MIN_CONFIDENCE_N) matureCohorts += 1;
  }
  return {
    active: matureCohorts > 0,
    matureCohorts,
    totalObservations: observations.length,
  };
}
