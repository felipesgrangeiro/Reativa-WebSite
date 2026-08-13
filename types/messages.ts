// Aba Mensagens — central de modelos de abordagem para reativação

export type MessageStatus = "ativa" | "rascunho" | "inativa";
export type MessageChannel = "whatsapp" | "sms" | "email";
export type MessageObjective =
  | "manutencao"
  | "atraso"
  | "vip"
  | "boas_vindas"
  | "oferta";

/** Métricas de desempenho de uma mensagem. */
export type MessageMetrics = {
  enviadas: number;
  respondidas: number;
  agendamentos: number;
  comparecimentos: number;
  receitaRecuperada: number;
};

/** Modelo de mensagem cadastrado na biblioteca. */
export type ReactivationMessage = {
  id: string;
  nome: string;
  /** id do procedimento da biblioteca, ou null para "qualquer procedimento". */
  procedureId: string | null;
  procedureName: string;
  segment: string;
  channel: MessageChannel;
  objective: MessageObjective;
  status: MessageStatus;
  body: string;
  metrics: MessageMetrics;
};

/** Modelo pronto por situação (não é da biblioteca — serve para iniciar uma). */
export type SituationTemplate = {
  id: string;
  label: string;
  objective: MessageObjective;
  body: string;
};

/** Variável automática que pode ser inserida no texto. */
export type MessageVariable = {
  token: string;
  label: string;
};

export type MessagesSummary = {
  total: number;
  active: number;
  avgResponseRate: number | null;
  bestMessage: { nome: string; responseRate: number } | null;
};
