export const PRIORITY_CONCEPT = {
  label: "Prioridade econômica",
  description:
    "Organiza a fila pelo impacto estimado de agir agora. Combina a receita recuperável estimada com a deterioração temporal do relacionamento.",
  formula: "Receita recuperável estimada × deterioração temporal",
  relativeBands:
    "As faixas Alta, Média e Baixa são relativas ao maior valor da fila atual e podem mudar conforme o recorte.",
} as const;

export const INTERVENTION_CONCEPT = {
  label: "Nível de intervenção",
  statusLabel: "Regra inicial",
  description:
    "Sugere quanto esforço dedicar ao contato conforme o valor recuperável estimado. As faixas atuais são regras iniciais e devem ser validadas no piloto.",
  levels: {
    1: "Automação",
    2: "Assistido",
    3: "Personalizado",
    4: "Estratégico",
  },
} as const;

export const ACTION_RECOMMENDATION_CONCEPT = {
  description:
    "Recomendação determinística do modelo: o valor define a intensidade do contato e o MPR estimado ajuda a escolher o canal. Não é uma decisão gerada por IA.",
} as const;
