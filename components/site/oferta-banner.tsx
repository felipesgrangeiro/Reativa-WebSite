import Link from "next/link";
import { ArrowRight, CalendarDays, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SALES_CTA } from "@/components/site/site-links";
import {
  DIAGNOSTICO_MODALIDADE,
  DIAGNOSTICO_PRECO,
} from "@/components/site/oferta";

/**
 * Lupa com um gráfico de linha dentro da lente.
 *
 * Desenhada aqui porque a lucide não tem: `ScanSearch` é lupa dentro de
 * colchetes de escaneamento e `LineChart` não tem lupa. Nenhuma das duas diz
 * "olhar para dentro dos números", que é o que o diagnóstico faz.
 */
function LupaGrafico({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="10.5" cy="10.5" r="7.5" />
      <path d="M7 12.2l2.4-2.6 2.1 2 3-3.4" />
      <path d="M16 16l5 5" />
    </svg>
  );
}

/** Filete vertical separando as três zonas. Some quando elas empilham. */
function Divisor() {
  return (
    <div
      aria-hidden
      className="hidden h-24 w-px shrink-0 bg-[linear-gradient(180deg,transparent,rgba(120,180,200,0.28),transparent)] lg:block"
    />
  );
}

/**
 * Faixa compacta do diagnóstico — a segunda forma da mesma oferta.
 *
 * Vive logo depois da dobra da diferença, que é onde o visitante acabou de ver
 * a fila real e o total recuperável. É o ponto de maior desejo da página: pedir
 * a ação ali custa menos que esperar ele rolar até a dobra de oferta.
 *
 * Ela CARREGA a âncora `#oferta`, que era do cartão de oferta removido: é o
 * destino de "Preços" no menu e no rodapé (`HOME_ANCHORS.oferta`). Tirar o `id`
 * daqui faz os dois links caírem no vazio.
 *
 * A composição é de três zonas separadas por filete — promessa · preço · ação.
 * Sem os filetes o olho lê tudo como um bloco só e o preço se perde no meio da
 * frase; com eles, cada zona vira uma parada.
 *
 * Preço e modalidade vêm de `oferta.ts` — escrever à mão aqui faria a faixa
 * divergir do cartão na primeira mudança de preço.
 */
export function OfertaBanner() {
  return (
    <section id="oferta" className="mx-auto max-w-7xl px-6 pb-4 scroll-mt-28">
      <div className="relative">
        {/* Halo externo: descola o cartão do fundo sem engrossar a borda. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 rounded-[44px] bg-[radial-gradient(50%_60%_at_50%_50%,rgba(32,224,189,0.09),transparent_75%)]"
        />

        <div className="relative overflow-hidden rounded-[32px] border border-[rgba(32,224,189,0.22)] bg-[rgba(5,17,23,0.9)]">
          <div className="relative flex flex-wrap items-center gap-x-9 gap-y-7 p-8 sm:p-9 lg:flex-nowrap">
            {/* Tile grande, com gradiente interno e brilho: na referência ele
                tem metade da altura do cartão e ancora a composição. */}
            <span
              aria-hidden
              className="grid h-[92px] w-[92px] shrink-0 place-items-center rounded-[26px] border border-[rgba(32,224,189,0.24)] bg-[radial-gradient(120%_120%_at_30%_15%,rgba(32,224,189,0.16),rgba(32,224,189,0.04))] shadow-[0_0_40px_-12px_rgba(32,224,189,0.5)]"
            >
              <LupaGrafico className="h-11 w-11 text-[#20E0BD]" />
            </span>

            <div className="min-w-0 flex-1">
              {/* "quanto existe" em teal: destaca a promessa dentro da frase,
                  e não a pontuação. */}
              <p className="text-pretty text-[26px] font-bold leading-tight tracking-tight text-[#F8FAFC]">
                Descubra <span className="text-[#20E0BD]">quanto existe</span>
                <br className="hidden sm:block" /> para recuperar na sua clínica.
              </p>
              <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-[#8B9AA6]">
                O Diagnóstico Reativa+ revela o valor em risco, as principais
                oportunidades e as ações recomendadas para começar a recuperar
                receita agora.
              </p>
            </div>

            <Divisor />

            <div className="shrink-0 text-center">
              {/* "Diagnóstico", e não "Por apenas". O diminutivo é a marca de
                  quem acha o próprio preço alto — e a página inteira argumenta o
                  contrário: a clínica JÁ gastou para conquistar esses pacientes,
                  então R$ 197 é barato por comparação, não por desculpa. */}
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#20E0BD]">
                Diagnóstico
              </p>
              <p className="mt-1.5 flex items-start justify-center text-[#F8FAFC]">
                <span className="mt-2 text-[26px] font-medium tracking-tight">
                  R$
                </span>
                <span className="text-[56px] font-bold leading-none tracking-tight tabular-nums">
                  {DIAGNOSTICO_PRECO}
                </span>
              </p>
              {/* Pílula, e não texto solto: "pagamento único" responde à objeção
                  "vou ficar preso numa assinatura", e merece forma de selo. */}
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(120,180,200,0.2)] bg-[rgba(120,180,200,0.06)] px-3.5 py-1.5 text-[13px] text-[#C3D0D9]">
                <ShieldCheck
                  className="h-4 w-4 shrink-0 text-[#20E0BD]"
                  strokeWidth={2}
                  aria-hidden
                />
                {DIAGNOSTICO_MODALIDADE}
              </p>
            </div>

            <Divisor />

            <div className="shrink-0">
              <Button asChild size="lg" className="w-full">
                <Link href={SALES_CTA}>
                  Quero meu diagnóstico
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </Button>
              {/* Ícone de calendário porque a condição é um PRAZO: sem ele a
                  frase lê como letra miúda; com ele, lê como regra. */}
              <p className="mt-4 flex items-start gap-2.5 text-[13px] leading-relaxed text-[#8B9AA6]">
                <CalendarDays
                  className="mt-px h-4 w-4 shrink-0 text-[#20E0BD]"
                  strokeWidth={1.9}
                  aria-hidden
                />
                <span>
                  Crédito na 1ª mensalidade
                  <br />
                  se assinar em até 30 dias.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
