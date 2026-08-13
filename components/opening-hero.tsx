import { Clock3, DollarSign, Target } from "lucide-react";
import { ReativaLogo } from "@/components/brand/ReativaLogo";
import { LOGIN_URL } from "@/components/site/site-links";

const BENEFITS = [
  {
    icon: Target,
    title: "Por quem começar",
    copy: "A fila certa — não a lista genérica de inativos.",
  },
  {
    icon: DollarSign,
    title: "Quanto ainda pode voltar",
    copy: "O valor que ainda está dentro da janela.",
  },
  {
    icon: Clock3,
    title: "Até quando dá tempo",
    copy: "Depois do limite, sai da conta recuperável.",
  },
] as const;

export default function OpeningHero() {
  return (
    <section className="opening-hero" id="inicio" aria-labelledby="opening-title">
      <div className="opening-photo" aria-hidden="true" />

      <header className="opening-header">
        <a className="opening-logo" href="#inicio" aria-label="Reativa+ — início">
          <ReativaLogo size="nav" priority />
        </a>

        <nav aria-label="Navegação principal">
          <a href="#como-funciona">Como funciona</a>
          <a href="#por-que">Por que Reativa+</a>
          <a href="#para-quem">Para quem é</a>
          <a href="#diagnostico">Diagnóstico</a>
          <a href={LOGIN_URL}>Entrar</a>
        </nav>

        <a className="opening-header-cta" href="#diagnostico">Quero meu diagnóstico</a>
      </header>

      <div className="opening-copy">
        <p className="opening-eyebrow">Sua base ainda tem receita escondida</p>
        <h1 id="opening-title">
          <span className="opening-title-line">Transforme pacientes</span>
          <span className="opening-title-line">perdidos em</span>
          <span className="opening-title-line opening-title-accent">faturamento.</span>
        </h1>
        <p className="opening-lead">
          <span>Parte da sua carteira ainda está na janela.</span>
          <span>O Reativa+ mostra por quem começar, quanto</span>
          <span>vale — e até quando ainda dá tempo de agir.</span>
        </p>
        <div className="opening-actions">
          <a className="opening-primary" href="#diagnostico">Quero meu diagnóstico</a>
          <a className="opening-secondary" href="#como-funciona">
            Ver como a janela funciona <b aria-hidden="true">→</b>
          </a>
        </div>
      </div>

      <div className="opening-timeline" aria-label="Ativo, em risco e perdido">
        <span className="opening-status opening-status-active">Ativo</span>
        <span className="opening-status opening-status-risk">Em risco</span>
        <span className="opening-status opening-status-lost">Perdido</span>
        <i className="opening-window-limit" aria-hidden="true" />
        <div className="opening-track" aria-hidden="true">
          <i className="opening-node opening-node-one" />
          <i className="opening-node opening-node-two" />
          <i className="opening-node opening-node-risk" />
          <i className="opening-node opening-node-limit" />
          <i className="opening-node opening-node-last" />
        </div>
        <strong>Ainda dá tempo.</strong>
      </div>

      <div className="opening-benefits">
        {BENEFITS.map(({ icon: Icon, title, copy }) => (
          <article key={title}>
            <span aria-hidden="true"><Icon /></span>
            <div><h2>{title}</h2><p>{copy}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
