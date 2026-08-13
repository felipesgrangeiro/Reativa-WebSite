import type { ReactivationPatient } from "@/types/reactivation-intelligence";

/**
 * Mock de pacientes — Fases 1 e 2.
 * As datas são relativas a "hoje" para que a classificação por ciclo seja
 * sempre relevante, independentemente da data atual. No futuro virá da tabela
 * `patients` + último `appointment` por procedimento.
 *
 * Ciclos (ciclo / tolerância):
 *  Botox 120/30 · Preenchimento 240/60 · Laser 45/15 · Limpeza 30/10
 *  Bioestimulador 180/45 · Skinbooster 180/45
 *
 * totalVisitas → frequência/fidelidade · engajamento (0-1) → responsividade.
 */
function daysAgo(days: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const reactivationPatients: ReactivationPatient[] = [
  // Botox (120/30): within ≤120 · near 121-150 · overdue 151-180 · loss >180
  { id: "p01", nome: "Ana Paula Ribeiro", telefone: "11988880001", procedureId: "botox", dataUltimoProcedimento: daysAgo(100), totalVisitas: 8, engajamento: 0.85 },
  { id: "p02", nome: "Mariana Costa", telefone: "11988880002", procedureId: "botox", dataUltimoProcedimento: daysAgo(140), totalVisitas: 6, engajamento: 0.7 },
  { id: "p03", nome: "Patrícia Souza", telefone: "11988880003", procedureId: "botox", dataUltimoProcedimento: daysAgo(165), totalVisitas: 11, engajamento: 0.92 },
  { id: "p04", nome: "Renata Lima", telefone: "11988880004", procedureId: "botox", dataUltimoProcedimento: daysAgo(220), totalVisitas: 4, engajamento: 0.55 },

  // Preenchimento (240/60): within ≤240 · near 241-300 · overdue 301-360 · loss >360
  { id: "p05", nome: "Carla Mendes", telefone: "11988880005", procedureId: "preenchimento", dataUltimoProcedimento: daysAgo(200), totalVisitas: 5, engajamento: 0.6 },
  { id: "p06", nome: "Juliana Alves", telefone: "11988880006", procedureId: "preenchimento", dataUltimoProcedimento: daysAgo(280), totalVisitas: 9, engajamento: 0.88 },
  { id: "p07", nome: "Fernanda Dias", telefone: "11988880007", procedureId: "preenchimento", dataUltimoProcedimento: daysAgo(340), totalVisitas: 12, engajamento: 0.9 },
  { id: "p08", nome: "Beatriz Rocha", telefone: "11988880008", procedureId: "preenchimento", dataUltimoProcedimento: daysAgo(400), totalVisitas: 7, engajamento: 0.65 },

  // Laser (45/15): within ≤45 · near 46-60 · overdue 61-75 · loss >75
  { id: "p09", nome: "Camila Nunes", telefone: "11988880009", procedureId: "laser", dataUltimoProcedimento: daysAgo(30), totalVisitas: 6, engajamento: 0.75 },
  { id: "p10", nome: "Larissa Pinto", telefone: "11988880010", procedureId: "laser", dataUltimoProcedimento: daysAgo(55), totalVisitas: 4, engajamento: 0.5 },
  { id: "p11", nome: "Tatiane Gomes", telefone: "11988880011", procedureId: "laser", dataUltimoProcedimento: daysAgo(70), totalVisitas: 8, engajamento: 0.82 },
  { id: "p12", nome: "Vanessa Cardoso", telefone: "11988880012", procedureId: "laser", dataUltimoProcedimento: daysAgo(100), totalVisitas: 3, engajamento: 0.4 },

  // Limpeza de Pele (30/10): within ≤30 · near 31-40 · overdue 41-50 · loss >50
  { id: "p13", nome: "Aline Barbosa", telefone: "11988880013", procedureId: "limpeza-de-pele", dataUltimoProcedimento: daysAgo(20), totalVisitas: 5, engajamento: 0.6 },
  { id: "p14", nome: "Débora Castro", telefone: "11988880014", procedureId: "limpeza-de-pele", dataUltimoProcedimento: daysAgo(35), totalVisitas: 7, engajamento: 0.7 },
  { id: "p15", nome: "Sabrina Moraes", telefone: "11988880015", procedureId: "limpeza-de-pele", dataUltimoProcedimento: daysAgo(48), totalVisitas: 10, engajamento: 0.86 },
  { id: "p16", nome: "Priscila Teixeira", telefone: "11988880016", procedureId: "limpeza-de-pele", dataUltimoProcedimento: daysAgo(70), totalVisitas: 2, engajamento: 0.35 },

  // Bioestimulador (180/45): within ≤180 · near 181-225 · overdue 226-270 · loss >270
  { id: "p17", nome: "Gabriela Freitas", telefone: "11988880017", procedureId: "bioestimulador", dataUltimoProcedimento: daysAgo(150), totalVisitas: 6, engajamento: 0.72 },
  { id: "p18", nome: "Letícia Ramos", telefone: "11988880018", procedureId: "bioestimulador", dataUltimoProcedimento: daysAgo(210), totalVisitas: 9, engajamento: 0.84 },
  { id: "p19", nome: "Bruna Carvalho", telefone: "11988880019", procedureId: "bioestimulador", dataUltimoProcedimento: daysAgo(255), totalVisitas: 11, engajamento: 0.93 },
  { id: "p20", nome: "Natália Figueiredo", telefone: "11988880020", procedureId: "bioestimulador", dataUltimoProcedimento: daysAgo(320), totalVisitas: 5, engajamento: 0.58 },

  // Skinbooster (180/45): within ≤180 · near 181-225 · overdue 226-270 · loss >270
  { id: "p21", nome: "Amanda Vieira", telefone: "11988880021", procedureId: "skinbooster", dataUltimoProcedimento: daysAgo(150), totalVisitas: 7, engajamento: 0.78 },
  { id: "p22", nome: "Carolina Pires", telefone: "11988880022", procedureId: "skinbooster", dataUltimoProcedimento: daysAgo(210), totalVisitas: 10, engajamento: 0.9 },
  { id: "p23", nome: "Isabela Martins", telefone: "11988880023", procedureId: "skinbooster", dataUltimoProcedimento: daysAgo(255), totalVisitas: 12, engajamento: 0.95 },
  { id: "p24", nome: "Helena Azevedo", telefone: "11988880024", procedureId: "skinbooster", dataUltimoProcedimento: daysAgo(320), totalVisitas: 4, engajamento: 0.52 },
];
