export const MONETARY_CONCEPTS = {
  protected: {
    label: "Receita protegida",
    description:
      "Valor econômico dos pacientes ativos, ainda dentro do ciclo esperado de retorno.",
  },
  atRisk: {
    label: "Receita em risco",
    description:
      "Valor econômico dos pacientes que passaram do ciclo, mas ainda estão dentro da janela de recuperação.",
  },
  lost: {
    label: "Receita perdida",
    description:
      "Valor econômico dos pacientes que ultrapassaram a janela considerada recuperável pelo modelo.",
  },
  recoverable: {
    label: "Receita recuperável estimada",
    shortLabel: "Receita recuperável",
    description:
      "Parcela estimada da receita em risco que pode retornar, ponderada pela probabilidade de retorno de cada paciente.",
  },
} as const;

export const MONETARY_COMPOSITION_EXPLANATION =
  "Receita protegida, em risco e perdida dividem o potencial econômico da carteira. A receita recuperável estimada é uma parcela da receita em risco e não deve ser somada às três.";
