// Clientes Perdidos — clientes que passaram da JANELA de recuperação (estado
// "perdido" do modelo econômico). Recuperação é improvável: a aba serve para
// win-back (última tentativa) e para análise de churn (quanto/onde perdemos).
// Reusa a classificação por ciclo (lib/inactive-clients/cycle).

import type { ClientHistoryItem } from "@/types/inactive-clients";
import type { ClientDirectoryEntry } from "@/lib/clients/directory";

/** Projeção de UI de um RelationshipEconomics em estado `perdido`. */
export type LostClient = {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarInitials: string;
  avatarHue?: number;
  procedure: string;
  professional: string;
  lastVisit: string;
  /** ISO da última visita. */
  lastVisitAt: string;
  daysWithoutReturn: number;
  /** Dias além do ciclo esperado (atraso real para o retorno). */
  daysAfterCycle: number;
  /** Data em que cruzou a janela de recuperação (passou a perdido). */
  lostSince: string;
  /** Receita perdida (valor econômico do relacionamento — VEP, não ponderado). */
  lostRevenue: number;
  avgTicket: number;
  totalSpent: number;
  proceduresCount: number;
  clientSince: string;
  history: ClientHistoryItem[];
};

export type LostMetricVariant = "total" | "revenue" | "ticket" | "leak";

export type LostMetricCardData = {
  id: string;
  label: string;
  value: string;
  revenue?: string;
  subLabel?: string;
  variant: LostMetricVariant;
};

/** Vazamento por procedimento — onde a clínica mais perde clientes/receita. */
export type LostProcedureLeak = {
  procedure: string;
  count: number;
  lostRevenue: number;
};

export type LostClientsPageData = {
  /**
   * Índice de TODOS os pacientes com a aba de cada um — permite responder
   * "não achei aqui, onde está?" sem consulta extra.
   */
  directory: ClientDirectoryEntry[];
  dateRangeLabel: string;
  totalCount: number;
  totalLostRevenue: number;
  metrics: LostMetricCardData[];
  leaks: LostProcedureLeak[];
  clients: LostClient[];
  professionals: string[];
};
