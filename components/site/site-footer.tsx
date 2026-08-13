import Link from "next/link";
import { ReativaLogo } from "@/components/brand/ReativaLogo";
import { FOOTER_COLUMNS } from "@/components/site/site-links";
import { ReativeMark } from "@/components/site/reative-mark";

/**
 * Rodapé e assinatura no mesmo bloco: frase no alto da esquerda, links embaixo
 * dela, marca tipográfica à direita.
 *
 * A frase não pede ação — a última dobra já pediu. Aqui a página assina, e o
 * rodapé aproveita a mesma área em vez de virar uma faixa extra.
 *
 * Em clínica o rodapé também é argumento de venda: quem vai entregar base de
 * paciente procura a política de privacidade antes de responder.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(120,180,200,0.16)]">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-20">
          {/* Escala de tipos da coluna: 48px na frase, 18px nos links e no
              apoio, 14px no copyright.
            *
            * A escala foi calibrada uma oitava acima da primeira versão, que
            * saía miúda: este rodapé divide a tela com uma assinatura
            * tipográfica de 120px, e tipo de 15px ao lado dela lia como nota de
            * pé de página, não como navegação.
            *
            * Link e apoio têm o MESMO corpo. A distinção de papel vem do peso
            * (medium contra regular) e da cor (claro contra cinza médio) — não
            * do tamanho, porque diminuir o link para diferenciá-lo o fazia
            * parecer menos clicável, e não mais. */}
          <div className="flex flex-col">
            <h2 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-[#F8FAFC] sm:text-5xl">
              Não é captar de novo.
              <br />
              É reativar
              <span className="text-[#20E0BD]">.</span>
            </h2>
            {/* `max-w` em `ch` acompanha o corpo do texto: a medida de leitura
                fica em ~34 caracteres sem depender de pixel fixo. */}
            <p className="mt-7 max-w-[34ch] text-[17px] leading-relaxed text-[#8B9AA6]">
              A carteira que sua clínica já construiu vale mais do que a próxima
              campanha.
            </p>

            {/* `max-w-lg` prende as duas colunas juntas: soltas no `1fr` elas
                ficavam a 250px de distância e deixavam de se ler como um par.
                E sem `mt-auto`, que abria um vão morto de 120px no meio. */}
            <nav
              aria-label="Rodapé"
              className="mt-14 grid max-w-xl grid-cols-2 gap-x-10 gap-y-4"
            >
              {FOOTER_COLUMNS.map((coluna, i) => (
                <ul key={i} className="flex flex-col gap-4">
                  {coluna.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        /* `link-filete` (globals.css) desenha o filete teal que
                           cresce da esquerda no hover e no foco por teclado.
                           A mesma classe serve os links do topo. */
                        className="link-filete rounded text-[17px] font-medium leading-snug text-[#B6C4CE] transition-colors hover:text-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </nav>

            {/* Filete antes do fecho, para o logo e o copyright pertencerem à
                coluna em vez de flutuarem soltos abaixo dela. O logo fica: a
                marca tipográfica escreve REATIVE, que é o verbo, não o nome do
                produto — sem ele, alguém conclui que a plataforma se chama
                "Reative". */}
            <div className="mt-14 max-w-xl border-t border-[rgba(120,180,200,0.14)] pt-7">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <ReativaLogo size="footer" />
                <p className="text-[15px] text-[#7C8F9A]">
                  © {new Date().getFullYear()} Reativa+. Todos os direitos
                  reservados.
                </p>
              </div>
            </div>
          </div>

          {/* Centrada na vertical: a coluna da esquerda vai da frase ao
              copyright, e a marca encostada no topo deixava meio bloco vazio
              embaixo. */}
          <div className="flex w-full items-center">
            <ReativeMark />
          </div>
        </div>
      </div>
    </footer>
  );
}
