import type { Metadata } from "next";
import OpeningHero from "@/components/opening-hero";
import ReativaHero from "@/components/reativa-hero";
import DiagnosticoSection from "@/components/diagnostico-section";
import CicloSection from "@/components/ciclo-section";
import ParaQuemSection from "@/components/para-quem-section";
import ComoFuncionaSection from "@/components/como-funciona-section";
import PersonasStripSection from "@/components/personas-strip-section";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: "Reativa+ | Ainda dá tempo",
  description:
    "Descubra quem ainda pode voltar, quanto isso vale e por quem começar.",
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
