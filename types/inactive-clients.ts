export type ClientStatus = "critical" | "risk" | "attention" | "monitor";

export type ClientHistoryItem = {
  date: string;
  procedure: string;
  amount: number;
};

/** Projeção de UI de um RelationshipEconomics em estado `em_risco`. */
export type InactiveClient = {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarInitials: string;
  avatarHue?: number;
  clientSince: string;
  procedure: string;
  professional: string;
  lastVisit: string;
  /** ISO date da última visita — usado em filtros e exportação */
  lastVisitAt: string;
  daysWithoutReturn: number;
  /** Dias além do ciclo esperado (atraso real para o retorno). */
  daysAfterCycle: number;
  status: ClientStatus;
  /** Receita esperada = VEP × MPR/100. */
  receitaEsperada: number;
  /** Probabilidade de retorno (MPR, 0–100) — explica o potencial ponderado. */
  returnProbability: number;
  proceduresCount: number;
  totalSpent: number;
  avgTicket: number;
  lastProcedure: string;
  recommendedProcedure: string;
  idealInterval: string;
  suggestedWindow: string;
  history: ClientHistoryItem[];
};

export type MetricCardData = {
  id: string;
  label: string;
  value: string;
  revenue?: string;
  subLabel?: string;
  statusVariant: ClientStatus | "total";
};

export type InactiveClientsFilterTab = "all" | ClientStatus;

import type { ClinicCalculationConfig } from "@/lib/settings/clinic-calculation-config";
import type { ClientDirectoryEntry } from "@/lib/clients/directory";

export type InactiveClientsPageData = {
  /**
   * Índice de TODOS os pacientes com a aba de cada um — permite responder
   * "não achei aqui, onde está?" sem consulta extra.
   */
  directory: ClientDirectoryEntry[];
  dateRangeLabel: string;
  totalCount: number;
  totalPages: number;
  metrics: MetricCardData[];
  clients: InactiveClient[];
  professionals: string[];
  calculationConfig: ClinicCalculationConfig;
};

/** Integração futura — Supabase PostgreSQL */
export type DbProfessional = {
  id: string;
  clinic_id: string;
  name: string;
  created_at: string;
};

export type DbReactivationMessage = {
  id: string;
  clinic_id: string;
  client_id: string;
  channel: string;
  status: string;
  sent_at: string | null;
  created_at: string;
};
