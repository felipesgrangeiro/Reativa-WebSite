import Image from "next/image";
import {
  BarChart3,
  ChevronRight,
  Clock,
  Crosshair,
  DollarSign,
  HelpCircle,
  MessageCircle,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { proceduresLibrary } from "@/data/procedures-library";
import { reactivationPatients } from "@/data/reactivation-patients";
import {
  priorityTier,
  type PriorityTier,
} from "@/lib/revenue-intelligence/decision";
import { buildRelationshipEconomics } from "@/lib/revenue-intelligence/pipeline";
import { formatCurrency } from "@/lib/utils";

/**
 * Dobra "A diferença Reativa+": a lista de inativo comum contra a fila que o
 * produto entrega. Segue o print de referência de perto — dois painéis
 * espelhados, cinco falhas contra cinco ganhos, esqueleto cinza à esquerda,
 * seta no meio e retrato na fila.
 *
 * A fila da direita NÃO é digitada à mão. Sai de
 * `buildRelationshipEconomics(reactivationPatients, proceduresLibrary)` — o
 * mesmo motor que alimenta o Consultor Reativa+ dentro do produto. Três
 * consequências, e é por isso que vale importar o motor numa página de
 * marketing:
 *
 *  1. O que a vitrine promete é aritmeticamente o que o painel mostra.
 *  2. Os números não apodrecem: as datas do seed são relativas a "hoje", então
 *     "30 dias além do ciclo" continua verdade em qualquer data.
 *  3. A fila só pode conter quem o motor classifica como "em risco", porque
 *     `receitaRecuperavel` é zero fora desse estado.
 *
 * A ORDEM é por `prioridadeEconomica`, não por `receitaRecuperavel` — é o que a
 * Central usa (`sortByPriority`). Ordenar por valor deixava o badge
 * não-monotônico (R$ 513 "Alta" acima de R$ 568 "Média"), o que lê como tabela
 * quebrada e derruba a credibilidade que a seção existe para construir.
 */

/** Quantas linhas da fila mostrar. Cinco cabem sem rolagem e já mostram ordem. */
const LINHAS = 5;

type Item = { titulo: string; texto: string; icone: LucideIcon };

/**
 * Cinco falhas contra cinco ganhos, na mesma ordem — o espelhamento é o
 * argumento da dobra: cada falha da esquerda tem o par exato à direita.
 */
const FALHAS: Item[] = [
  {
    titulo: "Listas genéricas",
    texto: "Todos os pacientes parecem iguais.",
    icone: Users,
  },
  {
    titulo: "Sem contexto do relacionamento",
    texto: "Botox dura 120 dias, limpeza pede 30. Um prazo só erra os dois.",
    icone: Clock,
  },
  {
    titulo: "Sem prioridade econômica",
    texto: "A equipe gasta tempo com quem tem pouco retorno.",
    icone: BarChart3,
  },
  {
    titulo: "Ações dispersas",
    texto: "Mensagens e ligações sem estratégia.",
    icone: MessageCircle,
  },
  {
    titulo: "Resultado incerto",
    texto: "Ninguém sabe quanto será recuperado.",
    icone: HelpCircle,
  },
];

const GANHOS: Item[] = [
  {
    titulo: "Oportunidades reais",
    texto: "Apenas quem ainda pode voltar.",
    icone: Target,
  },
  {
    titulo: "Contexto do ciclo",
    texto: "O ciclo de cada procedimento define o momento de agir.",
    icone: Clock,
  },
  {
    titulo: "Prioridade econômica",
    texto: "Foco no que mais impacta o caixa.",
    icone: DollarSign,
  },
  {
    titulo: "Ações direcionadas",
    texto: "A mensagem certa, para a pessoa certa.",
    icone: MessageCircle,
  },
  {
    titulo: "Resultado previsível",
    texto: "A receita recuperada é estimada e medida.",
    icone: TrendingUp,
  },
];

/**
 * Esqueleto da lista comum: barras cinzas com os dias sem retorno ao lado.
 * Os números são fixos de propósito — este lado representa uma lista que NÃO
 * conhece ciclo, então derivá-los do motor daria a ele uma inteligência que o
 * argumento diz que ele não tem.
 *
 * DEZ linhas porque a linha do esqueleto é fina e a da fila real tem avatar:
 * dez aqui dão a mesma altura que cinco lá (medido: 422px dos dois lados), e é
 * isso que deixa os dois artefatos na mesma altura, comparáveis de relance.
 * Mexer na contagem sem remedir desalinha os dois painéis.
 */
const DIAS_SEM_RETORNO = [23, 61, 18, 97, 45, 12, 83, 35, 66, 14];

/** Cor de cada faixa de prioridade, escolhida por `priorityTier`. */
const TIER: Record<PriorityTier, { label: string; cor: string; fundo: string }> =
  {
    alta: { label: "Alta", cor: "#FF8A8A", fundo: "rgba(255,90,90,0.14)" },
    media: { label: "Média", cor: "#FFC06B", fundo: "rgba(255,150,40,0.14)" },
    baixa: { label: "Baixa", cor: "#9FB0BC", fundo: "rgba(120,180,200,0.1)" },
  };

/**
 * Retrato de cada paciente da fila, por id do seed.
 *
 * Vazio hoje: o projeto não tem foto de paciente em `public/`, e reaproveitar as
 * quatro fotos de persona colocaria o mesmo rosto duas vezes na mesma página com
 * papéis diferentes. Preencher com `{ p18: "/site/paciente-x.jpg" }` quando
 * houver arquivo licenciado — sem entrada, a célula cai nas iniciais.
 */
const RETRATOS: Record<string, string> = {};

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? (partes[partes.length - 1]?.[0] ?? "") : "";
  return (primeira + ultima).toUpperCase();
}

/**
 * Os itens vão em DUAS colunas abaixo do artefato, e não numa coluna estreita
 * ao lado dele. Ao lado, a tabela de quatro colunas e a lista dividiam 614px:
 * os cabeçalhos "Recuperável" e "Prioridade" colidiam e os títulos dos ganhos
 * quebravam em duas linhas. Empilhados, o artefato ocupa a largura inteira do
 * painel e cada item tem ~290px.
 *
 * Ganha-se também o paralelo: os dois artefatos ficam na mesma altura e na
 * mesma largura, um em frente ao outro, que é o que torna a comparação legível.
 */
function ListaItens({ itens, cor }: { itens: Item[]; cor: string }) {
  return (
    <ul className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
      {itens.map(({ icone: Icone, ...i }) => (
        <li key={i.titulo} className="flex gap-3.5">
          <span
            className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg"
            style={{ background: `color-mix(in srgb, ${cor} 12%, transparent)` }}
          >
            <Icone
              className="h-4 w-4"
              style={{ color: cor }}
              strokeWidth={1.9}
              aria-hidden
            />
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-semibold leading-snug text-[#F8FAFC]">
              {i.titulo}
            </span>
            <span className="mt-1 block text-[13px] leading-relaxed text-[#7C8F9A]">
              {i.texto}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Diferenca() {
  const economics = buildRelationshipEconomics(
    reactivationPatients,
    proceduresLibrary
  );

  const fila = economics
    .filter((e) => e.state === "em_risco" && e.receitaRecuperavel > 0)
    .sort((a, b) => b.prioridadeEconomica - a.prioridadeEconomica);

  const visiveis = fila.slice(0, LINHAS);
  const totalRecuperavel = fila.reduce((s, e) => s + e.receitaRecuperavel, 0);

  /* Faixa relativa à MAIOR prioridade da fila inteira, não das cinco visíveis:
     recortar antes de comparar faria a quinta linha virar "alta" só porque as
     outras saíram da tela. */
  const maxPrioridade = Math.max(0, ...fila.map((e) => e.prioridadeEconomica));

  return (
    <section className="border-y border-[rgba(120,180,200,0.12)] bg-[rgba(4,19,26,0.5)]">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#20E0BD]">
            A diferença Reativa+
          </p>
          {/* "recuperam receita." inteiro em teal, como na referência — e não
              só o ponto final, que é o padrão do resto do site. Aqui o destaque
              é a promessa, não a pontuação: a frase contrasta "dados" contra
              "decisões que recuperam receita", e colorir só o ponto não marcava
              o lado que importa do contraste. */}
          <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-[#F8FAFC] sm:text-4xl">
            Mais que dados.
            <br />
            Decisões que{" "}
            <span className="text-[#20E0BD]">recuperam receita.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[54ch] text-[17px] leading-relaxed text-[#8B9AA6]">
            Enquanto outras ferramentas mostram informações, o Reativa+
            transforma sua carteira em uma fila de oportunidades priorizadas por
            impacto econômico.
          </p>
        </div>

        {/* `items-stretch` para os dois painéis terminarem na mesma altura, e a
            seta cair no meio de uma linha e não de um degrau. */}
        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.28fr)] lg:gap-4">
          <div className="min-w-0 rounded-3xl border border-[rgba(120,180,200,0.12)] p-5 sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B9AA6]">
              Sem Reativa+
            </p>
            {/* Frase única, paralela à do painel direito ("Fila de
                oportunidades, por prioridade") — e com número, como pede a
                regra 1 da skill de redação.
              *
              * O print de referência escreve aqui "Carteira desorganizada.
              * Decisões no achismo.", que é o contraste em duas frases curtas —
              * a figura de linguagem da marca. Mas ela já está no H2 desta mesma
              * dobra, dois blocos acima, e outra vez na assinatura do rodapé:
              * três na mesma rolagem viram tique, e a própria skill pede
              * parcimônia. Aqui é onde ela sai mais barato.
              *
              * E sem os "90 dias": o número aparecia aqui, outra vez em "ela
              * avisa aos 90 dias" e uma terceira no card das duas leituras. A
              * terceira é a forte, porque tem a prova ao lado — as outras duas
              * gastavam o número antes dela. */}
            <p className="mt-3 text-[17px] font-semibold leading-snug text-[#AAB7C4]">
              Todos na mesma régua, sem olhar procedimento.
            </p>

            <div className="mt-7 space-y-7">
              {/* Esqueleto: a lista comum mostra linha e prazo, sem valor nem
                  ordem. As barras são a informação que ela NÃO dá. */}
              <div
                aria-hidden
                className="min-w-0 rounded-xl border border-[rgba(120,180,200,0.1)] bg-[rgba(2,10,14,0.45)] p-3.5"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[rgba(120,180,200,0.1)] pb-2.5">
                  <span className="text-[11px] uppercase tracking-[0.08em] text-[#4A5C66]">
                    Paciente
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.08em] text-[#4A5C66]">
                    Dias
                  </span>
                </div>
                <ul className="mt-1">
                  {DIAS_SEM_RETORNO.map((d, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-3 border-b border-[rgba(120,180,200,0.06)] py-[7px]"
                    >
                      <span
                        className="h-2 rounded-full bg-[rgba(120,180,200,0.14)]"
                        style={{ width: `${52 + ((i * 13) % 34)}%` }}
                      />
                      <span className="shrink-0 text-[11px] tabular-nums text-[#5C7280]">
                        {d}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Espelha a linha de total da fila real, e é aí que o
                    esqueleto deixa de ser enfeite: do outro lado há um número,
                    deste lado há um traço. A lista comum não erra o total — ela
                    não tem total. */}
                <div className="mt-3.5 flex items-baseline justify-between gap-3 border-t border-[rgba(120,180,200,0.1)] pt-3.5">
                  <span className="text-[11px] text-[#4A5C66]">
                    Recuperável nesta fila
                  </span>
                  <span className="text-[15px] font-semibold text-[#4A5C66]">
                    —
                  </span>
                </div>
              </div>

              <ListaItens itens={FALHAS} cor="#8B9AA6" />
            </div>
          </div>

          {/* Seta decorativa: `aria-hidden` e sem foco, para não se passar por
              controle. Só entre painéis lado a lado — empilhados, ela apontaria
              para o lugar errado, então desaparece abaixo de `lg`. */}
          <div
            aria-hidden
            className="hidden shrink-0 items-center justify-center lg:flex"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(32,224,189,0.35)] bg-[rgba(4,19,26,0.9)]">
              <ChevronRight
                className="h-4 w-4 text-[#20E0BD]"
                strokeWidth={2.4}
              />
            </span>
          </div>

          <div className="min-w-0 rounded-3xl border border-[rgba(32,224,189,0.28)] bg-[rgba(8,22,30,0.66)] p-5 sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20E0BD]">
              Com Reativa+
            </p>
            <p className="mt-3 text-[17px] font-semibold leading-snug text-[#F8FAFC]">
              Fila de oportunidades, por prioridade.
            </p>

            <div className="mt-7 space-y-7">
              {/* Moldura de produto: com a tela nomeada, a fila lê como recorte
                  do painel em vez de tabela solta numa página de marketing. */}
              <div className="min-w-0 rounded-2xl border border-[rgba(120,180,200,0.14)] bg-[rgba(2,10,14,0.6)] p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <Crosshair
                    className="h-3.5 w-3.5 shrink-0 text-[#20E0BD]"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <p className="text-[13px] font-semibold tracking-tight text-[#F8FAFC]">
                    Central de Reativação
                  </p>
                </div>

                <div className="mt-4 overflow-x-auto">
                  {/* `table-fixed` com largura declarada nas três últimas colunas:
                      sem isso a tabela não encolhe abaixo do próprio conteúdo e o
                      badge de prioridade saía da área visível no celular — e
                      prioridade é a informação que a fila existe para dar. A
                      coluna do paciente fica com o resto e trunca. */}
                  <table className="w-full table-fixed border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[rgba(120,180,200,0.16)]">
                        <th className="px-1.5 pb-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[#7C8F9A]">
                          Paciente
                        </th>
                        {/* Some no celular: com quatro colunas a tabela
                            passava de 370px numa tela de 390 e o badge de
                            prioridade caía fora da área visível. Atraso é a
                            coluna mais dispensável das quatro — o ciclo já é
                            explicado no card ao lado. */}
                        <th className="hidden w-[84px] px-1.5 pb-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[#7C8F9A] sm:table-cell">
                          Atraso
                        </th>
                        <th className="w-[88px] px-1.5 pb-2.5 text-right text-[11px] font-medium uppercase tracking-[0.03em] text-[#7C8F9A]">
                          Recuperável
                        </th>
                        <th className="w-[78px] px-1.5 pb-2.5 text-right text-[11px] font-medium uppercase tracking-[0.03em] text-[#7C8F9A]">
                          Prioridade
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visiveis.map((e) => {
                        const t =
                          TIER[
                            priorityTier(e.prioridadeEconomica, maxPrioridade)
                          ];
                        const foto = RETRATOS[e.patientId];
                        return (
                          <tr
                            key={e.patientId}
                            className="border-b border-[rgba(120,180,200,0.08)]"
                          >
                            <td className="px-1.5 py-3">
                              <div className="flex items-center gap-2.5">
                                <span
                                  aria-hidden
                                  className="relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-[rgba(32,224,189,0.1)] text-[11px] font-semibold text-[#20E0BD]"
                                >
                                  {foto ? (
                                    <Image
                                      src={foto}
                                      alt=""
                                      fill
                                      sizes="32px"
                                      className="object-cover"
                                    />
                                  ) : (
                                    iniciais(e.patientName)
                                  )}
                                </span>
                                <span className="min-w-0">
                                  <span className="block truncate text-[13px] font-medium leading-tight text-[#F8FAFC]">
                                    {e.patientName}
                                  </span>
                                  <span className="block truncate text-[11px] leading-tight text-[#7C8F9A]">
                                    {e.procedureName}
                                  </span>
                                </span>
                              </div>
                            </td>
                            <td className="hidden whitespace-nowrap px-1.5 py-3 text-[13px] text-[#AAB7C4] sm:table-cell">
                              {e.diasDecorridos - e.ciclo} dias
                            </td>
                            <td className="whitespace-nowrap px-1.5 py-3 text-right text-[13px] font-semibold text-[#F8FAFC]">
                              {formatCurrency(e.receitaRecuperavel)}
                            </td>
                            <td className="whitespace-nowrap px-1.5 py-3 text-right">
                              <span
                                className="inline-block rounded px-2 py-0.5 text-[11px] font-semibold"
                                style={{ color: t.cor, background: t.fundo }}
                              >
                                {t.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="text-[13px] text-[#8B9AA6]">
                    {fila.length} ainda na janela de recuperação
                  </p>
                  <p className="text-[17px] font-semibold tracking-tight text-[#20E0BD]">
                    {formatCurrency(totalRecuperavel)}
                  </p>
                </div>
              </div>

              <ListaItens itens={GANHOS} cor="#20E0BD" />
            </div>

            {/* A ressalva é o argumento, não letra miúda: é ela que separa uma
                estimativa honesta de uma lista que promete a base inteira. A
                segunda frase existe porque o valor exibido é menor que o ticket
                do procedimento — `receitaRecuperavel` já vem multiplicada pelo
                MPR, e sem dizer isso o dono conclui que a conta está errada. */}
            <p className="mt-6 text-[13px] leading-relaxed text-[#647B85]">
              Quem passou da janela não entra na conta. E cada valor já vem
              multiplicado pela chance real daquele paciente voltar — não é o
              ticket cheio do procedimento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
