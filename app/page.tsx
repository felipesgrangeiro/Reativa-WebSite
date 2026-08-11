export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero" aria-labelledby="hero-title">
        <div className="ambient ambient-left" />
        <div className="ambient ambient-right" />

        <article className="glass-panel">
          <i className="bolt bolt-tl" />
          <i className="bolt bolt-tr" />
          <i className="bolt bolt-bl" />
          <i className="bolt bolt-br" />

          <div className="intro">
            <p className="eyebrow">Ainda dá tempo</p>
            <h1 id="hero-title">
              A janela existe.<br />A diferença é saber<br />
              <span>quem ainda está<br />dentro dela.</span>
            </h1>
            <p className="description">
              O Reativa+ mostra por quem começar,<br className="desktop-only" /> quanto ainda está associado a esses
              relacionamentos e até quando existe oportunidade de agir.
            </p>
            <a className="cta" href="#diagnostico">
              <b>→</b> Quero meu diagnóstico
            </a>
            <p className="price"><span>♙</span> Diagnóstico Reativa+ · R$ 197 · pagamento único</p>
          </div>

          <div className="timeline" aria-label="Status da oportunidade">
            <div className="timeline-labels"><span>Ativo</span><span>Em risco</span><span>Perdido</span></div>
            <div className="line"><i className="risk-dot" /></div>
            <div className="risk-copy">Ainda<br />dá tempo.</div>
          </div>

          <div className="panel-caption"><i /> Por quem começar. Quanto vale. Até quando ainda dá tempo. <i /></div>
        </article>
      </section>

      <footer>
        <span className="logo">REATIVA<span>+</span></span><em />
        <small>© 2026 Reativa+. Todos os direitos reservados.</small>
        <nav><a href="#termos">Termos de Uso</a><a href="#privacidade">Política de Privacidade</a><a href="#contato">Contato</a></nav>
        <div className="social" aria-label="Redes sociais"><a href="#linkedin">in</a><a href="#instagram">◎</a><a href="#email">✉</a></div>
      </footer>
    </main>
  );
}
