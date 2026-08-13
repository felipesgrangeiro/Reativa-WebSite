import type { ClinicCalculationConfig } from "@/lib/settings/clinic-calculation-config";

export type MetricTrend = "up" | "down" | "neutral";

export type MetricVariant =
  | "default"
  | "positive"
  | "negative"
  | "highlight";

export type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  trend: MetricTrend;
  variant: MetricVariant;
  icon: "revenue" | "ticket" | "clients" | "newClients" | "inactive" | "potential";
  tooltip?: string;
};

export type RevenueTrendPoint = {
  month: string;
  value: number;
  label: string;
};

export type ProcedureShare = {
  name: string;
  percentage: number;
  revenue: number;
  color: string;
};

export type RecoverySegment = {
  id: string;
  label: string;
  clients: number;
  revenue: number;
  color: string;
};

export type ClientReturnStatus = {
  label: string;
  count: number;
  percentage: number;
  color: string;
};

export type ProcedureRankingRow = {
  id: string;
  procedure: string;
  revenue: number;
  sharePercentage: number;
  clients: number;
};

export type RetentionIndicator = {
  id: string;
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  trend: MetricTrend;
  /** Quando true, aumento é ruim (ex.: CAC) */
  invertTrendColor?: boolean;
};

export type DashboardAlert = {
  title: string;
  message: string;
  count: number;
  submessage: string;
  actionLabel: string;
};

export type DashboardSummary = {
  metrics: DashboardMetric[];
  revenueTrend: RevenueTrendPoint[];
  procedureShares: ProcedureShare[];
  totalRevenue: number;
  recoverySegments: RecoverySegment[];
  totalRecoveryPotential: number;
  clientReturnStatuses: ClientReturnStatus[];
  totalClients: number;
  procedureRanking: ProcedureRankingRow[];
  retentionIndicators: RetentionIndicator[];
  alert: DashboardAlert;
  lastUpdatedMinutes: number;
  dateRangeLabel: string;
};

export type DashboardAppointmentRecord = {
  patientId: string;
  appointmentDate: string;
  amount: number;
  procedureName: string;
  professionalName: string | null;
};

export type DashboardPatientRecord = {
  id: string;
  name: string | null;
  phone: string | null;
  lastVisitAt: string | null;
  totalSpent: number | null;
  averageTicket: number | null;
  createdAt: string;
};

export type DashboardFilters = {
  dateFrom: Date | null;
  dateTo: Date | null;
  professional: string;
  procedure: string;
};

/** Desfecho das ações de reativação (loop de resultado — Estágio 1). */
export type ReactivationOutcomes = {
  /** Σ receita recuperada (realizada) de pacientes reativados. */
  recoveredRevenue: number;
  reactivatedCount: number;
  contactedCount: number;
  /** reativados ÷ contatados, 0–100. */
  conversionRate: number;
};

/**
 * Série diária dos 4 buckets de receita nos últimos ~30 dias
 * (de carteira_snapshots). Mesma quantidade de pontos em cada bucket.
 */
export type CarteiraTrend30d = {
  /** Datas realmente observadas; dias ausentes não são inventados. */
  dates: string[];
  formulaVersion: string;
  protegida: number[];
  risco: number[];
  perdida: number[];
  recuperavel: number[];
};

/**
 * Config da clínica serializável (plain objects, cruza server→client) que
 * sobrepõe ciclo/valor por procedimento e a janela de recuperação no motor
 * econômico do cockpit.
 */
export type EconomicProcedureOverrides = {
  cycleByName: Record<string, number>;
  priceByName: Record<string, number>;
  toleranceDays: number;
};

export type DashboardPageData = {
  appointments: DashboardAppointmentRecord[];
  patients: DashboardPatientRecord[];
  professionals: string[];
  procedures: string[];
  /** ISC ~30 dias atrás (de carteira_snapshots); null = sem histórico. */
  iscReference30d: number | null;
  /**
   * A leitura da referência de ISC falhou (schema/permissão) — diferente de
   * "ainda não há histórico". Ausente = não houve falha.
   */
  iscHistoryUnavailable?: boolean;
  /** Tendência diária dos 4 buckets (~30d); null = sem histórico suficiente. */
  carteiraTrend30d: CarteiraTrend30d | null;
  /** Desfecho realizado das reativações (receita recuperada + conversão). */
  reactivationOutcomes: ReactivationOutcomes;
  /** Fatores de calibração do MPR por coorte (Estágio 2); {} = neutro. */
  mprCalibration: Record<string, number>;
  /** Há ao menos uma coorte calibrada (confiança mínima) → selo "Calibrado". */
  mprCalibrationActive: boolean;
  /** Parâmetros de cálculo da clínica (Configurações). */
  calculationConfig: ClinicCalculationConfig;
  /** Ciclos/valores por procedimento + janela (para o motor econômico client-side). */
  procedureConfig: EconomicProcedureOverrides;
  /** Procedimentos importados que ainda usam parâmetros provisórios. */
  pendingProcedureReviewCount: number;
};

/** Schema futuro — Supabase PostgreSQL */
export type Clinic = {
  id: string;
  name: string;
  plan: string;
  created_at: string;
};

export type Client = {
  id: string;
  clinic_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  last_visit_at: string | null;
  status: string;
  created_at: string;
};

export type Procedure = {
  id: string;
  clinic_id: string;
  name: string;
  category: string | null;
  created_at: string;
};

export type Appointment = {
  id: string;
  clinic_id: string;
  client_id: string;
  procedure_id: string;
  appointment_date: string;
  amount: number;
  created_at: string;
};

export type ReactivationOpportunity = {
  id: string;
  clinic_id: string;
  client_id: string;
  days_without_return: number;
  estimated_revenue: number;
  status: string;
  created_at: string;
};

export type ImportRecord = {
  id: string;
  clinic_id: string;
  file_url: string;
  original_filename: string;
  status: string;
  created_at: string;
};
