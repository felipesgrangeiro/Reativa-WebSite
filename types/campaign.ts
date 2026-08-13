// Aba Campanhas — acompanhamento de campanhas de reativação

export type CampaignStatus =
  | "ativa"
  | "concluida"
  | "agendada"
  | "pausada"
  | "rascunho";

export type CampaignSegment =
  | "criticos"
  | "atencao"
  | "risco"
  | "ativos"
  | "todos_inativos";

export type CampaignChannel = "whatsapp" | "sms" | "email";

export type Campaign = {
  id: string;
  name: string;
  subtitle: string;
  segment: CampaignSegment;
  /** Rótulo descritivo do segmento, ex.: "Risco (janela final)". */
  segmentLabel: string;
  channel: CampaignChannel;
  modelUsed: string;
  patients: number;
  status: CampaignStatus;
  responses: number | null;
  responseRate: number | null;
  appointments: number | null;
  appointmentRate: number | null;
  reactivations: number | null;
  reactivationRate: number | null;
  revenue: number | null;
  startDate: string | null;
  startTime: string | null;
  message: string;
};

export type CampaignMetricTrend = "up" | "down";

export type CampaignMetric = {
  id: string;
  label: string;
  value: string;
  subLabel: string;
  change: string;
  trend: CampaignMetricTrend;
  icon: "rocket" | "users" | "reply" | "calendar" | "wallet" | "repeat";
  color: string;
};

export type FunnelStage = {
  id: string;
  label: string;
  value: string;
  /** Percentual relativo ao topo do funil (null para etapas monetárias). */
  percent: string | null;
  highlight?: boolean;
};

export type PerformancePoint = {
  date: string;
  revenue: number;
  responses: number;
  appointments: number;
};

export type RecommendedCampaign = {
  id: string;
  title: string;
  patients: number;
  /** Receita recuperável/acionável estimada da campanha. */
  receitaRecuperavel: number;
  icon: "alert" | "bell" | "star";
  color: string;
};

export type CampaignsPageData = {
  metrics: CampaignMetric[];
  funnel: FunnelStage[];
  campaigns: Campaign[];
  performance: PerformancePoint[];
  recommendations: RecommendedCampaign[];
};
