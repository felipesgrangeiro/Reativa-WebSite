import {
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  Crosshair,
  Infinity as InfinityIcon,
  UsersRound,
} from "lucide-react";

const QUESTIONS = [
  {
    icon: UsersRound,
    content: <><strong>Quem</strong> ainda está<br />{" "}<strong>dentro da janela?</strong></>,
  },
  {
    icon: CircleDollarSign,
    content: <>Quanto <strong>faturamento</strong> ainda<br />{" "}pode voltar com esses nomes?</>,
  },
  {
    icon: Crosshair,
    content: <><strong>Por quem</strong> a recepção<br />{" "}deve ligar primeiro?</>,
  },
] as const;

export default function DiagnosticoSection() {
  return (
    <section className="diagnostic-section" id="diagnostico" aria-labelledby="diagnostic-title">
      <div className="diagnostic-copy">
        <p className="diagnostic-eyebrow">Diagnóstico Reativa+</p>
        <h2 className="diagnostic-title" id="diagnostic-title">
          Antes de gastar<br />
          em captar de novo,<br />
          <span>veja o que ainda dá<br />para reativar.</span>
        </h2>
        <p className="diagnostic-lead">
          Em uma leitura da sua base, você sai sabendo<br />{" "}
          quem ainda está na janela — e quem já saiu dela.
        </p>

        <ol className="diagnostic-questions">
          {QUESTIONS.map(({ icon: Icon, content }, index) => (
            <li className="diagnostic-question" key={index}>
              <span className="diagnostic-question-icon" aria-hidden="true"><Icon /></span>
              <p>{content}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="diagnostic-card-stage">
        <article className="diagnostic-board" aria-label="Oferta do Diagnóstico Reativa+">
          <header className="diagnostic-board-brand">
            <ClipboardList aria-hidden="true" />
            <h3><span>Diagnóstico</span><br />Reativa+</h3>
          </header>

          <i className="diagnostic-divider diagnostic-divider-one" aria-hidden="true" />

          <div className="diagnostic-price">
            <div><small>R$</small><strong>197</strong></div>
            <p>pagamento único</p>
          </div>

          <i className="diagnostic-divider diagnostic-divider-two" aria-hidden="true" />

          <div className="diagnostic-credit">
            <CalendarDays aria-hidden="true" />
            <p>
              Contrate o Reativa+ em até<br />
              <strong>30 dias</strong> após o diagnóstico e os<br />
              R$ 197 entram como crédito na<br />
              primeira mensalidade. Depois, não.
            </p>
          </div>

          <i className="diagnostic-divider diagnostic-divider-three" aria-hidden="true" />

          <div className="diagnostic-benefits">
            <div><UsersRound aria-hidden="true" /><p>Mensalidade conforme<br />o <strong>tamanho da sua base.</strong></p></div>
            <div><InfinityIcon aria-hidden="true" /><p>Equipe toda no mesmo painel.</p></div>
          </div>

          <a className="diagnostic-cta" href="#diagnostico">
            <b aria-hidden="true">→</b>
            <span>Quero meu diagnóstico</span>
          </a>
        </article>
      </div>

      <div className="diagnostic-caption"><i />Cada semana fora do ciclo, mais nomes saem da janela.<i /></div>
    </section>
  );
}
