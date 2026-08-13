/**
 * Assinatura tipográfica do fim do site: REATIVE repetida em linhas empilhadas,
 * com entrelinha apertada e cada linha deslocada na horizontal.
 *
 * As letras ficam INTEIRAS. A versão anterior tentava fragmentá-las cortando com
 * a grade, mas isso exige um alfabeto modular desenhado para ser cortado —
 * cortar fonte de sistema produz letra quebrada, que lê como erro de renderização
 * e não como design. Aqui a repetição faz o volume e o deslocamento faz o ritmo.
 *
 * Em repouso as linhas de fora ficam apagadas e a do meio acesa, o que dá foco
 * e profundidade. No hover todas acendem e deslizam para perto do alinhamento,
 * uma depois da outra — a palavra é verbo no imperativo, e o movimento é a
 * reativação se espalhando.
 *
 * O movimento vive em globals.css (`.marca-reative`), porque depende de
 * variáveis por linha e de `prefers-reduced-motion`.
 */

const PALAVRA = "REATIVE";

/**
 * Uma entrada por linha, à mão.
 *
 * `dx` / `dxHover` — deslocamento horizontal em repouso e no hover, em %.
 * `op` / `opHover`  — opacidade em repouso e no hover. Elas clareiam mas NÃO
 *   igualam: levar as sete a 1 achatava a profundidade e enchia o rodapé de
 *   teal saturado, o oposto de discreto.
 * `destaque` — só a linha focal troca de cor. Sete linhas mudando de cor juntas
 *   viram um bloco piscando; uma trocando é acento.
 */
const LINHAS = [
  { dx: -7, dxHover: -2, op: 0.14, opHover: 0.32 },
  { dx: 5, dxHover: 1, op: 0.26, opHover: 0.46 },
  { dx: -3, dxHover: -1, op: 0.5, opHover: 0.72 },
  { dx: 0, dxHover: 0, op: 1, opHover: 1, destaque: true },
  { dx: 6, dxHover: 2, op: 0.42, opHover: 0.64 },
  { dx: -5, dxHover: -1, op: 0.22, opHover: 0.4 },
  { dx: 3, dxHover: 1, op: 0.12, opHover: 0.28 },
] as const;

export function ReativeMark() {
  return (
    <div className="marca-reative w-full select-none overflow-hidden">
      <span className="sr-only">Reative</span>

      {/* `21cqw` amarra o corpo à largura do bloco: a palavra ocupa a coluna em
          qualquer breakpoint, e sobra folga para o deslocamento sem cortar. */}
      <div
        aria-hidden
        className="flex flex-col font-black uppercase leading-[0.86] tracking-[-0.035em]"
        style={{ fontSize: "21cqw" }}
      >
        {LINHAS.map((l, i) => (
          <span
            key={i}
            className={
              "marca-reative-linha whitespace-nowrap" +
              ("destaque" in l ? " marca-reative-linha--destaque" : "")
            }
            style={{
              ["--dx" as string]: `${l.dx}%`,
              ["--dx-hover" as string]: `${l.dxHover}%`,
              ["--op" as string]: l.op,
              ["--op-hover" as string]: l.opHover,
              transitionDelay: `${i * 55}ms`,
            }}
          >
            {PALAVRA}
          </span>
        ))}
      </div>
    </div>
  );
}
