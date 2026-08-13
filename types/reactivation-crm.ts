import type { AlertTier } from "@/types/reactivation";

// Fase 3 — Central de Reativação 2.0 (CRM de recuperação)

/** Colunas do pipeline de reativação. */
export type PipelineStage =
  | "recuperar_hoje"
  | "em_contato"
  | "interessados"
  | "agendados"
  | "recuperados"
  | "perdidos";

/** Canal de uma ação/tentativa de contato. */
export type ActionChannel = "whatsapp" | "ligacao" | "email" | "sms";

/** Resultado de uma tentativa registrada. */
export type AttemptResult =
  | "sem_resposta"
  | "respondeu"
  | "agendou"
  | "recusou"
  | "aguardando";

/** Registro de uma tentativa de reativação (histórico). */
export type ReactivationAttempt = {
  id: string;
  channel: ActionChannel;
  /** ISO date da tentativa. */
  date: string;
  responsible: string;
  result: AttemptResult;
  note?: string;
};

/** Motivos de perda cadastrados. */
export type LossReason =
  | "preco"
  | "concorrencia"
  | "mudanca_cidade"
  | "sem_interesse"
  | "sem_tempo";

/** Próxima melhor ação recomendada para o paciente. */
export type NextBestAction = {
  channel: ActionChannel;
  label: string;
  reason: string;
};

/**
 * Projeção Kanban de um ReactivationClient; não é um segundo domínio econômico.
 */
export type PipelineCard = {
  clientId: string;
  name: string;
  procedure: string;
  avatarInitials: string;
  avatarHue?: number;
  /** Valor Econômico Potencial — default da receita realizada ao reativar. */
  vep: number;
  /** Receita Esperada oficial (VEP × MPR/100) — valor exibido no card. */
  receitaEsperada: number;
  daysInactive: number;
  /** Alerta de ciclo (urgência): monitor → attention → risk → critical. */
  alert: AlertTier;
  /** Prioridade Econômica oficial (ordena os cards na coluna). */
  prioridadeEconomica: number;
  stage: PipelineStage;
  nextAction: NextBestAction;
  attempts: ReactivationAttempt[];
  lossReason?: LossReason;
};
