import {
  Clock,
  Droplet,
  Scale,
  Syringe,
  Target,
  UserSearch,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { proceduresLibrary } from "@/data/procedures-library";

/**
 * Dobra "Por que Reativa+": o mecanismo do produto, sem uma sigla.
 *
 * Fonte do argumento: ECONOMIC-ENGINE.md (ciclo por procedimento) e
 * PRODUCT-VISION § 9. O exemplo das duas leituras é a peça central da página —
 * é ele que mostra, em dois números, por que uma régua única erra.
 *
 * OS CICLOS SAEM DE `procedures-library.ts`, não do teclado. Se a clínica mudar
 * o ciclo do Botox de 120 para 150, o texto desta dobra acompanha. Era o tipo de
 * número que envelhece calado quando fica escrito à mão na vitrine.
 *
 * Os 100 dias são o exemplo escolhido, e são exatamente o que torna o argumento
 * visível: com o MESMO tempo decorrido, um procedimento está no prazo e o outro
 * está setenta dias atrasado.
 */

/** Ciclo de um procedimento da biblioteca, pelo id. */
function ciclo(
  id: string,
  /* Rótulo curto para a linha da leitura. "Limpeza de Pele" é o nome canônico
     da biblioteca e quebrava a linha em duas, empurrando o badge para baixo. O
     ciclo continua vindo da biblioteca — só o rótulo é da vitrine. */
  rotulo?: string
): { nome: string; ciclo: number; tolerancia: number } {
  const p = proceduresLibrary.find((x) => x.id === id);
  if (!p) throw new Error(`Procedimento "${id}" não existe na biblioteca.`);
  return {
    nome: rotulo ?? p.nome,
    ciclo: p.cicloEsperadoDias,
    tolerancia: p.toleranciaDias,
  };
}

const BOTOX = ciclo("botox");
/* O id é "limpeza-de-pele", e não "limpeza" — o `throw` em `ciclo()` pegou isso
   na primeira renderização, que é a razão de ele existir em vez de um valor
   padrão silencioso. */
const LIMPEZA = ciclo("limpeza-de-pele", "Limpeza");

/** Dias decorridos no exemplo. Um só valor, para os dois procedimentos. */
const DIAS = 100;

/** A régua genérica que o mercado usa, e que a dobra existe para contestar. */
const REGUA_GENERICA = 90;

type Pilar = { titulo: string; texto: string; icone: LucideIcon };

const PILARES: Pilar[] = [
  {
    titulo: "Ciclo por procedimento",
    texto: "Cada tratamento com seu tempo certo.",
    icone: Clock,
  },
  {
    titulo: "Prioridade por valor",
    texto: "Foco em quem vale mais para sua clínica.",
    icone: UserSearch,
  },
  {
    titulo: "Chance de retorno",
    /* "Score inteligente" era jargão + adjetivo vazio. A tabela de
       vocabulário da skill manda escrever "chance de retorno". */
    texto: "A chance real de cada paciente voltar.",
    icone: Target,
  },
];

type Leitura = {
  nome: string;
  ciclo: number;
  tolerancia: number;
  icone: LucideIcon;
};

/**
 * Barra de uma leitura.
 *
 * A trilha é a JANELA DE RECUPERAÇÃO do procedimento (ciclo + tolerância) e o
 * ponto marca onde os 100 dias caem dentro dela. Não é enfeite: é a mesma
 * geometria que o motor usa para classificar ativo, em risco e perdido.
 *
 * No mockup as duas barras têm preenchimentos parecidos. Aqui não podem ter: com
 * 100 dias, o Botox está a 67% da janela e a Limpeza estourou a dela — e é
 * justamente esse descompasso que a dobra está argumentando. Barra bonita que
 * contradiz o texto ao lado seria o erro que a régua de 90 dias comete.
 */
function Barra({ leitura }: { leitura: Leitura }) {
  const janela = leitura.ciclo + leitura.tolerancia;
  const atrasado = DIAS > leitura.ciclo;
  const pct = Math.min(100, Math.round((DIAS / janela) * 100));
  const cor = atrasado ? "#FF7A00" : "#20E0BD";

  return (
    <div className="relative mt-3 h-px w-full bg-[rgba(120,180,200,0.16)]">
      <span
        aria-hidden
        className="absolute left-0 top-0 h-px"
        style={{ width: `${pct}%`, background: cor }}
      />
      <span
        aria-hidden
        className="brilho-ponto absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ left: `${pct}%`, background: cor, ["--brilho" as string]: cor }}
      />
    </div>
  );
}

function LinhaLeitura({ leitura }: { leitura: Leitura }) {
  const { icone: Icone } = leitura;
  const atrasado = DIAS > leitura.ciclo;
  const cor = atrasado ? "#FF7A00" : "#20E0BD";

  return (
    <li>
      <div className="flex items-center gap-4">
        <span
          className="brilho-acento grid h-10 w-10 shrink-0 place-items-center rounded-full border"
          style={{
            borderColor: `${cor}44`,
            background: `${cor}14`,
            ["--brilho" as string]: cor,
          }}
        >
          <Icone
            className="h-[18px] w-[18px]"
            style={{ color: cor }}
            strokeWidth={1.7}
            aria-hidden
          />
        </span>

        <p className="min-w-0 flex-1 text-[15px] text-[#C3D0D9]">
          <span className="font-medium text-[#F8FAFC]">{leitura.nome}</span>
          <span className="text-[#7C8F9A]"> · última visita há {DIAS} dias</span>
        </p>

        <span
          className="brilho-acento shrink-0 rounded-full border px-3 py-1 text-[13px] font-medium"
          style={{
            color: cor,
            borderColor: `${cor}55`,
            background: `${cor}12`,
            ["--brilho" as string]: cor,
          }}
        >
          {atrasado ? `atrasado há ${DIAS - leitura.ciclo}` : "ainda no ciclo"}
        </span>
      </div>
      <Barra leitura={leitura} />
    </li>
  );
}

export function PorQue() {
  const leituras: Leitura[] = [
    { ...BOTOX, icone: Syringe },
    { ...LIMPEZA, icone: Droplet },
  ];

  /* Sem luz ambiente no canto: havia uma radial teal no canto inferior direito,
     tirada por decisão de projeto. O brilho dos ícones e do painel já dá o
     volume, e a radial só sujava o fundo da dobra seguinte. Isso dispensa o
     `relative isolate overflow-hidden` que existia só para conter ela. */
  return (
    <section id="por-que" className="scroll-mt-28">
      {/* `max-w-7xl`, e não 6xl: no mockup cada coluna tem ~740px. Em
          1152px os três pilares ficavam com 120px de texto cada e quebravam em
          quatro linhas. É a mesma largura de `personas.tsx` e `diferenca.tsx`. */}
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Sem `items-start`: com ele o painel tinha a altura do próprio
            conteúdo e a base ficava 89px acima da base da coluna esquerda
            (medido em 1440). Esticado, as duas colunas fecham na mesma linha —
            e a esquerda termina num card, a direita também, o que dá o paralelo
            que faltava. */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20E0BD]">
              Por que Reativa+
            </p>
            <span
              aria-hidden
              className="mt-3 block h-px w-12 bg-[linear-gradient(90deg,#20E0BD,rgba(32,224,189,0.1))]"
            />

            {/* "erra o tempo." em teal: é o veredito da frase, e a cor faz o
                olho pousar nele antes de ler o resto. */}
            <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-[#F8FAFC] sm:text-4xl">
              Lista de inativo genérica{" "}
              <span className="text-[#20E0BD]">erra o tempo.</span>
            </h2>

            <div className="mt-7 space-y-5 text-[17px] leading-relaxed text-[#AAB7C4]">
              <p>
                Ela avisa aos {REGUA_GENERICA} dias, para todo mundo. Só que{" "}
                {BOTOX.nome} dura {BOTOX.ciclo} e limpeza de pele pede retorno
                aos {LIMPEZA.ciclo}. Cobrar cedo irrita; cobrar tarde perde o
                paciente.
              </p>
              <p>
                O Reativa+ conhece o ciclo de cada procedimento. Chama quem
                realmente está atrasado, na ordem de{" "}
                <strong className="font-semibold text-[#F8FAFC]">
                  quanto cada um vale
                </strong>{" "}
                — e diz qual a chance de cada um voltar.
              </p>
            </div>

            {/* Os três pilares em uma faixa só, divididos por filete vertical,
                como no mockup. Empilhados eles competiriam com o painel da
                direita, que é a prova da dobra. */}
            <ul className="mt-9 grid gap-6 rounded-2xl border border-[rgba(120,180,200,0.16)] bg-[linear-gradient(150deg,rgba(12,32,42,0.72),rgba(6,18,25,0.44))] p-6 sm:grid-cols-3 sm:gap-0">
              {PILARES.map(({ icone: Icone, ...p }, i) => (
                <li
                  key={p.titulo}
                  className={
                    "flex gap-3 sm:px-3.5 sm:first:pl-0 sm:last:pr-0" +
                    (i > 0
                      ? " sm:border-l sm:border-[rgba(120,180,200,0.14)]"
                      : "")
                  }
                >
                  <span
                    className="brilho-acento grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[rgba(32,224,189,0.24)] bg-[rgba(32,224,189,0.08)]"
                    style={{ ["--brilho" as string]: "#20E0BD" }}
                  >
                    <Icone
                      className="h-4 w-4 text-[#20E0BD]"
                      strokeWidth={1.8}
                      aria-hidden
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold leading-snug text-[#F8FAFC]">
                      {p.titulo}
                    </span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-[#7C8F9A]">
                      {p.texto}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="brilho-painel flex flex-col rounded-3xl border border-[rgba(120,180,200,0.18)] bg-[linear-gradient(150deg,rgba(12,32,42,0.9),rgba(6,18,25,0.62))] p-7"
            style={{ ["--brilho" as string]: "#20E0BD" }}
          >
            <div className="flex items-center gap-3.5">
              <span
                className="brilho-acento grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[rgba(32,224,189,0.24)] bg-[rgba(32,224,189,0.08)]"
                style={{ ["--brilho" as string]: "#20E0BD" }}
              >
                <Users
                  className="h-[18px] w-[18px] text-[#20E0BD]"
                  strokeWidth={1.7}
                  aria-hidden
                />
              </span>
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B9AA6]">
                  O mesmo paciente, duas leituras
                </span>
                <span
                  aria-hidden
                  className="mt-2 block h-px w-10 bg-[linear-gradient(90deg,#20E0BD,rgba(32,224,189,0.1))]"
                />
              </span>
            </div>

            <ul className="mt-8 space-y-7">
              {leituras.map((l) => (
                <LinhaLeitura key={l.nome} leitura={l} />
              ))}
            </ul>

            <div className="mt-auto flex gap-4 rounded-2xl border border-[rgba(120,180,200,0.12)] bg-[rgba(2,10,14,0.55)] p-5">
              <span
                className="brilho-acento grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[rgba(32,224,189,0.2)] bg-[rgba(32,224,189,0.06)]"
                style={{ ["--brilho" as string]: "#20E0BD" }}
              >
                <Scale
                  className="h-[18px] w-[18px] text-[#7FD9C9]"
                  strokeWidth={1.6}
                  aria-hidden
                />
              </span>
              <p className="text-[15px] leading-relaxed text-[#AAB7C4]">
                Uma lista de{" "}
                <strong className="font-semibold text-[#F8FAFC]">
                  {REGUA_GENERICA} dias
                </strong>{" "}
                cobraria os dois igual — e{" "}
                <strong className="font-semibold text-[#F8FAFC]">
                  erraria os dois
                </strong>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Selo e fio ao pé da dobra. Fecha a seção com a marca sem repetir o
            logotipo inteiro, que já está no topo e no rodapé — aqui basta a
            abreviação. Decorativo, então `aria-hidden`. */}
        <div aria-hidden className="mt-16 flex items-center gap-5">
          {/* `place-items-center` num grid trata "R" e "+" como DOIS itens e os
              empilha em duas linhas. O texto vai num único filho, com `leading-none`
              para o par ficar centrado de verdade na circunferência. */}
          <span
            className="brilho-acento grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[rgba(32,224,189,0.3)] bg-[rgba(4,19,26,0.9)]"
            style={{ ["--brilho" as string]: "#20E0BD" }}
          >
            <span className="text-[17px] font-semibold leading-none tracking-tight text-[#F8FAFC]">
              R<span className="text-[#20E0BD]">+</span>
            </span>
          </span>
          <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(32,224,189,0.32),rgba(120,180,200,0.06))]" />
        </div>
      </div>
    </section>
  );
}
