import type {
  EconomicCalculationTrace,
  EconomicFormulaVersion,
} from "@/types/revenue-intelligence";
import { computeMprComponents } from "./components";
import { classifyRelationship } from "./relationship";
import {
  computeVEP,
  receitaEsperada,
  receitaNaoRealizada,
  receitaRecuperavel,
} from "./revenue";
import { nivelIntervencao, prioridadeEconomica } from "./decision";
import { clamp } from "./revenue";

export type ReproducedEconomicCalculation = {
  ver: number;
  hr: number;
  dt: number;
  rawMpr: number;
  mpr: number;
  vep: number;
  receitaEsperada: number;
  receitaNaoRealizada: number;
  receitaRecuperavel: number;
  prioridadeEconomica: number;
  nivelIntervencao: 1 | 2 | 3 | 4;
};

/** Reexecuta uma versão publicada usando somente a evidência do snapshot. */
export function reproduceEconomicCalculation(
  formulaVersion: EconomicFormulaVersion,
  trace: EconomicCalculationTrace
): ReproducedEconomicCalculation {
  if (formulaVersion !== "reativa-1.0.0") {
    const exhaustive: never = formulaVersion;
    throw new Error(`Versão de fórmula não suportada: ${exhaustive}`);
  }

  const input = trace.inputs;
  const components = computeMprComponents({
    diasDecorridos: input.diasDecorridos,
    ciclo: input.ciclo,
    limite: input.limiteRecuperacaoDias,
    monetary: input.monetaryValue,
    maxMonetary: input.maxMonetary,
    totalVisitas: input.totalVisitas,
    intervalosDias: input.intervalosDias,
    engajamento: input.engajamento,
  });
  const mpr = clamp(components.mpr * trace.calibration.factor);
  const vep = computeVEP(input.ticketMedioHistorico, input.ultimoTicket);
  const expected = receitaEsperada(vep, mpr);
  const unrealized = receitaNaoRealizada(expected, input.receitaReal);
  const state = classifyRelationship(
    input.diasDecorridos,
    input.ciclo,
    input.limiteRecuperacaoDias
  );
  const recoverable = receitaRecuperavel(unrealized, state);

  return {
    ver: components.ver,
    hr: components.hr,
    dt: components.dt,
    rawMpr: components.mpr,
    mpr,
    vep,
    receitaEsperada: expected,
    receitaNaoRealizada: unrealized,
    receitaRecuperavel: recoverable,
    prioridadeEconomica: prioridadeEconomica(recoverable, components.dt),
    nivelIntervencao: nivelIntervencao(recoverable),
  };
}

