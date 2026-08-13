import { describe, it, expect } from "vitest";
import {
  buildRelationshipEconomics,
  buildCarteiraEconomics,
  procedureLeaks,
  daysBetween,
} from "@/lib/revenue-intelligence/pipeline";
import type {
  Procedure,
  ReactivationPatient,
} from "@/types/reactivation-intelligence";

const NOW = new Date("2024-06-01T12:00:00.000Z");
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const botox: Procedure = {
  id: "botox",
  nome: "Botox",
  categoria: "Injetável",
  ticketMedio: 900,
  cicloEsperadoDias: 120, // limite = ciclo 120 + tolerância GLOBAL 40 = 160
  toleranciaDias: 30, // ignorado pelo motor (limite usa a tolerância global)
  ativo: true,
};

/** Paciente cujo Tempo Decorrido (em dias) até NOW é exatamente `td`. */
function patient(
  td: number,
  overrides: Partial<ReactivationPatient> = {}
): ReactivationPatient {
  return {
    id: "p",
    nome: "Paciente",
    telefone: "11999999999",
    procedureId: "botox",
    dataUltimoProcedimento: new Date(NOW.getTime() - td * MS_PER_DAY).toISOString(),
    totalVisitas: 5,
    engajamento: 0.6,
    ...overrides,
  };
}

describe("daysBetween", () => {
  it("conta dias inteiros entre duas datas", () => {
    expect(daysBetween(new Date(NOW.getTime() - 10 * MS_PER_DAY), NOW)).toBe(10);
  });
});

describe("buildRelationshipEconomics", () => {
  it("identifica a versão e o instante de referência do cálculo", () => {
    const [result] = buildRelationshipEconomics([patient(150)], [botox], {
      now: NOW,
    });
    expect(result.formulaVersion).toBe("reativa-1.0.0");
    expect(result.calculatedAt).toBe(NOW.toISOString());
  });

  it("Monetary usa o gasto real (totalGasto) quando presente — mesma fonte dos Inativos", () => {
    // Mesmo TD/visitas: sem totalGasto, ambos teriam o MESMO monetary (proxy
    // visitas × ticket) e o mesmo VER. Com gasto real diferente, o VER separa.
    const patients = [
      patient(140, { id: "rico", totalGasto: 10000 }),
      patient(140, { id: "pobre", totalGasto: 1000 }),
    ];
    const result = buildRelationshipEconomics(patients, [botox], { now: NOW });
    const rico = result.find((r) => r.patientId === "rico")!;
    const pobre = result.find((r) => r.patientId === "pobre")!;
    expect(rico.ver).toBeGreaterThan(pobre.ver);

    // Sem totalGasto (ou zero), cai no proxy — comportamento anterior intacto.
    const proxied = buildRelationshipEconomics(
      [patient(140, { id: "a" }), patient(140, { id: "b", totalGasto: 0 })],
      [botox],
      { now: NOW }
    );
    expect(proxied[0].ver).toBe(proxied[1].ver);
  });

  it("ignora procedimentos inativos e ids desconhecidos", () => {
    const inativo: Procedure = { ...botox, id: "off", ativo: false };
    const patients = [
      patient(100, { id: "a", procedureId: "botox" }),
      patient(100, { id: "b", procedureId: "off" }),
      patient(100, { id: "c", procedureId: "fantasma" }),
    ];
    const result = buildRelationshipEconomics(patients, [botox, inativo], {
      now: NOW,
    });
    expect(result.map((r) => r.patientId)).toEqual(["a"]);
  });

  it("classifica estados por Tempo Decorrido", () => {
    const patients = [
      patient(100, { id: "ativo" }),
      patient(150, { id: "risco" }),
      patient(200, { id: "perdido" }),
    ];
    const byId = Object.fromEntries(
      buildRelationshipEconomics(patients, [botox], { now: NOW }).map((r) => [
        r.patientId,
        r,
      ])
    );
    expect(byId.ativo.state).toBe("ativo");
    expect(byId.risco.state).toBe("em_risco");
    expect(byId.perdido.state).toBe("perdido");
    expect(byId.ativo.revenueState).toBe("protegida");
    expect(byId.perdido.revenueState).toBe("perdida");
  });

  it("calcula o pipeline econômico de um relacionamento Em Risco", () => {
    // TD=150 sozinho na carteira → Monetary normalizado = 100.
    const [r] = buildRelationshipEconomics([patient(150)], [botox], {
      now: NOW,
    });
    // Limite = ciclo 120 + tolerância global 40 = 160 → DT = (150−120)/40 = 75%.
    expect(r.dt).toBeCloseTo(75, 5);
    expect(r.ver).toBeCloseTo(62.5, 3);
    expect(r.hr).toBeCloseTo(48, 5);
    expect(r.mpr).toBeCloseTo(42.425, 3);
    expect(r.vep).toBe(900);
    expect(r.receitaEsperada).toBeCloseTo(381.825, 1);
    expect(r.receitaRecuperavel).toBeCloseTo(381.825, 1);
    expect(r.prioridadeEconomica).toBeCloseTo(286.369, 2);
    expect(r.nivelIntervencao).toBe(2);
  });

  it("não atribui Receita Recuperável a Ativos nem a Perdidos", () => {
    const result = buildRelationshipEconomics(
      [patient(100, { id: "ativo" }), patient(200, { id: "perdido" })],
      [botox],
      { now: NOW }
    );
    for (const r of result) expect(r.receitaRecuperavel).toBe(0);
  });

  describe("VEP — tickets reais do paciente vs proxy", () => {
    it("usa o ticket histórico e o último ticket do paciente quando presentes", () => {
      // VEP = 0,70×1200 + 0,30×600 = 840 + 180 = 1020 (≠ ticket do procedimento).
      const [r] = buildRelationshipEconomics(
        [patient(150, { ticketMedioHistorico: 1200, ultimoTicket: 600 })],
        [botox],
        { now: NOW }
      );
      expect(r.vep).toBe(1020);
    });

    it("sem último ticket, usa o histórico do paciente para os dois termos", () => {
      // VEP = 0,70×500 + 0,30×500 = 500.
      const [r] = buildRelationshipEconomics(
        [patient(150, { ticketMedioHistorico: 500 })],
        [botox],
        { now: NOW }
      );
      expect(r.vep).toBe(500);
    });

    it("sem dados do paciente, cai no proxy do ticket médio do procedimento", () => {
      const [r] = buildRelationshipEconomics([patient(150)], [botox], {
        now: NOW,
      });
      expect(r.vep).toBe(900);
    });
  });

  describe("HR — Regularity/Cycle Adherence reais vs proxy", () => {
    it("intervalos reais alteram o HR (não usa mais o proxy de engajamento)", () => {
      // Mesmo TD/engajamento: com histórico de intervalos uniformes e aderentes
      // ao ciclo (120), o HR sobe vs. o caso sem histórico (proxy).
      const [comHistorico] = buildRelationshipEconomics(
        [patient(150, { intervalosDias: [120, 120, 120] })],
        [botox],
        { now: NOW }
      );
      const [semHistorico] = buildRelationshipEconomics(
        [patient(150)],
        [botox],
        { now: NOW }
      );
      expect(comHistorico.hr).not.toBeCloseTo(semHistorico.hr, 5);
      // Regularity=100 e CycleAdherence=100 → HR só limitado pelo ReturnCount.
      expect(comHistorico.hr).toBeGreaterThan(semHistorico.hr);
    });

    it("histórico insuficiente (<2 intervalos) mantém o comportamento de proxy", () => {
      const [umIntervalo] = buildRelationshipEconomics(
        [patient(150, { intervalosDias: [120] })],
        [botox],
        { now: NOW }
      );
      const [semHistorico] = buildRelationshipEconomics(
        [patient(150)],
        [botox],
        { now: NOW }
      );
      // 1 intervalo: Regularity cai no proxy (engajamento), mas Cycle Adherence
      // já usa o real — então o HR pode diferir só pela aderência.
      expect(umIntervalo.hr).toBeGreaterThanOrEqual(semHistorico.hr);
    });
  });
});

describe("ultimoTicket — o fato auditável ao lado da estimativa", () => {
  it("expõe o valor real da última visita, não a média", () => {
    // Gasta R$ 3.000 em média, mas a última visita foi um retoque de R$ 150:
    // é justamente onde a média sozinha engana quem lê.
    const [e] = buildRelationshipEconomics(
      [patient(140, { ticketMedioHistorico: 3000, ultimoTicket: 150 })],
      [botox],
      { now: NOW }
    );

    expect(e.ultimoTicket).toBe(150);
    expect(e.ticketMedio).toBe(3000);
    // Expor o dado NÃO muda a fórmula: VEP segue 0,70 média + 0,30 último.
    expect(e.vep).toBeCloseTo(0.7 * 3000 + 0.3 * 150);
  });

  it("sem último ticket, cai no ticket histórico (nunca exibe R$ 0 falso)", () => {
    const [e] = buildRelationshipEconomics(
      [patient(140, { ticketMedioHistorico: 800 })],
      [botox],
      { now: NOW }
    );
    expect(e.ultimoTicket).toBe(800);
  });

  it("sem nenhum ticket do paciente, cai no ticket do procedimento", () => {
    const [e] = buildRelationshipEconomics([patient(140)], [botox], {
      now: NOW,
    });
    expect(e.ultimoTicket).toBe(900);
    expect(e.ticketMedio).toBe(900);
  });
});

describe("buildCarteiraEconomics", () => {
  it("agrega receitas por estado e monta a fila por prioridade", () => {
    const economics = buildRelationshipEconomics(
      [
        patient(100, { id: "ativo" }),
        patient(150, { id: "risco-medio" }),
        patient(155, { id: "risco-alto" }),
        patient(200, { id: "perdido" }),
      ],
      [botox],
      { now: NOW }
    );
    const carteira = buildCarteiraEconomics(economics);

    expect(carteira.ativos).toBe(1);
    expect(carteira.emRisco).toBe(2);
    expect(carteira.perdidos).toBe(1);

    // Receita {protegida,em risco,perdida} = Σ VEP por estado (VEP=900 cada).
    expect(carteira.receitaProtegida).toBe(900);
    expect(carteira.receitaEmRisco).toBe(1800);
    expect(carteira.receitaPerdida).toBe(900);

    // Só os Em Risco entram na fila, ordenados por Prioridade Econômica desc.
    // Prioridade = Recuperável × DT/100; DT muito alto (TD=155) derruba o MPR e
    // a Recuperável, então o TD=150 acaba à frente.
    expect(carteira.fila.map((r) => r.patientId)).toEqual([
      "risco-medio",
      "risco-alto",
    ]);
    expect(carteira.receitaRecuperavelTotal).toBeCloseTo(
      carteira.fila[0].receitaRecuperavel + carteira.fila[1].receitaRecuperavel,
      5
    );
  });

  it("calcula o resumo executivo (ISC, MPR, potencial)", () => {
    const economics = buildRelationshipEconomics(
      [
        patient(100, { id: "ativo" }),
        patient(150, { id: "risco-1" }),
        patient(155, { id: "risco-2" }),
        patient(200, { id: "perdido" }),
      ],
      [botox],
      { now: NOW }
    );
    const carteira = buildCarteiraEconomics(economics);

    // ISC = (1·1 + 0,4 + 0,4 + 0) / 4 × 100 = 45 → tom "warning".
    expect(carteira.isc).toBe(45);
    expect(carteira.iscTone).toBe("warning");
    expect(carteira.iscLabel).toBe("Atenção");
    expect(carteira.iscTrend30d).toBeNull();

    // VEP = 900 cada → potencial bruto = 4 × 900.
    expect(carteira.potencialEconomicoTotal).toBe(3600);
    expect(carteira.mprMedio).toBeGreaterThan(0);
    expect(carteira.mprMedio).toBeLessThanOrEqual(100);

    const dist = carteira.mprDistribution;
    expect(dist.alta + dist.media + dist.baixa).toBe(4);
  });
});

describe("procedureLeaks", () => {
  it("soma receita recuperável por procedimento (só Em Risco), desc", () => {
    const economics = buildRelationshipEconomics(
      [
        patient(150, { id: "r1" }), // em risco
        patient(155, { id: "r2" }), // em risco
        patient(100, { id: "ativo" }), // ativo → não conta
        patient(200, { id: "perdido" }), // perdido → não conta
      ],
      [botox],
      { now: NOW }
    );
    const leaks = procedureLeaks(economics);
    expect(leaks).toHaveLength(1);
    expect(leaks[0].procedureName).toBe("Botox");
    expect(leaks[0].patientsAtRisk).toBe(2);
    expect(leaks[0].revenueAtRisk).toBeGreaterThan(0);
  });

  it("lista vazia quando ninguém está Em Risco", () => {
    const economics = buildRelationshipEconomics(
      [patient(100, { id: "ativo" })],
      [botox],
      { now: NOW }
    );
    expect(procedureLeaks(economics)).toEqual([]);
  });
});
