import Image from "next/image";
import { cn } from "@/lib/utils";

/** Dimensões nativas do arquivo em public/brand/reativa-logo.png */
export const LOGO_WIDTH = 320;
export const LOGO_HEIGHT = 213;

type ReativaLogoProps = {
  size?: "sm" | "nav" | "footer" | "sidebar" | "md" | "lg";
  className?: string;
  priority?: boolean;
};

const displaySize = {
  lg: { width: LOGO_WIDTH, height: LOGO_HEIGHT },
  md: { width: 200, height: Math.round((200 * LOGO_HEIGHT) / LOGO_WIDTH) },
  sidebar: { width: 134, height: 83 },
  /* Entre `sm` e `sidebar`: no rodapé o logo divide a linha com o copyright e
     acompanha links de 17px, então 96px ficava miúdo. Existe com nome próprio
     para o rodapé não ter de pedir `sidebar`, que mediria certo e leria errado. */
  footer: { width: 128, height: Math.round((128 * LOGO_HEIGHT) / LOGO_WIDTH) },
  /* Topo do site. 124px dá 76px de altura numa barra de 80 — a caixa cabe com
     folga, e o desenho cresce mais do que a conta sugere porque o PNG tem
     margem transparente em volta da marca. Subir daqui exige subir a barra. */
  nav: { width: 124, height: Math.round((124 * LOGO_HEIGHT) / LOGO_WIDTH) },
  sm: { width: 96, height: Math.round((96 * LOGO_HEIGHT) / LOGO_WIDTH) },
} as const;

export function ReativaLogo({
  size = "lg",
  className,
  priority = false,
}: ReativaLogoProps) {
  const { width, height } = displaySize[size];

  return (
    <div className={cn("inline-flex shrink-0 max-w-full", className)}>
      <Image
        src="/brand/reativa-logo.png"
        alt="Reativa+"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority={priority}
        className="max-w-full object-contain object-left"
        style={{ width, height }}
      />
    </div>
  );
}
