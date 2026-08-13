import { describe, expect, it } from "vitest";
import {
  CURRENT_ECONOMIC_FORMULA_VERSION,
  ECONOMIC_FORMULA_REGISTRY,
  getEconomicFormulaDefinition,
} from "./formula-version";
import { HR_WEIGHTS, MPR_WEIGHTS, VEP_WEIGHTS, VER_WEIGHTS } from "./constants";

describe("registro de versões das fórmulas", () => {
  it("resolve a versão corrente para uma definição completa", () => {
    const definition = getEconomicFormulaDefinition();
    expect(definition.version).toBe(CURRENT_ECONOMIC_FORMULA_VERSION);
    expect(definition.formulas).toMatchObject({
      ver: VER_WEIGHTS,
      hr: HR_WEIGHTS,
      mpr: MPR_WEIGHTS,
      vep: VEP_WEIGHTS,
    });
  });

  it("mantém o registro e a definição publicados imutáveis", () => {
    expect(Object.isFrozen(ECONOMIC_FORMULA_REGISTRY)).toBe(true);
    expect(Object.isFrozen(getEconomicFormulaDefinition())).toBe(true);
    expect(Object.isFrozen(getEconomicFormulaDefinition().formulas.ver)).toBe(
      true
    );
  });
});

