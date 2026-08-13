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
              <span className="headline-line headline-wide">O risco é não saber</span>
              <span className="headline-line headline-wide accent">quem ainda está</span>
              <span className="headline-line headline-wide accent">dentro dela.</span>
            </h2>
            <p className="description">
              Sem drama: depois do limite, o nome sai da conta recuperável.<br className="desktop-only" /> O
              diagnóstico mostra por quem começar — enquanto ainda dá tempo.
            </p>
            <a className="cta" href="#diagnostico">
              <b>→</b><span>Quero meu diagnóstico</span>
            </a>
            <p className="price"><span className="lock-icon" aria-hidden="true" /> Diagnóstico · R$ 197 · crédito em até 30 dias se contratar</p>
          </div>

          <div className="timeline" aria-label="Status da oportunidade">
            <div className="timeline-labels"><span>Ativo</span><span>Em risco</span><span>Perdido</span></div>
            <div className="line"><i className="risk-dot" /></div>
            <div className="risk-copy">Ainda<br />dá tempo.</div>
          </div>

          <div className="panel-caption"><i /> Não é captar de novo. É reativar o que ainda cabe na janela. <i /></div>
        </article>
      </section>

    </section>
  );
}
