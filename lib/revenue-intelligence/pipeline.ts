// Orquestração do framework econômico: dados brutos → 3 camadas.
//
// Os componentes VER/HR/DT/MPR são montados por `computeMprComponents`
// (./components) — fonte única dos inputs, compartilhada com a tela de Clientes
// Inativos. Aqui ficam só a classificação de estado (Camada 1), o VEP/Receitas
// (Camada 2) e a Prioridade/Nível (Camada 3).
//
// Inputs ainda em proxy v1: Receita Real = 0 (sem novo evento gerador desde o
// último — correto, pois a âncora é o último atendimento).

import type {
  Procedure,
  ReactivationPatient,
} from "@/types/reactivation-intelligence";
import type {
  CarteiraEconomics,
  MprBand,
  ProcedureLeak,
  RelationshipEconomics,
} from "@/types/revenue-intelligence";
import {
  classifyRelationship,
  limiteRecuperacaoDias,
  revenueState,
} from "./relationship";
import {
  computeVEP,
  receitaEsperada,
  receitaNaoRealizada,
  receitaRecuperavel,
} from "./revenue";
import { computeMprComponents } from "./components";
import {
  filaInteligente,
  nivelIntervencao,
  prioridadeEconomica,
} from "./decision";
import {
  HEALTH_WEIGHT,
  MPR_ALTA,
  MPR_MEDIA,
  RECOVERY_TOLERANCE_DAYS,
} from "./constants";
import {
  applyCalibration,
  cohortKeyFor,
  type CalibrationFactors,
} from "./calibration";
import { CURRENT_ECONOMIC_FORMULA_VERSION } from "./formula-version";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / MS_PER_DAY);
}

/**
 * Valor monetário bruto do relacionamento (base do componente Monetary).
 * Gasto real do paciente primeiro (mesma fonte da tela de Inativos:
 * patients.total_spent); sem valor real, proxy = visitas × ticket do
 * procedimento. Unifica o Monetary entre Dashboard/Central e Inativos.
 */
function monetaryValue(
  patient: ReactivationPatient,
  procedure: Procedure
): number {
  if (patient.totalGasto != null && patient.totalGasto > 0) {
    return patient.totalGasto;
  }
  return patient.totalVisitas * procedure.ticketMedio;
}

export type BuildEconomicsOptions = {
  now?: Date;
  /** Fatores de calibração do MPR por coorte (Estágio 2). Opt-in. */
  calibration?: CalibrationFactors;
  /** Janela de recuperação (dias) configurada pela clínica. Sem valor → default. */
  toleranceDays?: number;
};

type Eligible = { patient: ReactivationPatient; procedure: Procedure };

/** Calcula a economia de um relacionamento (todas as três camadas). */
function buildOne(
  { patient, procedure }: Eligible,
  now: Date,
  maxMonetary: number,
  calibration: CalibrationFactors | undefined,
  toleranceDays: number
): RelationshipEconomics {
  const ciclo = procedure.cicloEsperadoDias;
  // Janela de recuperação GLOBAL (configurável pela clínica) — janela única até
  // "perdido". Não usa procedure.toleranciaDias.
  const limite = limiteRecuperacaoDias(ciclo, toleranceDays);
  const diasDecorridos = daysBetween(
    new Date(patient.dataUltimoProcedimento),
    now
  );

  // Camada 1
  const state = classifyRelationship(diasDecorridos, ciclo, limite);

  // Camada 2 — componentes e MPR bruto pelo montador compartilhado (fonte única
  // de inputs, igual à tela de Inativos).
  const componentResult = computeMprComponents({
    diasDecorridos,
    ciclo,
    limite,
    monetary: monetaryValue(patient, procedure),
    maxMonetary,
    totalVisitas: patient.totalVisitas,
    intervalosDias: patient.intervalosDias,
    engajamento: patient.engajamento,
  });
  const { ver, hr, dt, mpr: rawMpr } = componentResult;
  // Calibração (Estágio 2) atua só sobre o MPR bruto, sem tocar VER/HR/DT.
  const cohortKey = cohortKeyFor(procedure.nome, rawMpr);
  const calibrationFactor = calibration?.[cohortKey] ?? 1;
  const mpr = calibration
    ? applyCalibration(rawMpr, cohortKey, calibration)
    : rawMpr;
  // Ticket histórico/último do paciente quando disponíveis; senão, proxy pelo
  // ticket médio do procedimento. Mantém o VEP sensível a quanto cada paciente
  // realmente gasta, sem quebrar callers que ainda não fornecem esses dados.
  const ticketHistorico = patient.ticketMedioHistorico ?? procedure.ticketMedio;
  const ultimoTicket = patient.ultimoTicket ?? ticketHistorico;
  const vep = computeVEP(ticketHistorico, ultimoTicket);
  const esperada = receitaEsperada(vep, mpr);
  const naoRealizada = receitaNaoRealizada(esperada, 0);
  const recuperavel = receitaRecuperavel(naoRealizada, state);

  return {
    formulaVersion: CURRENT_ECONOMIC_FORMULA_VERSION,
    calculatedAt: now.toISOString(),
    calculationTrace: {
      inputs: {
        diasDecorridos,
        ciclo,
        limiteRecuperacaoDias: limite,
        toleranceDays,
        monetaryValue: monetaryValue(patient, procedure),
        maxMonetary,
        totalVisitas: patient.totalVisitas,
        intervalosDias: [...(patient.intervalosDias ?? [])],
        engajamento: patient.engajamento,
        ticketMedioHistorico: ticketHistorico,
        ultimoTicket,
        receitaReal: 0,
      },
      components: {
        monetary: componentResult.monetary,
        recency: componentResult.recency,
        returnCount: componentResult.returnCount,
        regularity: componentResult.regularity,
        cycleAdherence: componentResult.cycleAdherence,
        ver,
        hr,
        dt,
        rawMpr,
      },
      calibration: {
        cohortKey,
        factor: calibrationFactor,
        calibratedMpr: mpr,
      },
    },
    patientId: patient.id,
    patientName: patient.nome,
    procedureName: procedure.nome,
    professional: patient.professional ?? "—",
    totalVisitas: patient.totalVisitas,
    diasDecorridos,
    ciclo,
    limiteRecuperacaoDias: limite,
    state,
    revenueState: revenueState(state),
    ver,
    hr,
    dt,
    mpr,
    vep,
    ticketMedio: ticketHistorico,
    ultimoTicket,
    valorHistorico: patient.totalVisitas * ticketHistorico,
    receitaEsperada: esperada,
    receitaNaoRealizada: naoRealizada,
    receitaRecuperavel: recuperavel,
    // Camada 3
    prioridadeEconomica: prioridadeEconomica(recuperavel, dt),
    nivelIntervencao: nivelIntervencao(recuperavel),
  };
}

/**
 * Constrói a economia de todos os relacionamentos com procedimento ativo
 * conhecido. A normalização do Monetary usa o maior valor monetário da carteira.
 */
export function buildRelationshipEconomics(
  patients: ReactivationPatient[],
  procedures: Procedure[],
  options: BuildEconomicsOptions = {}
): RelationshipEconomics[] {
  const now = options.now ?? new Date();
  const byId = new Map(procedures.map((p) => [p.id, p]));

  const eligible: Eligible[] = [];
  for (const patient of patients) {
    const procedure = byId.get(patient.procedureId);
    if (!procedure || !procedure.ativo) continue;
    eligible.push({ patient, procedure });
  }

  const maxMonetary = Math.max(
    1,
    ...eligible.map((e) => monetaryValue(e.patient, e.procedure))
  );

  const toleranceDays =
    options.toleranceDays && options.toleranceDays > 0
      ? options.toleranceDays
      : RECOVERY_TOLERANCE_DAYS;

  return eligible.map((e) =>
    buildOne(e, now, maxMonetary, options.calibration, toleranceDays)
  );
}

function mprBand(mpr: number): MprBand {
  if (mpr >= MPR_ALTA) return "alta";
  if (mpr >= MPR_MEDIA) return "media";
  return "baixa";
}

/**
 * Vazamento por procedimento — soma a Receita Recuperável (Em Risco) e conta os
 * pacientes por procedimento, do maior para o menor. Deriva do motor oficial.
 */
export function procedureLeaks(
  economics: RelationshipEconomics[]
): ProcedureLeak[] {
  const map = new Map<string, ProcedureLeak>();
  for (const e of economics) {
    if (e.state !== "em_risco") continue;
    const entry = map.get(e.procedureName) ?? {
      procedureName: e.procedureName,
      patientsAtRisk: 0,
      revenueAtRisk: 0,
    };
    entry.patientsAtRisk += 1;
    entry.revenueAtRisk += e.receitaRecuperavel;
    map.set(e.procedureName, entry);
  }
  return [...map.values()].sort((a, b) => b.revenueAtRisk - a.revenueAtRisk);
}

/**
 * Consolida a economia da carteira a partir dos relacionamentos calculados.
 *
 * `pacientesSemAtendimento` é opcional porque só o adaptador que conhece a base
 * cadastral sabe quem ficou de fora; quem chama com relacionamentos já prontos
 * omite, e o campo fica ausente em vez de zerado.
 */
export function buildCarteiraEconomics(
  economics: RelationshipEconomics[],
  pacientesSemAtendimento?: number
): CarteiraEconomics {
  const sumVepWhere = (state: RelationshipEconomics["state"]) =>
    economics
      .filter((e) => e.state === state)
      .reduce((acc, e) => acc + e.vep, 0);

  const emRiscoItems = economics.filter((e) => e.state === "em_risco");
  const total = economics.length;

  // ISC — média ponderada da saúde dos relacionamentos (0 = todos perdidos).
  const isc = total
    ? Math.round(
        (economics.reduce((acc, e) => acc + HEALTH_WEIGHT[e.state], 0) / total) *
          100
      )
    : 100;
  const iscTone =
    isc >= 70 ? "good" : isc >= 40 ? "warning" : "critical";
  const iscLabel =
    iscTone === "good"
      ? "Saudável"
      : iscTone === "warning"
        ? "Atenção"
        : "Crítico";

  const mprDistribution: Record<MprBand, number> = { alta: 0, media: 0, baixa: 0 };
  for (const e of economics) mprDistribution[mprBand(e.mpr)] += 1;

  return {
    formulaVersion:
      economics[0]?.formulaVersion ?? CURRENT_ECONOMIC_FORMULA_VERSION,
    calculatedAt: economics[0]?.calculatedAt ?? new Date().toISOString(),
    isc,
    iscTone,
    iscLabel,
    iscTrend30d: null,
    receitaProtegida: sumVepWhere("ativo"),
    receitaEmRisco: sumVepWhere("em_risco"),
    receitaPerdida: sumVepWhere("perdido"),
    ativos: economics.filter((e) => e.state === "ativo").length,
    emRisco: emRiscoItems.length,
    perdidos: economics.filter((e) => e.state === "perdido").length,
    receitaRecuperavelTotal: economics.reduce(
      (acc, e) => acc + e.receitaRecuperavel,
      0
    ),
    receitaEsperadaTotal: economics.reduce((acc, e) => acc + e.receitaEsperada, 0),
    potencialEconomicoTotal: economics.reduce((acc, e) => acc + e.vep, 0),
    mprMedio: total
      ? Math.round(economics.reduce((acc, e) => acc + e.mpr, 0) / total)
      : 0,
    mprDistribution,
    fila: filaInteligente(emRiscoItems),
    pacientes: filaInteligente(economics),
    pacientesSemAtendimento,
  };
}
