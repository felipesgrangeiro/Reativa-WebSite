// Alerta de ciclo (mesma régua de Clientes): monitor → attention → risk →
// critical. Substitui a antiga "prioridade por dias corridos".
import type { ClientStatus as AlertTier } from "@/types/inactive-clients";
import type {
  CarteiraEconomics,
  InterventionLevel,
} from "@/types/revenue-intelligence";
import type { ActiveStrategy } from "@/types/reactivation-intelligence";
import type { ProcedureRecovery } from "@/lib/dashboard/procedure-recovery";
import type {
  LossReason,
  PipelineStage,
  ReactivationAttempt,
} from "@/types/reactivation-crm";

export type ClientStatus =
  | "nao_contatado"
  | "contato_enviado"
  | "respondeu"
  | "agendado"
  | "sem_resposta"
  | "contatar_depois"
  | "reativado";

export type { AlertTier };

export type ReactivationFilterTab = "all" | ClientStatus;

/** Projeção operacional/CRM de um RelationshipEconomics fora do ciclo. */
export interface ReactivationClient {
  id: string;
  name: string;
  phone: string;
  email: string;
  procedure: string;
  professional: string;
  lastVisit: string;
  /** ISO — usado em filtros de período */
  lastVisitAt: string;
  daysInactive: number;
  /** Dias além do ciclo do procedimento = max(0, daysInactive − ciclo). */
  daysAfterCycle: number;
  amountSpent: number;
  /** Valor Econômico Potencial canônico do relacionamento. */
  vep: number;
  /** Alerta de ciclo (urgência): monitor → attention → risk → critical. */
  alert: AlertTier;
  status: ClientStatus;
  totalProcedures: number;
  clientSince: string;
  avatarInitials: string;
  avatarHue?: number;
  suggestedMessage: string;
  avatarUrl?: string;
  /** Receita recuperada (realizada) quando o paciente foi reativado. */
  recoveredAmount?: number | null;
  // Inteligência econômica (consumida do motor — não recalcula fórmulas).
  prioridadeEconomica?: number;
  receitaRecuperavel?: number;
  /** Receita esperada = VEP × probabilidade (mesma base de Clientes). */
  receitaEsperada: number;
  mpr?: number;
  /** Degradação temporal oficial (0–100), usada como desempate da fila. */
  dt?: number;
  /** Nível oficial de intervenção recomendado pelo motor econômico. */
  nivelIntervencao?: InterventionLevel;
  interventionLabel?: string;
  recommendedAction?: string;
  /** Estágio do Kanban — null/ausente = nunca movido (usa default por status). */
  pipelineStage?: PipelineStage | null;
  lossReason?: LossReason | null;
  /** Histórico real de tentativas de contato (reactivation_actions). */
  attempts?: ReactivationAttempt[];
}

export type ReactivationMetric = {
  id: string;
  label: string;
  count?: number;
  value: string;
  subLabel: string;
  icon: "users" | "send" | "chat" | "calendar" | "check" | "wallet";
  color: string;
};

/** Insumos do Plano de Reativação (Consultor Reativa+) — derivados do motor econômico. */
export type ReactivationPlan = {
  carteira: CarteiraEconomics;
  activeStrategy: ActiveStrategy | null;
  recoveries: ProcedureRecovery[];
};

export type ReactivationPageData = {
  dateRangeLabel: string;
  totalCount: number;
  totalPages: number;
  metrics: ReactivationMetric[];
  clients: ReactivationClient[];
  professionals: string[];
  procedures: string[];
  /** Plano consultivo revelado no banner "Próximo passo"; null se sem dados. */
  plan: ReactivationPlan | null;
};
