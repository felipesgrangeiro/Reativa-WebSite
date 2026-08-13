// Tipos de domínio da inteligência do Reativa+ (framework econômico v1.0).
// O motor oficial vive em `src/lib/revenue-intelligence/`; aqui ficam os tipos
// de entrada (Procedure/ReactivationPatient) e os contratos de UI do Consultor
// Reativa+, da Estratégia Ativa e da aba Segmentos.

import type { InterventionLevel } from "@/types/revenue-intelligence";

/** Procedimento da clínica com seu ciclo esperado de retorno. */
export type Procedure = {
  id: string;
  nome: string;
  categoria: string;
  ticketMedio: number;
  cicloEsperadoDias: number;
  toleranciaDias: number;
  ativo: boolean;
};

/** Paciente com o último procedimento realizado e quando. */
export type ReactivationPatient = {
  id: string;
  nome: string;
  telefone: string;
  procedureId: string;
  /** ISO date do último procedimento realizado. */
  dataUltimoProcedimento: string;
  /** Total de procedimentos já realizados — proxy de frequência/fidelidade. */
  totalVisitas: number;
  /** Profissional do último atendimento; ausente = desconhecido. */
  professional?: string;
  /** Engajamento histórico (0 a 1) — responsividade a contatos anteriores. */
  engajamento: number;
  /**
   * Ticket médio histórico do próprio paciente (média dos atendimentos dele).
   * Quando ausente, o pipeline usa o ticket médio do procedimento como proxy.
   */
  ticketMedioHistorico?: number;
  /**
   * Valor do último atendimento do paciente. Quando ausente, o pipeline usa o
   * ticket médio histórico (ou o do procedimento) como proxy.
   */
  ultimoTicket?: number;
  /**
   * Intervalos (em dias) entre visitas consecutivas do paciente, em ordem.
   * Alimentam Regularity e Cycle Adherence reais; quando ausentes ou
   * insuficientes, o pipeline cai nos proxies (engajamento e 100 − DT).
   */
  intervalosDias?: number[];
  /**
   * Total gasto real do paciente (coluna patients.total_spent) — base do
   * componente Monetary, a MESMA fonte da tela de Inativos. Quando ausente ou
   * zero, o pipeline usa o proxy (visitas × ticket do procedimento).
   */
  totalGasto?: number;
};

// Consultor Reativa+ — diagnósticos e ações

export type AdvisorTone = "info" | "opportunity" | "warning";

/** Insight determinístico gerado pelo Consultor Reativa+. */
export type AdvisorInsight = {
  id: string;
  title: string;
  body: string;
  tone: AdvisorTone;
};

/** Ações que o motor de decisão pode recomendar como melhor próximo passo. */
export type RecommendedActionType = "whatsapp" | "ligacao" | "oferta" | "consulta";

/**
 * Ação executiva derivada 1:1 de um diagnóstico do Consultor Reativa+.
 * O `id` espelha o id do insight de origem (top-leak / loss-risk / best-segment).
 */
export type DiagnosisAction = {
  id: string;
  medal: string;
  title: string;
  reason: string;
  recommendedAction: string;
  impact: string;
  /** Nível de Intervenção recomendado (rótulo oficial); ausente quando N/A. */
  interventionLabel?: string;
  /** Procedimento para o "Ver pacientes"; null = todos os fora do ciclo. */
  procedureId: string | null;
};

/**
 * Estratégia Ativa — derivada SEMPRE da recomendação nº 1 do Consultor Reativa+
 * (procedimento de maior receita em risco). É a ponte que contextualiza
 * automaticamente o Plano de Execução, a Mensagem Recomendada e o destaque
 * em Top Oportunidades. Não é um estado selecionável: é puramente derivada.
 */
export type ActiveStrategy = {
  procedureId: string;
  procedureName: string;
  /** Título da oportunidade (espelha o diagnóstico nº 1, sem a medalha). */
  headline: string;
  /** Pacientes Em Risco neste procedimento. */
  criticalPatients: number;
  /** MPR médio do grupo (probabilidade de retorno, 0–100). */
  avgMpr: number;
  /** Σ Receita Recuperável do grupo (R$). */
  revenueAtRisk: number;
  /** Σ Prioridade Econômica do grupo (R$). */
  prioridadeEconomica: number;
  /** Nível de Intervenção predominante do grupo (1–4). */
  interventionLevel: InterventionLevel;
  /** Rótulo oficial do Nível (Automação/Assistido/Personalizado/Estratégico). */
  interventionLabel: string;
  /** Canal de comunicação recomendado (ex.: "WhatsApp"). */
  channelLabel: string;
  channelType: RecommendedActionType;
  objective: string;
  /** Oferta/campanha recomendada (ex.: "Oferta Especial"). */
  offerLabel: string;
  offerSubtext: string;
  /** Nomes dos pacientes do procedimento, do mais ao menos crítico. */
  patientNames: string[];
};

// Aba Segmentos — centro de agrupamento da carteira (Revenue Intelligence)

/** Lente de segmentação. */
export type SegmentGroup = "value" | "procedure" | "behavior" | "action";

/** Linha da tabela dinâmica de um segmento. */
export type SegmentMember = {
  patientId: string;
  patientName: string;
  procedureName: string;
  daysOutOfCycle: number;
  revenue: number;
  /** MPR do paciente (probabilidade de retorno, 0–100). */
  rScore: number;
  actionLabel: string;
};

/** Um segmento da carteira, com seus pacientes para a tabela dinâmica. */
export type CarteiraSegment = {
  id: string;
  group: SegmentGroup;
  label: string;
  emoji?: string;
  description?: string;
  color: string;
  patientCount: number;
  revenue: number;
  avgScore: number | null;
  actionLabel: string | null;
  /** Métrica contextual extra (ex.: "ICR 50%", "Ticket médio R$ 1.850"). */
  metricLabel?: string;
  members: SegmentMember[];
};

export type SegmentsSummary = {
  activeSegments: number;
  monitoredPatients: number;
  revenueAtRisk: number;
  hiddenAssets: number;
};

export type SegmentsData = {
  summary: SegmentsSummary;
  valueSegments: CarteiraSegment[];
  procedureSegments: CarteiraSegment[];
  behaviorSegments: CarteiraSegment[];
  actionSegments: CarteiraSegment[];
};
