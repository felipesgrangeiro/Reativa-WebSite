import Link from "next/link";
import { ReativaLogo } from "@/components/brand/ReativaLogo";
import { Button } from "@/components/ui/button";
import { LOGIN_URL, SALES_CTA, SITE_NAV } from "@/components/site/site-links";

/**
 * Topo do site público, em forma de cápsula flutuante sobre a hero.
 *
 * Sem estado, então fica em Server Component: numa landing, cada quilobyte de
 * JS é peso que atrasa a primeira pintura.
 *
 * `fixed`, e não `sticky`: preso ao fluxo, o cabeçalho ocupava altura e
 * empurrava a foto da hero para baixo, abrindo uma faixa escura acima dela.
 * Flutuando, a imagem começa no topo da viewport e a cápsula pousa por cima —
 * que é o efeito da referência. A hero compensa com `pt` próprio.
 *
 * Usado só pela home (`app/page.tsx`). Se outra página passar a usar, ela
 * precisa do mesmo respiro no topo, senão o conteúdo entra por baixo da barra.
 *
 * No celular as âncoras somem e ficam logo + CTA. Menu sanduíche exigiria
 * componente de cliente para esconder quatro links que a própria página já
 * mostra na ordem em que o visitante vai rolar.
 */
export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 sm:px-6">
      {/* Borda teal fina + halo: é o halo que descola a cápsula do fundo. Uma
          borda mais grossa daria o mesmo peso e engordaria a barra. */}
      <div className="mx-auto max-w-7xl rounded-[28px] border border-[rgba(32,224,189,0.2)] bg-[rgba(4,14,19,0.82)] shadow-[0_0_50px_-16px_rgba(32,224,189,0.4)] backdrop-blur-xl">
        <nav
          aria-label="Navegação principal"
          className="flex h-[76px] items-center justify-between gap-4 px-5 sm:px-7"
        >
          <Link
            href="/"
            className="shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50"
          >
            <ReativaLogo size="nav" priority />
            <span className="sr-only">Reativa+ — página inicial</span>
          </Link>

          {/* `divide-x` põe o filete ENTRE os itens sem elemento extra por link,
              e some sozinho quando a lista não é exibida. */}
          <ul className="hidden items-center divide-x divide-[rgba(120,180,200,0.16)] md:flex">
            {SITE_NAV.map((item) => (
              <li key={item.href} className="px-5">
                <a
                  href={item.href}
                  className="link-filete rounded text-[15px] text-[#AAB7C4] transition-colors hover:text-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex min-w-0 shrink items-center gap-3 sm:gap-4">
            {/* O filete antes de "Entrar" separa navegação de conta — são dois
                grupos de função diferente, e a referência os divide. */}
            <span
              aria-hidden
              className="hidden h-7 w-px bg-[rgba(120,180,200,0.16)] md:block"
            />
            <a
              href={LOGIN_URL}
              className="link-filete shrink-0 rounded text-[15px] text-[#AAB7C4] transition-colors hover:text-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50"
            >
              Entrar
            </a>
            {/* O rótulo encurta no celular: `whitespace-nowrap` vem do Button, e
                o texto inteiro empurrava a barra além da viewport — o que faz a
                PÁGINA rolar de lado, não só a barra. */}
            <Button
              asChild
              className="shadow-[0_0_28px_-6px_rgba(32,224,189,0.65)]"
            >
              <Link href={SALES_CTA}>
                <span className="sm:hidden">Diagnóstico</span>
                <span className="hidden sm:inline">Quero meu diagnóstico</span>
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
