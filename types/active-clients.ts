// Clientes Ativos (pilar de Retenção) — clientes DENTRO do ciclo do procedimento.
// Espelho inverso de Clientes Inativos: aqui o objetivo é manter o cliente antes
// que ele lapse. Reusa a classificação por ciclo (lib/inactive-clients/cycle).

import type { ClientHistoryItem } from "@/types/inactive-clients";
import type { ClientDirectoryEntry } from "@/lib/clients/directory";

/** Saúde do cliente ativo: saudável ou já na janela de atenção (prestes a sair). */
export type ActiveHealth = "healthy" | "attention";

/** Projeção de UI de um RelationshipEconomics em estado `ativo`. */
export type ActiveClient = {
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
  daysSinceVisit: number;
  /** Ciclo esperado do procedimento (dias). */
  ciclo: number;
  /** Progresso do ciclo (0–100). */
  cycleProgress: number;
  /** Dias restantes até o fim do ciclo. */
  daysUntilCycleEnd: number;
  health: ActiveHealth;
  /** Data prevista de fim do ciclo (quando passa a precisar de retorno). */
  cycleEndDate: string;
  /** Receita protegida (potencial associado ao relacionamento ativo). */
  protectedRevenue: number;
  avgTicket: number;
  totalSpent: number;
  proceduresCount: number;
  clientSince: string;
  /** Procedimento a reagendar no retorno (mesmo do último, por ora). */
  recommendedProcedure: string;
  /** Intervalo ideal de retorno (texto), baseado no ciclo do procedimento. */
  idealInterval: string;
  /** Janela ideal para agendar o retorno (do fim do ciclo até o limite). */
  bookingWindow: string;
  history: ClientHistoryItem[];
};

export type ActiveMetricVariant = "total" | "protected" | "attention" | "healthy";

export type ActiveMetricCardData = {
  id: string;
  label: string;
  value: string;
  revenue?: string;
  subLabel?: string;
  variant: ActiveMetricVariant;
};

export type ActiveClientsPageData = {
  /**
   * Índice de TODOS os pacientes com a aba de cada um — permite responder
   * "não achei aqui, onde está?" sem consulta extra.
   */
  directory: ClientDirectoryEntry[];
  dateRangeLabel: string;
  totalCount: number;
  metrics: ActiveMetricCardData[];
  clients: ActiveClient[];
  professionals: string[];
};
