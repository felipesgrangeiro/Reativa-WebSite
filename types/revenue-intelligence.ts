// REATIVA+ — Tipos do framework econômico oficial (v1.0).
// Camada 1 (Framework Operacional) → Camada 2 (Revenue Intelligence) →
// Camada 3 (Decision Intelligence). Fórmulas em `revenue.ts` / `decision.ts`.

/** Estado do relacionamento (Camada 1). */
export type RelationshipState = "ativo" | "em_risco" | "perdido";

/** Identificador imutável da versão matemática aplicada ao cálculo. */
export type EconomicFormulaVersion = "reativa-1.0.0";

/** Estado da receita, espelha o estado do relacionamento (Camada 1). */
export type RevenueState = "protegida" | "em_risco" | "perdida";

/** Nível de Intervenção recomendado (Camada 3). */
export type InterventionLevel = 1 | 2 | 3 | 4;

/**
 * Componentes normalizados (0–100) que alimentam VER e HR.
 * O cálculo desses componentes a partir de dados brutos (proxies v1) vive em
 * `pipeline.ts`; as fórmulas oficiais consomem os valores já normalizados.
 */
export type VERComponents = {
  /** Relevância monetária do relacionamento, normalizada na carteira. */
  monetary: number;
  /** Quão recente é o último evento gerador de receita. */
  recency: number;
};

export type HRComponents = {
  /** Quantidade de retornos, saturada. */
  returnCount: number;
  /** Consistência dos intervalos entre retornos. */
  regularity: number;
  /** Aderência histórica ao ciclo. */
  cycleAdherence: number;
};

/** Evidência completa necessária para reproduzir e auditar um cálculo. */
export type EconomicCalculationTrace = {
  inputs: {
    diasDecorridos: number;
    ciclo: number;
    limiteRecuperacaoDias: number;
    toleranceDays: number;
    monetaryValue: number;
    maxMonetary: number;
    totalVisitas: number;
    intervalosDias: number[];
    engajamento: number;
    ticketMedioHistorico: number;
    ultimoTicket: number;
    receitaReal: number;
  };
  components: {
    monetary: number;
    recency: number;
    returnCount: number;
    regularity: number;
    cycleAdherence: number;
    ver: number;
    hr: number;
    dt: number;
    rawMpr: number;
  };
  calibration: {
    cohortKey: string;
    factor: number;
    calibratedMpr: number;
  };
};

/** Resultado econômico completo de um relacionamento (saída do pipeline). */
export type RelationshipEconomics = {
  formulaVersion: EconomicFormulaVersion;
  /** Momento de referência do cálculo, em ISO-8601. */
  calculatedAt: string;
  calculationTrace: EconomicCalculationTrace;
  patientId: string;
  patientName: string;
  procedureName: string;
  /** Profissional do último atendimento ("—" quando desconhecido). */
  professional: string;
  /** Total de visitas já realizadas (1 = veio uma vez só). */
  totalVisitas: number;

  // Camada 1 — temporais
  diasDecorridos: number;
  ciclo: number;
  limiteRecuperacaoDias: number;
  state: RelationshipState;
  revenueState: RevenueState;

  // Camada 2 — Revenue Intelligence
  ver: number;
  hr: number;
  dt: number;
  mpr: number;
  vep: number;
  /** Ticket médio histórico do paciente (média do valor gasto por visita). */
  ticketMedio: number;
  /**
   * Valor do ÚLTIMO atendimento do paciente — o único número desta cadeia que
   * a clínica pode conferir no prontuário. Exposto para que toda estimativa
   * exibida tenha, ao lado, um fato auditável. Entra no VEP com peso 0,30.
   */
  ultimoTicket: number;
  /** Valor histórico estimado (LTV) = total de visitas × ticket histórico. */
  valorHistorico: number;
  receitaEsperada: number;
  receitaNaoRealizada: number;
  receitaRecuperavel: number;

  // Camada 3 — Decision Intelligence
  prioridadeEconomica: number;
  nivelIntervencao: InterventionLevel;
};

/** Vazamento de receita recuperável por procedimento (Em Risco). */
export type ProcedureLeak = {
  procedureName: string;
  patientsAtRisk: number;
  revenueAtRisk: number;
};

/**
 * Oportunidade de Recuperação — o procedimento agrupa relacionamentos Em Risco.
 * Unidade de decisão da camada de Decision Intelligence (Consultor Reativa+).
 */
export type RecoveryOpportunity = {
  procedureName: string;
  /** Σ Receita Recuperável do grupo (R$). */
  receitaRecuperavel: number;
  /** Relacionamentos Em Risco do procedimento. */
  relationshipsAtRisk: number;
  /** MPR médio do grupo (0–100). */
  avgMpr: number;
  /** Σ Prioridade Econômica do grupo (R$). */
  prioridadeEconomica: number;
  /** Faixa da Prioridade Econômica relativa à carteira. */
  prioridadeTier: "alta" | "media" | "baixa";
  /** Nível de Intervenção predominante (1–4) + rótulo oficial. */
  interventionLevel: InterventionLevel;
  interventionLabel: string;
  cicloDias: number;
  limiteRecuperacaoDias: number;
  /** Dias médios restantes na janela de recuperação. */
  avgRemainingDays: number;
  /** Por que esta oportunidade foi destacada (superlativo que ela lidera). */
  justification: string;
};

/** Faixa de probabilidade de retorno (MPR). */
export type MprBand = "alta" | "media" | "baixa";

/** Tom de saúde da carteira. */
export type IscTone = "good" | "warning" | "critical";

/** Consolidado econômico da carteira (alimenta o cockpit do dashboard). */
export type CarteiraEconomics = {
  formulaVersion: EconomicFormulaVersion;
  calculatedAt: string;
  // Bloco 1 — Saúde da carteira (Framework Operacional)
  /** Índice de Saúde da Carteira, 0–100. */
  isc: number;
  iscTone: IscTone;
  iscLabel: string;
  /** Variação do ISC em 30 dias; null enquanto não há histórico (snapshots). */
  iscTrend30d: number | null;
  /**
   * `iscTrend30d` é null porque a leitura do histórico FALHOU, não porque o
   * histórico ainda não existe. Sem isso a UI diz "aguarde 30 dias" para uma
   * espera que nunca termina.
   */
  iscTrendIndisponivel?: boolean;
  /** Σ VEP dos relacionamentos Ativos. */
  receitaProtegida: number;
  /** Σ VEP dos relacionamentos Em Risco. */
  receitaEmRisco: number;
  /** Σ VEP dos relacionamentos Perdidos. */
  receitaPerdida: number;
  ativos: number;
  emRisco: number;
  perdidos: number;

  // Bloco 2 — Revenue Intelligence
  /** Σ Receita Recuperável (só Em Risco). */
  receitaRecuperavelTotal: number;
  /** Σ Receita Esperada de toda a carteira. */
  receitaEsperadaTotal: number;
  /** Σ VEP de toda a carteira (potencial econômico bruto). */
  potencialEconomicoTotal: number;
  /** MPR médio da carteira (%). */
  mprMedio: number;
  /** Contagem de pacientes por faixa de MPR. */
  mprDistribution: Record<MprBand, number>;

  // Bloco 3 — Decision Intelligence
  /** Fila Inteligente — Em Risco ordenados por Prioridade Econômica desc. */
  fila: RelationshipEconomics[];
  /** Todos os relacionamentos (qualquer estado) ordenados por Prioridade Econômica desc. */
  pacientes: RelationshipEconomics[];

  /**
   * Pacientes cadastrados que não entraram em nenhum número desta carteira por
   * não terem nenhum atendimento no histórico — o motor parte de atendimentos,
   * então quem nunca veio (ou cujos atendimentos não importaram) fica invisível.
   *
   * AUSENTE (não zero) quando a origem não tem como medir: carteiras montadas a
   * partir de relacionamentos já calculados não conhecem a base cadastral, e um
   * zero ali seria exatamente o silêncio que este campo existe para eliminar.
   */
  pacientesSemAtendimento?: number;
};
