import { MPR_ALTA, MPR_MEDIA } from "./constants";

export const MPR_CONCEPT = {
  label: "MPR estimado",
  fullName: "Motor de Probabilidade de Retorno",
  description:
    "Estimativa de 0% a 100% da probabilidade de o paciente retornar. Considera valor econômico, histórico do relacionamento e deterioração pelo tempo; não representa garantia de retorno.",
  modelInitial: {
    label: "Modelo inicial",
    description:
      "Estimativa calculada pela fórmula oficial do Reativa+, ainda sem ajuste por volume suficiente de resultados da clínica.",
  },
  calibrated: {
    label: "Calibrado com dados da clínica",
    description:
      "Estimativa ajustada com resultados reais de coortes maduras da própria clínica.",
  },
} as const;

export type MprBand = "alta" | "media" | "baixa";

export function getMprBand(value: number): MprBand {
  if (value >= MPR_ALTA) return "alta";
  if (value >= MPR_MEDIA) return "media";
  return "baixa";
}

export const MPR_BANDS = {
  alta: { label: "Alta", range: `≥${MPR_ALTA}%` },
  media: { label: "Média", range: `${MPR_MEDIA}–${MPR_ALTA - 1}%` },
  baixa: { label: "Baixa", range: `<${MPR_MEDIA}%` },
} as const;

export function getMprModelStatus(calibrated: boolean) {
  return calibrated ? MPR_CONCEPT.calibrated : MPR_CONCEPT.modelInitial;
}
