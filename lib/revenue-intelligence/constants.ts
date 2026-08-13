// Pesos oficiais v1.0 — cada conjunto soma 1,0, logo são somas ponderadas.
// (No documento de arquitetura os termos aparecem com "*", mas os pesos somam
//  1,0; o operador correto é soma. Ver memória formulas-revenue-intelligence-v1.)

/** VER = 0,60·Monetary + 0,40·Recency. */
export const VER_WEIGHTS = { monetary: 0.6, recency: 0.4 } as const;

/** HR = 0,50·ReturnCount + 0,30·Regularity + 0,20·CycleAdherence. */
export const HR_WEIGHTS = {
  returnCount: 0.5,
  regularity: 0.3,
  cycleAdherence: 0.2,
} as const;

/** MPR = 0,25·VER + 0,35·HR + 0,40·(100 − DT). */
export const MPR_WEIGHTS = { ver: 0.25, hr: 0.35, decay: 0.4 } as const;

/** VEP = 0,70·TicketMédioHistórico + 0,30·ÚltimoTicket. */
export const VEP_WEIGHTS = { ticketMedioHistorico: 0.7, ultimoTicket: 0.3 } as const;

// ---------------------------------------------------------------------------
// Proxies v1 — calibração pendente (sem dados de histórico de visitas/ticket).
// ---------------------------------------------------------------------------

/**
 * Tolerância de Recuperação (dias após o ciclo até o paciente virar "perdido").
 * GLOBAL: vale para todos os procedimentos — o ciclo é por procedimento, mas a
 * janela extra é única. Limite de Recuperação = ciclo do procedimento + este
 * valor. Configurável (hoje fixo; UI em Configurações é só visual).
 */
export const RECOVERY_TOLERANCE_DAYS = 40;

/** Nº de retornos que satura o componente Return Count do HR. */
export const MAX_RETURN_COUNT = 10;

/**
 * Faixas de Nível de Intervenção por Receita Recuperável (R$): valores abaixo
 * de [0] → Nível 1; abaixo de [1] → Nível 2; abaixo de [2] → Nível 3; senão 4.
 * Placeholder — o documento define os níveis mas não as faixas.
 */
export const NIVEL_INTERVENCAO_FAIXAS = [300, 800, 2000] as const;

/** Limiares de MPR (%) para as faixas Alta / Média / Baixa probabilidade. */
export const MPR_ALTA = 70;
export const MPR_MEDIA = 40;

/**
 * Pesos de saúde por estado do relacionamento, base do Índice de Saúde da
 * Carteira (ISC): Ativo saudável, Em Risco parcial, Perdido nulo.
 */
export const HEALTH_WEIGHT = {
  ativo: 1,
  em_risco: 0.4,
  perdido: 0,
} as const;
