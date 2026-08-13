import { Eye, Megaphone, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Dobra do problema, em três tempos: dor, sintomas, mecanismo.
 *
 * Saiu de dentro de `page.tsx` quando ganhou a arte do mockup — curva, ícones e
 * filetes de acento. Inline, a seção passava de 90 linhas de JSX no meio da
 * página e escondia as outras dobras.
 *
 * A dor do título vem de PRODUCT-VISION § 3.1 ("faturamento oscila sem
 * explicação clara"): é literalmente o que o dono pensa quando fecha o mês.
 *
 * O fecho é a JANELA — existe um dia depois do qual `receitaRecuperavel` é zero.
 * É o melhor ativo publicitário do produto, e é o que separa o Reativa+ de um
 * disparador de mensagem.
 */

type Sintoma = { texto: string; icone: LucideIcon };

/**
 * Texto do mockup aprovado, palavra por palavra.
 *
 * Registro de uma divergência, para não ser "corrigida" por engano: as três
 * frases usam adjetivo onde a skill de redação pede substantivo concreto ou
 * número — "procedimento recorrente", "grande demais", "genérica". Cheguei a
 * trocar por cenas concretas (o Botox que não marcou a próxima, a planilha sem
 * ordem, a recepção que liga por memória) e a decisão foi manter o mockup.
 *
 * Vale como decisão de dono: estes são SINTOMAS, ditos como o dono os
 * descreveria no telefone, e generalidade aqui é proposital — o visitante tem de
 * se reconhecer em todos os três. O concreto entra nas dobras seguintes, onde o
 * argumento é mecanismo e não identificação.
 */
const SINTOMAS: Sintoma[] = [
  {
    texto: "Pacientes que sumiram depois de um procedimento recorrente.",
    icone: Users,
  },
  { texto: "Uma base grande demais para ler no olho.", icone: Eye },
  {
    texto: "Campanha genérica disparada para todo mundo ao mesmo tempo.",
    icone: Megaphone,
  },
];

/** Filete de acento que abre e fecha cada card, como no mockup. */
function Filete({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`block h-px w-9 bg-[linear-gradient(90deg,#20E0BD,rgba(32,224,189,0.08))] ${className}`}
    />
  );
}

export function Problema() {
  return (
    <section className="relative isolate overflow-hidden border-t border-[rgba(120,180,200,0.12)] bg-[rgba(4,19,26,0.5)]">
      {/* Curva decorativa do mockup: sobe da esquerda para o ponto aceso no
          alto à direita, com a vertical pontilhada caindo dele. É ornamento e
          não gráfico — não representa dado nenhum, então `aria-hidden` e sem
          rótulo. Some abaixo de `lg`, onde disputaria espaço com o título. */}
      <svg
        aria-hidden
        viewBox="0 0 620 300"
        fill="none"
        preserveAspectRatio="xMaxYMin meet"
        className="pointer-events-none absolute right-0 top-0 hidden h-[300px] w-[620px] lg:block"
      >
        <defs>
          <linearGradient id="curva-problema" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#20E0BD" stopOpacity="0" />
            <stop offset="45%" stopColor="#20E0BD" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#5EEAD4" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <path
          d="M0 236 C 120 236, 150 150, 250 150 S 360 196, 430 150 S 520 44, 596 30"
          stroke="url(#curva-problema)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="596"
          y1="42"
          x2="596"
          y2="188"
          stroke="#20E0BD"
          strokeOpacity="0.28"
          strokeWidth="1"
          strokeDasharray="3 5"
        />
        <circle cx="596" cy="30" r="4.5" fill="#5EEAD4" />
        <circle cx="596" cy="30" r="10" fill="#20E0BD" fillOpacity="0.16" />
      </svg>

      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* `max-w-lg` e sem `text-balance`: o mockup quebra o título em quatro
            linhas, duas brancas e duas em teal, e a coluna estreita é o que
            produz essa quebra. Com `text-balance` o navegador reequilibra as
            linhas e desfaz o desenho. Também mantém o texto fora da curva. */}
        <h2 className="max-w-lg text-3xl font-semibold leading-[1.12] tracking-tight text-[#F8FAFC] sm:text-4xl">
          Seu faturamento oscila e ninguém sabe explicar por quê.
          <br />
          {/* Segunda frase em teal, como no mockup: ela é a virada do argumento,
              e a cor faz o olho pular direto para a resposta. */}
          <span className="bg-[linear-gradient(90deg,#20E0BD,#7DD3FC)] bg-clip-text text-transparent">
            A resposta costuma estar em quem parou de voltar.
          </span>
        </h2>

        <Filete className="mt-7 w-16" />

        <ul className="mt-10 grid gap-5 sm:grid-cols-3">
          {SINTOMAS.map(({ icone: Icone, texto }) => (
            <li
              key={texto}
              className="flex gap-4 rounded-2xl border border-[rgba(120,180,200,0.16)] bg-[rgba(8,22,30,0.6)] p-6"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[rgba(120,180,200,0.14)] bg-[rgba(120,180,200,0.06)]">
                <Icone
                  className="h-5 w-5 text-[#8FA7B4]"
                  strokeWidth={1.6}
                  aria-hidden
                />
              </span>
              <span className="flex min-w-0 flex-col">
                <Filete />
                <span className="mt-3.5 text-[15px] leading-relaxed text-[#AAB7C4]">
                  {texto}
                </span>
                <Filete className="mt-4" />
              </span>
            </li>
          ))}
        </ul>

        {/* Barra teal à esquerda do fecho, como no mockup: destaca o parágrafo
            sem precisar de card, e o fecho é a frase mais importante da dobra. */}
        {/* Travessão mantido, como no mockup. A regra 5 da skill pede nenhum
            travessão decorativo, mas aqui ele não é decorativo: separa a
            afirmação da qualificação, e é a pausa que o mockup desenhou. */}
        <div className="mt-12 border-l-2 border-[#20E0BD] pl-5">
          <p className="max-w-2xl text-[17px] leading-relaxed text-[#AAB7C4]">
            Existe um dia em que o paciente deixa de voltar.
            <br />O <span className="text-[#20E0BD]">Reativa+</span> sabe qual é
            — por procedimento, por pessoa.
          </p>
        </div>
      </div>
    </section>
  );
}
