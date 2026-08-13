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
    content: <><strong>Quem</strong> está<br />{" "}<strong>dentro da janela?</strong></>,
  },
  {
    icon: CircleDollarSign,
    content: <>Quanto <strong>valor</strong> está associado<br />{" "}a esses relacionamentos?</>,
  },
  {
    icon: Crosshair,
    content: <><strong>Por onde</strong> sua clínica<br />{" "}deve começar?</>,
  },
] as const;

export default function DiagnosticoSection() {
  return (
    <section className="diagnostic-section" id="diagnostico" aria-labelledby="diagnostic-title">
      <div className="diagnostic-copy">
        <p className="diagnostic-eyebrow">Diagnóstico Reativa+</p>
        <h2 className="diagnostic-title" id="diagnostic-title">
          Antes de decidir<br />
          o que fazer,<br />
          <span>descubra o que existe<br />na sua base.</span>
        </h2>
        <p className="diagnostic-lead">
          O diagnóstico revela a condição real da sua carteira<br />{" "}
          e indica por onde começar.
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
              Se você contratar o Reativa+<br />
              em até <strong>30 dias</strong> após o diagnóstico,<br />
              os R$ 197 são creditados na<br />
              primeira mensalidade.
            </p>
          </div>

          <i className="diagnostic-divider diagnostic-divider-three" aria-hidden="true" />

          <div className="diagnostic-benefits">
            <div><UsersRound aria-hidden="true" /><p>Mensalidade definida conforme<br />o <strong>tamanho da sua base.</strong></p></div>
            <div><InfinityIcon aria-hidden="true" /><p>Usuários ilimitados.</p></div>
          </div>

          <a className="diagnostic-cta" href="#diagnostico">
            <b aria-hidden="true">→</b>
            <span>Quero meu diagnóstico</span>
          </a>
        </article>
      </div>

      <div className="diagnostic-caption"><i />O diagnóstico começa pela carteira que sua clínica já construiu.<i /></div>
    </section>
  );
}
