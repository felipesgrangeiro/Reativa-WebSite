// Consultor Reativa+ — interpreta a carteira e gera recomendações determinísticas.
// Decision Intelligence: transforma os indicadores oficiais em ação clara.
// NÃO expõe listas de procedimentos nem construção manual — só os indicadores
// de decisão + recomendações + conclusão executiva. Reusa o motor oficial.

import type { RelationshipEconomics } from "@/types/revenue-intelligence";
import { buildCarteiraEconomics } from "./pipeline";
import {
  buildRecoveryOpportunities,
  buildStrategyImpact,
} from "./opportunities";
import { formatCurrency } from "@/lib/utils";

/** Indicadores de decisão exibidos após a análise. */
export type StrategicIndicators = {
  receitaRecuperavel: number;
  receitaEmRisco: number;
  pacientesEmRisco: number;
  /** Potencial econômico acionável = Σ Receita Recuperável. */
  potencialAcionavel: number;
  mprMedio: number;
  prazoIdealDias: number;
};

export type StrategicRecommendation = {
  id: string;
  title: string;
  body: string;
  reason: string;
};

export type StrategicDiagnosis = {
  /** Há oportunidade acionável (pacientes em risco recuperáveis). */
  hasOpportunity: boolean;
  indicators: StrategicIndicators;
  interpretation: string;
  recommendations: StrategicRecommendation[];
  conclusion: string;
};

/**
 * Gera o diagnóstico estratégico da carteira: indicadores de decisão,
 * interpretação, recomendações acionáveis e conclusão executiva. As
 * recomendações se adaptam aos dados (volume, receita, janela de recuperação).
 */
export function buildStrategicDiagnosis(
  economics: RelationshipEconomics[]
): StrategicDiagnosis {
  const carteira = buildCarteiraEconomics(economics);
  const opportunities = buildRecoveryOpportunities(economics);
  const impact = buildStrategyImpact(opportunities);

  const indicators: StrategicIndicators = {
    receitaRecuperavel: Math.round(carteira.receitaRecuperavelTotal),
    receitaEmRisco: Math.round(carteira.receitaEmRisco),
    pacientesEmRisco: carteira.emRisco,
    potencialAcionavel: impact.potencialAcionavel,
    mprMedio: carteira.mprMedio,
    prazoIdealDias: impact.prazoIdealDias,
  };

  const hasOpportunity = indicators.pacientesEmRisco > 0;

  if (!hasOpportunity) {
    return {
      hasOpportunity: false,
      indicators,
      interpretation:
        "A análise não encontrou relacionamentos em risco no momento. A " +
        "carteira está saudável — mantenha o monitoramento para agir assim " +
        "que surgirem oportunidades de recuperação.",
      recommendations: [],
      conclusion:
        "Não há ação de recuperação necessária agora. O Reativa+ segue " +
        "monitorando a carteira e avisará quando houver receita recuperável.",
    };
  }

  const mpr = indicators.mprMedio;
  const frentes = opportunities.length;
  const { alta, media, baixa } = carteira.mprDistribution;

  // Canal recomendado adapta-se à probabilidade média de retorno: alta → uma
  // mensagem bem direcionada converte; baixa → exige toque mais persuasivo.
  const canal =
    mpr >= 70
      ? {
          body: "Priorizar contato personalizado via WhatsApp com os pacientes de maior valor.",
          reason: `Probabilidade média de retorno alta (${mpr}%): uma abordagem individualizada tende a converter bem.`,
        }
      : mpr >= 40
        ? {
            body: "Combinar WhatsApp com ligação de reforço para os pacientes de maior valor.",
            reason: `Probabilidade média de retorno moderada (${mpr}%): mensagem isolada pode não bastar — reforce por ligação.`,
          }
        : {
            body: "Priorizar ligação ou oferta de retorno para os pacientes de maior valor.",
            reason: `Probabilidade média de retorno baixa (${mpr}%): canais mais persuasivos rendem mais que mensagem.`,
          };

  // Segmento prioritário adapta-se à distribuição de probabilidade da carteira:
  // havendo grupo de alta probabilidade, garanta as vitórias mais prováveis.
  const segmento =
    alta > 0
      ? {
          body: `Começar pelos ${alta} paciente(s) de alta probabilidade de retorno.`,
          reason:
            "Maior conversão por esforço — assegure primeiro as recuperações mais prováveis.",
        }
      : media > 0
        ? {
            body: `Concentrar nos ${media} paciente(s) de probabilidade média e maior valor econômico.`,
            reason:
              "Sem grupo de alta probabilidade no momento; priorize valor onde a chance ainda é razoável.",
          }
        : {
            body: "Priorizar os pacientes de maior valor econômico, mesmo com probabilidade menor.",
            reason: `A carteira concentra ${baixa} paciente(s) de baixa probabilidade — foque no retorno econômico do esforço.`,
          };

  const recommendations: StrategicRecommendation[] = [
    {
      id: "acao-prioritaria",
      title: "Ação Prioritária",
      body: `Iniciar imediatamente a reativação dos ${indicators.pacientesEmRisco} pacientes classificados como recuperáveis.`,
      reason: `Existe ${formatCurrency(indicators.receitaRecuperavel)} recuperável em ${frentes} frente${frentes > 1 ? "s" : ""} de recuperação, que pode migrar para perda definitiva sem atuação nas próximas semanas.`,
    },
    { id: "canal-recomendado", title: "Canal Recomendado", ...canal },
    { id: "segmento-prioritario", title: "Segmento Prioritário", ...segmento },
    {
      id: "janela-ideal",
      title: "Janela Ideal de Atuação",
      body: `Executar as ações nos próximos ${indicators.prazoIdealDias} dias.`,
      reason:
        "É a menor janela média de recuperação entre as oportunidades; depois disso, a probabilidade de retorno cai progressivamente.",
    },
  ];

  return {
    hasOpportunity: true,
    indicators,
    interpretation:
      `A análise identificou oportunidades de recuperação na carteira: ` +
      `${indicators.pacientesEmRisco} paciente(s) em risco e ` +
      `${formatCurrency(indicators.receitaRecuperavel)} recuperáveis, com ` +
      `probabilidade média de retorno de ${mpr}%. Ainda há janela para atuação imediata.`,
    recommendations,
    conclusion:
      `A recomendação é iniciar a reativação nos próximos ` +
      `${indicators.prazoIdealDias} dias para recuperar o máximo de ` +
      `${formatCurrency(indicators.receitaRecuperavel)} ainda acionáveis. ` +
      `Quanto maior o atraso, menor a probabilidade de retorno e o potencial recuperável.`,
  };
}
