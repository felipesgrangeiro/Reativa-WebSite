export type ProcedureTab =
  | "revenue"
  | "quantity"
  | "ticket"
  | "inactive"
  | "opportunity";

export type InactiveSeverity = "high" | "medium" | "low" | "active";

export type ProcedureRow = {
  id: string;
  rank: number;
  name: string;
  iconColor: string;
  revenue: number;
  revenueShare: number;
  appointments: number;
  avgTicket: number;
  inactiveClients: number;
  inactiveSeverity: InactiveSeverity;
  opportunity: number;
};

export type ProcedureMetric = {
  id: string;
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: "revenue" | "procedures" | "ticket" | "clients" | "inactive";
  variant?: "default" | "danger";
};

export type ProcedureOpportunitySegment = {
  id: string;
  label: string;
  amount: number;
  percentage: number;
  color: string;
};

export type ProcedureInsight = {
  procedureName: string;
  inactiveCount: number;
  message: string;
  actionLabel: string;
};

export type FilterState = {
  period: string;
  professional: string;
  category: string;
  search: string;
};

export type ProcedureAppointmentRecord = {
  procedureId: string;
  procedureName: string;
  category: string | null;
  patientId: string;
  appointmentDate: string;
  amount: number;
  professionalName: string | null;
};

export type ProcedurePatientRecord = {
  patientId: string;
  lastProcedureName: string;
  daysWithoutReturn: number;
  status: import("@/types/inactive-clients").ClientStatus;
};

export type ProcedureCatalogItem = {
  id: string;
  name: string;
  category: string | null;
};

export type ProcedureFilters = {
  dateFrom: Date | null;
  dateTo: Date | null;
  professional: string;
  category: string;
  search: string;
};

export type ProceduresPageData = {
  dateRangeLabel: string;
  metrics: ProcedureMetric[];
  procedures: ProcedureRow[];
  opportunitySegments: ProcedureOpportunitySegment[];
  totalOpportunity: number;
  insight: ProcedureInsight;
  maxRevenue: number;
  professionals: string[];
  categories: string[];
  appointments: ProcedureAppointmentRecord[];
  patientLastProcedures: ProcedurePatientRecord[];
  procedureCatalog: ProcedureCatalogItem[];
};

/** Integração futura — Supabase PostgreSQL */
export type DbProcedure = {
  id: string;
  clinic_id: string;
  name: string;
  category: string | null;
  created_at: string;
};

export type DbProcedureMetric = {
  procedure_id: string;
  period_start: string;
  period_end: string;
  revenue: number;
  appointments: number;
  avg_ticket: number;
  inactive_clients: number;
  opportunity: number;
};
