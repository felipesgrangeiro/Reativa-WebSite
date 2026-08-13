export type ReportTab =
  | "history"
  | "professional"
  | "procedure"
  | "evolution";

export type ActionResult =
  | "respondeu"
  | "sem_resposta"
  | "agendado"
  | "reativado"
  | "realizado"
  | "contato_enviado"
  | "contatar_depois"
  | "nao_contatado";

export type ActionType =
  | "mensagem_enviada"
  | "ligacao_realizada"
  | "agendado"
  | "reativado"
  | "atendimento_realizado"
  | "status_alterado";

export type ActionChannel = "whatsapp" | "telefone";

export type ReportMetric = {
  id: string;
  label: string;
  value: string;
  change: string;
  changeLabel: string;
  icon: "send" | "message" | "calendar" | "check" | "dollar" | "percent";
  color: string;
  helper?: string;
};

export type ReportActionRow = {
  id: string;
  patientId: string;
  datetime: string;
  clientName: string;
  clientInitials: string;
  avatarHue: number;
  procedure: string;
  actionType: ActionType;
  channel: ActionChannel;
  responsible: string;
  result: ActionResult;
  generatedValue: number | null;
};

export type DonutSegment = {
  label: string;
  count: number;
  percentage: number;
  color: string;
};

export type RevenueTrendPoint = {
  date: string;
  value: number;
};

export type FunnelStep = {
  label: string;
  count: number;
  percentage: number;
  valueLabel?: string;
};

export type ReportPerformanceRow = {
  id: string;
  name: string;
  appointments: number;
  clients: number;
  revenue: number;
  avgTicket: number;
  sharePercentage: number;
};

export type ReportInsight = {
  message: string;
  actionLabel: string;
  href: string;
};

export type ReportFilters = {
  dateFrom: Date | null;
  dateTo: Date | null;
  professional: string;
  procedure: string;
};

export type ReportAppointmentRecord = {
  id: string;
  patientId: string;
  patientName: string;
  appointmentDate: string;
  amount: number;
  procedureName: string;
  professionalName: string | null;
};

export type ReportsPageData = {
  dateRangeLabel: string;
  metrics: ReportMetric[];
  actions: ReportActionRow[];
  totalActions: number;
  totalRecords: number;
  totalPages: number;
  totalRecoveredRevenue: number;
  recoveredRevenueChange: string;
  totalBusinessRevenue: number;
  donutSegments: DonutSegment[];
  totalRevenue: number;
  revenueChange: string;
  revenueTrend: RevenueTrendPoint[];
  funnelSteps: FunnelStep[];
  professionalPerformance: ReportPerformanceRow[];
  procedurePerformance: ReportPerformanceRow[];
  insight: ReportInsight;
};

export type ReportReactivationActionRecord = {
  id: string;
  patientId: string;
  patientName: string;
  actionType: "whatsapp" | "status_change" | "call" | "attempt";
  status: string | null;
  /** Resultado de uma tentativa (action_type "attempt") — null para os demais tipos. */
  result: string | null;
  channel: string | null;
  createdAt: string;
  createdByName: string | null;
};

export type ReportRecoveredRevenueRecord = {
  id: string;
  patientId: string | null;
  amount: number;
  recognizedAt: string;
};

export type ReportsRawData = {
  appointments: ReportAppointmentRecord[];
  reactivationActions: ReportReactivationActionRecord[];
  recoveredRevenue: ReportRecoveredRevenueRecord[];
  totalPatients: number;
  inactivePatients: number;
  professionals: string[];
  procedures: string[];
};
