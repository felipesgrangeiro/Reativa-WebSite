import type { Metadata } from "next";
import OpeningHero from "@/components/opening-hero";
import ReativaHero from "@/components/reativa-hero";
import DiagnosticoSection from "@/components/diagnostico-section";
import CicloSection from "@/components/ciclo-section";
import ParaQuemSection from "@/components/para-quem-section";
import ComoFuncionaSection from "@/components/como-funciona-section";
import PersonasStripSection from "@/components/personas-strip-section";
import { SiteFooter } from "@/components/site/site-footer";

const SITE_URL = "https://lp.reativamais.com";
const OG_IMAGE = "/brand/reativa-logo.png";

export const metadata: Metadata = {
  title: {
    absolute: "Reativa+ | Ainda dá tempo",
  },
  description:
    "Parte da sua carteira ainda está na janela. O Reativa+ mostra por quem começar, quanto vale e até quando ainda dá tempo de agir.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Reativa+",
    title: "Reativa+ | Ainda dá tempo",
    description:
      "Antes de captar de novo, veja o que ainda dá para reativar. Diagnóstico R$ 197 — crédito em até 30 dias se contratar.",
    images: [
      {
        url: OG_IMAGE,
        width: 320,
        height: 213,
        alt: "Reativa+",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Reativa+ | Ainda dá tempo",
    description:
      "Antes de captar de novo, veja o que ainda dá para reativar. Diagnóstico R$ 197.",
    images: [OG_IMAGE],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#02080D] text-[#F8FAFC]">
      <main>
        <OpeningHero />
        <CicloSection />
        <ParaQuemSection />
        <ComoFuncionaSection />
        <PersonasStripSection />
        <DiagnosticoSection />
        <ReativaHero />
      </main>

      <div className="claude-site">
        <SiteFooter />
      </div>
    </div>
  );
}
