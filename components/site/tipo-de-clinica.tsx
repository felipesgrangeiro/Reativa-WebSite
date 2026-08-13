import { Activity, Grip, ScanFace, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Dobra "Para que tipo de clínica": qualificação por ESPECIALIDADE.
 *
 * Não confundir com "Para quem é" (`personas.tsx`), que recorta por função
 * dentro da clínica. Dois títulos parecidos na mesma página confundiriam os dois
 * recortes — aqui é segmento, lá é gente.
 *
 * A dobra também DESQUALIFICA, e é isso que a torna crível: o parágrafo final
 * diz em voz alta para quem o produto não serve. Atendimento pontual, sem ciclo
 * de repetição, não tem retorno esperado para calcular. Tirar essa frase
 * transformaria a dobra num "serve para todo mundo", que não convence ninguém.
 */

/**
 * Dente desenhado à mão: o lucide não tem ícone de odontologia, e trocar por
 * estetoscópio ou maleta diria "saúde genérica" — justamente a generalidade que
 * esta dobra existe para negar.
 */
function Dente({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 5.2c-1.6-1.4-3.2-2-4.6-1.7C5.4 3.9 4.3 5.6 4.3 8c0 1.6.3 3 .8 4.6.4 1.3.6 2.5.7 3.9.1 1.4.3 2.6.7 3.2.5.7 1.4.6 1.8-.2.4-.8.7-2 1-3.6.3-1.5.6-2.4 1.1-2.9.4-.4 1.4-.4 1.9 0 .5.5.8 1.4 1.1 2.9.3 1.6.6 2.8 1 3.6.4.8 1.3.9 1.8.2.4-.6.6-1.8.7-3.2.1-1.4.3-2.6.7-3.9.5-1.6.8-3 .8-4.6 0-2.4-1.1-4.1-3.1-4.5-1.4-.3-3 .3-4.6 1.7Z" />
    </svg>
  );
}

type Segmento = {
  rotulo: string;
  icone: LucideIcon | ((p: { className?: string }) => React.ReactElement);
  /** O primeiro fica aceso: é o público principal, e ancora a leitura da fila. */
  destaque?: boolean;
};

const SEGMENTOS: Segmento[] = [
  { rotulo: "Clínicas de estética", icone: ScanFace, destaque: true },
  { rotulo: "Dermatologia", icone: Grip },
  { rotulo: "Odontologia", icone: Dente },
  { rotulo: "Qualquer clínica onde o paciente deveria voltar", icone: Users },
];

/**
 * Órbitas decorativas do mockup: anéis concêntricos com pontos e um "+" no
 * centro. É ornamento, não dado — `aria-hidden`, e some abaixo de `lg`, onde
 * disputaria a largura com os chips.
 *
 * Os anéis alternam traço contínuo e pontilhado para o conjunto ter profundidade
 * sem precisar de opacidades diferentes em cada um.
 */
function Orbitas() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 460 460"
      fill="none"
      className="pointer-events-none absolute right-0 top-1/2 hidden h-[460px] w-[460px] -translate-y-1/2 lg:block"
    >
      <g stroke="#20E0BD" strokeOpacity="0.22">
        <circle cx="300" cy="250" r="60" />
        <circle cx="300" cy="250" r="120" strokeDasharray="2 6" />
        <circle cx="300" cy="250" r="185" />
        <circle cx="300" cy="250" r="250" strokeDasharray="2 7" />
      </g>

      {/* Pontos nas órbitas, em raios e ângulos diferentes para o conjunto não
          parecer um alvo. */}
      <g fill="#5EEAD4">
        <circle cx="300" cy="130" r="5.5" />
        <circle cx="121" cy="128" r="4" />
        <circle cx="404" cy="98" r="3.5" />
        <circle cx="60" cy="330" r="4" />
        <circle cx="186" cy="424" r="3" />
      </g>
      <circle cx="300" cy="130" r="12" fill="#20E0BD" fillOpacity="0.16" />

      <circle
        cx="300"
        cy="250"
        r="34"
        fill="#02080D"
        stroke="#20E0BD"
        strokeOpacity="0.45"
      />
      <path
        d="M300 238v24M288 250h24"
        stroke="#20E0BD"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TipoDeClinica() {
  return (
    <section
      id="tipo-de-clinica"
      className="relative isolate scroll-mt-28 overflow-hidden border-y border-[rgba(120,180,200,0.12)] bg-[rgba(4,19,26,0.5)]"
    >
      <Orbitas />

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        {/* `max-w-3xl` para o conteúdo não passar por baixo das órbitas. */}
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20E0BD]">
            Para sua realidade
          </p>
          <span
            aria-hidden
            className="mt-3 block h-px w-10 bg-[linear-gradient(90deg,#20E0BD,rgba(32,224,189,0.1))]"
          />

          <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-[#F8FAFC] sm:text-4xl">
            Para que tipo de{" "}
            <span className="text-[#20E0BD]">clínica</span>
          </h2>

          <ul className="mt-8 flex flex-wrap gap-3">
            {SEGMENTOS.map(({ icone: Icone, rotulo, destaque }) => (
              <li
                key={rotulo}
                className={
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 text-[15px] " +
                  (destaque
                    ? "border-[rgba(32,224,189,0.5)] bg-[rgba(32,224,189,0.07)] text-[#F8FAFC] shadow-[0_0_28px_-10px_rgba(32,224,189,0.5)]"
                    : "border-[rgba(120,180,200,0.2)] bg-[rgba(8,22,30,0.6)] text-[#AAB7C4]")
                }
              >
                <Icone
                  className={
                    "h-[22px] w-[22px] shrink-0 " +
                    (destaque ? "text-[#20E0BD]" : "text-[#8B9AA6]")
                  }
                  strokeWidth={1.5}
                  aria-hidden
                />
                <span className="max-w-[22ch] leading-snug">{rotulo}</span>
              </li>
            ))}
          </ul>

          {/* Filete separando a lista da ressalva: são dois movimentos opostos —
              em cima quem serve, embaixo quem não serve. */}
          <div
            aria-hidden
            className="mt-10 h-px w-full bg-[rgba(120,180,200,0.14)]"
          />

          <div className="mt-8 flex gap-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[rgba(32,224,189,0.28)] bg-[rgba(32,224,189,0.07)]">
              <Activity
                className="h-5 w-5 text-[#20E0BD]"
                strokeWidth={1.7}
                aria-hidden
              />
            </span>
            {/* Este bloco DEFINE o conceito central do produto, e a
                qualificação vem embutida nele. Não é uma ressalva com ícone.
              *
              * Duas versões anteriores erraram o registro. A primeira dizia "não
              * vamos conseguir calcular" — agência fraca, o produto soando
              * incapaz. A segunda tentou consertar com "a gente diz isso antes
              * de você pagar": "a gente" é coloquial demais para uma página que
              * cobra R$ 197, e falar de pagamento aqui plantava dúvida numa
              * dobra que não é sobre preço.
              *
              * O problema de fundo era de peso: ícone em círculo, filete e três
              * linhas dão tratamento de funcionalidade ao que era um aviso. A
              * correção não foi encolher o visual — foi pôr ali o que merece
              * esse peso. Definir "retorno esperado" é autoridade: quem define o
              * termo do próprio mercado não está se defendendo.
              *
              * O limite continua dito, na última oração, como REQUISITO e não
              * como incapacidade. "Exige" é uma palavra de quem tem critério. */}
            <p className="max-w-[54ch] text-[17px] leading-relaxed text-[#AAB7C4]">
              <strong className="font-semibold text-[#F8FAFC]">
                Retorno esperado
              </strong>{" "}
              é o dia em que o procedimento pede a próxima visita. O Reativa+
              calcula esse dia paciente por paciente — o que exige atendimento
              com ciclo, não pontual.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
