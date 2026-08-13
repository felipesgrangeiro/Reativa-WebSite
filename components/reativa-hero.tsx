export default function ReativaHero() {
  return (
    <section className="site-shell" aria-label="Apresentação Reativa+">
      <section className="hero" aria-labelledby="hero-title">
        <div className="ambient ambient-left" />
        <div className="ambient ambient-right" />

        <article className="glass-panel">
          <div className="glass-top-mask" aria-hidden="true" />
          <i className="bolt bolt-tl" />
          <i className="bolt bolt-tr" />
          <i className="bolt bolt-bl" />
          <i className="bolt bolt-br" />

          <div className="intro">
            <p className="eyebrow">Ainda dá tempo</p>
            <h2 className="legacy-title" id="hero-title">
              <span className="headline-line">A janela existe.</span>
              <span className="headline-line headline-wide">A diferença é saber</span>
              <span className="headline-line headline-wide accent">quem ainda está</span>
              <span className="headline-line headline-wide accent">dentro dela.</span>
            </h2>
            <p className="description">
              O Reativa+ mostra por quem começar,<br className="desktop-only" /> quanto ainda está associado a esses
              relacionamentos e até quando existe oportunidade de agir.
            </p>
            <a className="cta" href="#diagnostico">
              <b>→</b><span>Quero meu diagnóstico</span>
            </a>
            <p className="price"><span className="lock-icon" aria-hidden="true" /> Diagnóstico Reativa+ · R$ 197 · pagamento único</p>
          </div>

          <div className="timeline" aria-label="Status da oportunidade">
            <div className="timeline-labels"><span>Ativo</span><span>Em risco</span><span>Perdido</span></div>
            <div className="line"><i className="risk-dot" /></div>
            <div className="risk-copy">Ainda<br />dá tempo.</div>
          </div>

          <div className="panel-caption"><i /> Por quem começar. Quanto vale. Até quando ainda dá tempo. <i /></div>
        </article>
      </section>

    </section>
  );
}
