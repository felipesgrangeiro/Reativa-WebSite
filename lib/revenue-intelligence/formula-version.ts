import {
  HR_WEIGHTS,
  MPR_WEIGHTS,
  VEP_WEIGHTS,
  VER_WEIGHTS,
} from "./constants";
import type { EconomicFormulaVersion } from "@/types/revenue-intelligence";

export const CURRENT_ECONOMIC_FORMULA_VERSION: EconomicFormulaVersion =
  "reativa-1.0.0";

export type EconomicFormulaDefinition = {
  version: EconomicFormulaVersion;
  releasedAt: string;
  description: string;
  formulas: {
    ver: Readonly<typeof VER_WEIGHTS>;
    hr: Readonly<typeof HR_WEIGHTS>;
    mpr: Readonly<typeof MPR_WEIGHTS>;
    vep: Readonly<typeof VEP_WEIGHTS>;
    dt: string;
    prioridadeEconomica: string;
  };
  methods: {
    regularity: string;
    cycleAdherence: string;
    monetaryNormalization: string;
    recency: string;
  };
};

/**
 * Registro append-only. Uma alteração matemática deve criar uma nova entrada;
 * versões publicadas nunca devem ser editadas retroativamente.
 */
export const ECONOMIC_FORMULA_REGISTRY: Readonly<
  Record<EconomicFormulaVersion, EconomicFormulaDefinition>
> = Object.freeze({
  "reativa-1.0.0": Object.freeze({
    version: "reativa-1.0.0",
    releasedAt: "2026-07-12",
    description: "Fórmulas canônicas iniciais do framework econômico REATIVA+.",
    formulas: Object.freeze({
      ver: Object.freeze({ ...VER_WEIGHTS }),
      hr: Object.freeze({ ...HR_WEIGHTS }),
      mpr: Object.freeze({ ...MPR_WEIGHTS }),
      vep: Object.freeze({ ...VEP_WEIGHTS }),
      dt: "clamp(((diasDecorridos-ciclo)/(limite-ciclo))*100,0,100)",
      prioridadeEconomica: "receitaRecuperavel*(dt/100)",
    }),
    methods: Object.freeze({
      regularity: "100*(1-coeficienteVariacaoIntervalos)",
      cycleAdherence: "100*(1-desvioRelativoMedioDoCiclo)",
      monetaryNormalization: "monetary/maxMonetary*100",
      recency: "100*(1-diasDecorridos/limite)",
    }),
  }),
});

export function getEconomicFormulaDefinition(
  version: EconomicFormulaVersion = CURRENT_ECONOMIC_FORMULA_VERSION
): EconomicFormulaDefinition {
  return ECONOMIC_FORMULA_REGISTRY[version];
}

