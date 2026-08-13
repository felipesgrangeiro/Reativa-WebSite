import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, MessageCircle, Target, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Dobra "Para quem é": quem olha o produto e o que cada um precisa dele.
 *
 * Os três primeiros papéis vêm de REATIVA-PRODUCT-VISION § 8 ("Mensagens por
 * Persona") — dono, recepção e gestor. O quarto é o paciente, que fecha o
 * circuito: é a pessoa do outro lado do contato, e a razão de o produto medir
 * ciclo em vez de disparar para a base inteira.
 *
 * Não confundir com a dobra "Para que tipo de clínica", que qualifica
 * especialidade — aqui o recorte é gente, não segmento.
 *
 * `foto` é opcional: sem retrato aprovado, o topo entra como painel neutro na
 * cor do card, em vez de imagem de banco fingindo ser a clínica do cliente.
 */

type Area = {
  titulo: string;
  para: string;
  texto: string;
  cta: string;
  href: string;
  cor: string;
  icone: LucideIcon;
  foto?: string;
};

const AREAS: Area[] = [
  {
    // As três primeiras perguntas são as "perguntas principais" registradas em
    // REATIVA-PRODUCT-VISION § 4, sem reescrita — é a frase que o dono de
    // clínica reconhece como dele.
    titulo: "Quanto dinheiro estou deixando de recuperar?",
    para: "Dono da clínica",
    texto:
      "Quanto da carteira está protegida, em risco ou perdida — e quanto ainda dá para recuperar.",
    // "Cockpit" não existe em nenhum outro lugar do site nem da UI.
    cta: "Veja o painel",
    href: "/preview/estrategia-consultor",
    cor: "#20E0BD",
    icone: Target,
    foto: "/site/persona-dono.jpg",
  },
  {
    titulo: "Quem eu chamo agora?",
    para: "Recepção",
    texto:
      "A fila do dia em ordem de prioridade, com a mensagem certa para cada paciente.",
    cta: "Veja a Central",
    href: "/preview/estrategia-consultor",
    cor: "#FF7A00",
    icone: Users,
    foto: "/site/persona-recepcao.jpg",
  },
  {
    titulo: "O que está funcionando?",
    para: "Gestor",
    // NÃO prometer "quais campanhas trouxeram receita": Campanhas é "Em breve"
    // na UI, e era a única promessa do site sobre função que não existe.
    // Relatórios existe e mede o que voltou — é isso que o card oferece.
    texto:
      "Conversão, recuperação e perda por procedimento — e quanto voltou, por período.",
    cta: "Veja Relatórios",
    href: "/preview/estrategia-consultor",
    cor: "#3B9EFF",
    icone: BarChart3,
    foto: "/site/persona-gestor.jpg",
  },
  {
    // O paciente não está no § 4 — a pergunta é escrita, não citada. Mas é a
    // que ele de fato faz quando a clínica manda mensagem, e a resposta está no
    // ECONOMIC-ENGINE: ciclo por procedimento em vez de disparo para a base.
    titulo: "Isso é cuidado ou é cobrança?",
    para: "Paciente",
    texto:
      "A mensagem chega quando o retorno faz sentido para o procedimento dele — e não num disparo para a base inteira.",
    cta: "Ver as mensagens",
    href: "/preview/estrategia-consultor",
    cor: "#A855F7",
    icone: MessageCircle,
    foto: "/site/persona-cliente.png",
  },
];

/** A foto se apaga para baixo, para o retrato apoiar o card em vez de recortar contra ele. */
const FADE_BAIXO =
  "linear-gradient(to bottom, #000 0%, #000 46%, rgba(0,0,0,0.4) 78%, transparent 100%)";

export function Personas() {
  return (
    <section id="para-quem" className="scroll-mt-28">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#20E0BD]">
              Para quem é
            </p>
            <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-[#F8FAFC] sm:text-4xl">
              Cada área com respostas para as perguntas certas
              <span className="text-[#20E0BD]">.</span>
            </h2>
            <div
              className="mt-7 h-px w-12 bg-[#20E0BD]"
              aria-hidden
            />
            {/* Fala de QUATRO cards: três pessoas dentro da clínica e o
                paciente, que não olha painel nenhum — dizer "olham o mesmo
                painel" excluía justamente o quarto. */}
            <p className="mt-7 max-w-[32ch] text-[15px] leading-relaxed text-[#8B9AA6]">
              Três pessoas na clínica precisam de coisas diferentes do mesmo
              painel — e há uma quarta, do outro lado do contato.
            </p>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {AREAS.map(({ icone: Icone, ...a }) => (
              <li
                key={a.titulo}
                className="card-persona group relative flex flex-col overflow-hidden rounded-[26px] border border-[rgba(120,180,200,0.16)] bg-[rgba(8,20,28,0.66)]"
                style={{ ["--cor" as string]: a.cor }}
              >
                {/* Topo: retrato quando há, painel neutro quando não. A altura é
                    fixa em proporção para o corte da foto ser previsível — sem
                    isso o card muda de forma entre breakpoints e o rosto sai. */}
                <div className="relative aspect-[5/6] w-full shrink-0">
                  {a.foto ? (
                    <Image
                      src={a.foto}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1279px) 45vw, 240px"
                      /* `card-persona-foto` (globals.css) cuida do preto e
                         branco e do zoom no hover: em repouso a foto é sóbria e
                         a cor de acento fica sozinha na hierarquia; no hover a
                         pessoa acende. O zoom respeita movimento reduzido, a
                         cor não — cor não é movimento. */
                      className="card-persona-foto object-cover object-top"
                      style={{
                        maskImage: FADE_BAIXO,
                        WebkitMaskImage: FADE_BAIXO,
                      }}
                    />
                  ) : (
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(120% 90% at 30% 15%, color-mix(in srgb, ${a.cor} 14%, transparent), transparent 70%)`,
                      }}
                    />
                  )}

                  <Icone
                    className="absolute right-5 top-5 h-7 w-7 transition-transform duration-300 ease-out motion-safe:group-hover:scale-110"
                    style={{ color: a.cor }}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>

                <div className="-mt-10 flex flex-1 flex-col px-6 pb-7">
                  {/* O papel vem ANTES do título, como kicker: embaixo, entre o
                      parágrafo e o CTA, ele não tinha função na hierarquia e o
                      cinza o apagava. Aqui ele diz de quem é o card antes de a
                      pessoa ler a pergunta.
                    *
                    * Peso 500 e 85% de opacidade para não competir com o CTA,
                    * que é da mesma cor e também em caixa alta — o de baixo é
                    * ação, o de cima é etiqueta. */}
                  <p
                    className="text-[11px] font-medium uppercase tracking-[0.14em]"
                    style={{ color: a.cor, opacity: 0.85 }}
                  >
                    {a.para}
                  </p>

                  {/* 18px, e não 19: a pergunta do dono é a mais longa e a
                      pergunta precisa caber em três linhas sem apertar. */}
                  <h3 className="mt-2.5 text-pretty text-[17px] font-semibold leading-snug tracking-tight text-[#F8FAFC]">
                    {a.titulo}
                  </h3>

                  <p className="mt-3.5 text-[13px] leading-relaxed text-[#8B9AA6]">
                    {a.texto}
                  </p>

                  {/* `mt-auto` para o CTA encostar no rodapé do card: título de
                      uma ou duas linhas deixava os quatro desalinhados. */}
                  <Link
                    href={a.href}
                    className="mt-auto inline-flex min-h-11 items-center gap-2 self-start rounded pt-6 text-[11px] font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50"
                    style={{ color: a.cor }}
                  >
                    {a.cta}
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-out motion-safe:group-hover:translate-x-1" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
