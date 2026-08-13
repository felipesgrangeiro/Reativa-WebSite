import { Check, ScanFace, ShieldCheck, Smile, Waves, X } from "lucide-react";

const CLINICS = [
  {
    key: "estetica",
    icon: ScanFace,
    title: "Estética",
    description: <>Procedimentos com<br />recorrência e ciclo<br />de retorno.</>,
  },
  {
    key: "dermatologia",
    icon: Waves,
    title: "Dermatologia",
    description: <>Tratamentos e procedimentos<br />com acompanhamento<br />recorrente.</>,
  },
  {
    key: "odontologia",
    icon: Smile,
    title: "Odontologia",
    description: <>Operações em que existe<br />retorno esperado<br />do paciente.</>,
  },
] as const;

export default function ParaQuemSection() {
  return (
    <section className="audience-section" id="para-quem" aria-labelledby="audience-title">
      <header className="audience-intro">
        <p>Para quem é / para quem não é</p>
        <h2 id="audience-title">O Reativa+ funciona onde<br />existe <span>retorno esperado.</span></h2>
        <div>Analisamos ciclos reais de retorno para identificar valor<br />{" "}e priorizar quem ainda está dentro da janela.</div>
      </header>

      <div className="audience-positive-heading">
        <span><Check aria-hidden="true" /></span>
        <div><h3>Para quem é</h3><p>Clínicas com procedimentos que têm recorrência e retorno esperado.</p></div>
      </div>

      <div className="audience-cards">
        {CLINICS.map(({ key, icon: Icon, title, description }) => (
          <article className={`audience-card audience-card-${key}`} key={key}>
            <Icon aria-hidden="true" />
            <h3>{title}</h3>
            <i aria-hidden="true" />
            <p>{description}</p>
          </article>
        ))}
      </div>

      <div className="audience-negative-heading">
        <span><X aria-hidden="true" /></span>
        <div><h3>Para quem não é</h3><p>Operações sem recorrência<br />e sem retorno esperado.</p></div>
      </div>

      <article className="audience-negative-card">
        <span className="audience-negative-mark"><X aria-hidden="true" /></span>
        <h3>Atendimento pontual,<br /><strong>sem ciclo de retorno.</strong></h3>
        <i aria-hidden="true" />
        <p>Se o serviço acontece uma vez<br />e não existe uma recorrência<br />esperada, o Reativa+ não tem<br />uma janela econômica para analisar.</p>
      </article>

      <div className="audience-conclusion">
        <i aria-hidden="true" />
        <ShieldCheck aria-hidden="true" />
        <p>Não é sobre o tamanho da clínica.<br /><strong>É sobre existir recorrência.</strong></p>
        <i aria-hidden="true" />
      </div>
    </section>
  );
}
