import type { Procedure } from "@/types/reactivation-intelligence";

/**
 * Biblioteca de procedimentos — Fase 1.
 * Base inicial de ciclos esperados de retorno. No futuro virá do Supabase
 * (tabela `procedures` com cycle_expected_days / tolerance_days por clínica).
 */
export const proceduresLibrary: Procedure[] = [
  {
    id: "botox",
    nome: "Botox",
    categoria: "Injetável",
    ticketMedio: 900,
    cicloEsperadoDias: 120,
    toleranciaDias: 30,
    ativo: true,
  },
  {
    id: "preenchimento",
    nome: "Preenchimento",
    categoria: "Injetável",
    ticketMedio: 1500,
    cicloEsperadoDias: 240,
    toleranciaDias: 60,
    ativo: true,
  },
  {
    id: "laser",
    nome: "Laser",
    categoria: "Facial",
    ticketMedio: 450,
    cicloEsperadoDias: 45,
    toleranciaDias: 15,
    ativo: true,
  },
  {
    id: "limpeza-de-pele",
    nome: "Limpeza de Pele",
    categoria: "Facial",
    ticketMedio: 250,
    cicloEsperadoDias: 30,
    toleranciaDias: 10,
    ativo: true,
  },
  {
    id: "bioestimulador",
    nome: "Bioestimulador",
    categoria: "Injetável",
    ticketMedio: 2000,
    cicloEsperadoDias: 180,
    toleranciaDias: 45,
    ativo: true,
  },
  {
    id: "skinbooster",
    nome: "Skinbooster",
    categoria: "Injetável",
    ticketMedio: 1200,
    cicloEsperadoDias: 180,
    toleranciaDias: 45,
    ativo: true,
  },
];

/** Maior ticket médio da biblioteca — base de normalização do RScore. */
export const maxTicketMedio = Math.max(
  ...proceduresLibrary.map((p) => p.ticketMedio),
  1
);

export function getProcedureById(id: string): Procedure | undefined {
  return proceduresLibrary.find((p) => p.id === id);
}
