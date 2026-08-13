import { DollarSign, Info, Star, Users } from "lucide-react";

/**
 * Cartão de números da hero: o retrato de uma carteira já analisada.
 *
 * OS VALORES SÃO ILUSTRATIVOS, e isso é uma exceção consciente à regra da skill
 * de redação ("toda cifra de vitrine sai do motor"). O selo abaixo do valor diz
 * isso na TELA — sem ele a exceção não se sustenta, porque o argumento a seguir
 * depende de o exemplo estar declarado onde o visitante lê, não só aqui. A razão:
 *
 * O seed de `reactivationPatients` tem 24 pacientes distribuídos de propósito
 * por TODAS as faixas do cálculo — 38% dele está "em risco". Nenhuma clínica
 * real tem 38% da carteira em risco; aquela distribuição existe para exercitar
 * o motor nos testes, não para representar alguém. Projetar o seed para o
 * tamanho de uma clínica de verdade multiplica junto uma proporção que é
 * artificial, e o resultado (450 pacientes em risco, R$ 166 mil recuperáveis)
 * é menos honesto que um exemplo declarado.
 *
 * Os números abaixo são CONSERVADORES em relação ao motor: R$ 12.680 para 142
 * pacientes dá R$ 89 por relacionamento, contra os R$ 370 que o motor calcula
 * hoje. Ou seja, o cartão promete menos do que o produto entrega — que é o lado
 * certo de errar numa vitrine.
 *
 * Quando houver carteira real de cliente, este bloco vira o retrato dela e a
 * exceção deixa de existir.
 */

const RECEITA_POTENCIAL = "38.420";

const NUMEROS = [
  {
    icone: Users,
    valor: "142",
    label: ["pacientes", "em risco"],
  },
  {
    icone: Star,
    valor: "37",
    label: ["prioritários", "para contato"],
  },
  {
    icone: DollarSign,
    valor: "R$ 12.680",
    label: ["recuperável", "agora"],
  },
];

/**
 * Disposição EMPILHADA, e não em duas colunas com filete vertical.
 *
 * A versão em colunas precisava de 660px e a coluna de texto da hero dá 574 —
 * o cartão estourava 86px em 1280, 1440 e 1920 (medido), e "R$ 12.680" caía
 * fora da borda, por cima do rosto da foto. O `flex-nowrap` que mantinha os três
 * indicadores em linha era justamente o que impedia o conteúdo de encolher.
 *
 * Sem `max-w` próprio: o cartão herda a largura da coluna de texto, então a
 * hero passa a ter UMA borda esquerda e uma direita para eyebrow, título, apoio,
 * CTAs e cartão. Era o desalinho que sobrava na dobra.
 */
export function HeroNumeros() {
  return (
    <div className="mt-11 rounded-[22px] border border-[rgba(32,224,189,0.22)] bg-[rgba(3,13,18,0.82)] p-6 backdrop-blur-md">
      {/* Linha 1: o valor à esquerda, o selo do exemplo à direita. Juntos numa
          linha só, porque o selo qualifica o número — separá-los em linhas
          diferentes soltava a ressalva do que ela ressalva. */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20E0BD]">
            Receita potencial identificada
          </p>
          <p className="mt-2 flex items-start text-[#F8FAFC]">
            <span className="mt-1 text-[17px] font-medium tracking-tight">R$</span>
            <span className="text-[38px] font-semibold leading-none tracking-tight tabular-nums">
              {RECEITA_POTENCIAL}
            </span>
          </p>
        </div>
          {/* O selo DECLARA o exemplo, e é a peça que torna legítima a exceção
              descrita no topo do arquivo.
            *
            * Dizia "Análise atualizada hoje": afirmava atualidade de números que
            * são ilustrativos, o oposto do que o comentário promete. Com o selo
            * antigo o cartão não era exemplo declarado, era dado apresentado como
            * real — e ser conservador em relação ao motor não corrige isso,
            * porque o problema é o status do número e não o tamanho dele. */}
        <p className="inline-flex items-center gap-2 rounded-full border border-[rgba(120,180,200,0.2)] bg-[rgba(120,180,200,0.06)] px-3 py-1.5 text-[13px] text-[#C3D0D9]">
          <Info
            className="h-3.5 w-3.5 shrink-0 text-[#20E0BD]"
            strokeWidth={2}
            aria-hidden
          />
          Exemplo de carteira analisada
        </p>
      </div>

      {/* Filete HORIZONTAL no lugar do vertical: separa o total dos três
          indicadores que o compõem, que é a relação real entre eles. */}
      <div
        aria-hidden
        className="my-5 h-px w-full bg-[linear-gradient(90deg,rgba(120,180,200,0.26),rgba(120,180,200,0.04))]"
      />

      {/* Ícone ao LADO do número, não acima: em três colunas de ~170px a versão
          empilhada gastava 36px de altura por indicador sem ganhar leitura. */}
      <ul className="grid grid-cols-3 gap-x-4">
        {NUMEROS.map(({ icone: Icone, ...n }) => (
          <li key={n.label.join(" ")} className="flex min-w-0 items-start gap-2.5">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[rgba(32,224,189,0.28)] bg-[rgba(32,224,189,0.07)]">
              <Icone
                className="h-[15px] w-[15px] text-[#20E0BD]"
                strokeWidth={1.9}
                aria-hidden
              />
            </span>
            <span className="min-w-0">
              <span className="block whitespace-nowrap text-[26px] font-semibold leading-none tracking-tight text-[#F8FAFC] tabular-nums">
                {n.valor}
              </span>
              {/* Sem `whitespace-nowrap` aqui: em três colunas fixas o rótulo
                  precisa poder quebrar, e a quebra natural em duas palavras já
                  dá duas linhas alinhadas nos três. */}
              <span className="mt-1.5 block text-[13px] leading-tight text-[#8B9AA6]">
                {n.label[0]} {n.label[1]}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
