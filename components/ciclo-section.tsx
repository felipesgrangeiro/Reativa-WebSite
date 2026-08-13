import { Clock3, Hourglass, LockKeyhole } from "lucide-react";

type ProcedureTimelineProps = {
  kind: "botox" | "skin";
  title: string;
  days: string;
};

function ProcedureTimeline({ kind, title, days }: ProcedureTimelineProps) {
  return (
    <article className={`procedure-panel procedure-${kind}`}>
      <h3>{title}</h3>

      <div className="procedure-last">Último procedimento</div>
      <div className="procedure-limit">Limite<br />da janela</div>

      <div className="procedure-track" aria-label={`${title}: ciclo de ${days}`}>
        <i className="procedure-node procedure-node-active" />
        <i className="procedure-node procedure-node-risk" />
        <i className="procedure-node procedure-node-lost" />
        <span className="procedure-window"><b>{days}</b></span>
      </div>

      <div className="procedure-status" aria-hidden="true">
        <strong>Ativo</strong><strong>Em risco</strong><strong>Perdido</strong>
      </div>
    </article>
  );
}

const STATUS = [
  { key: "active", title: "Ativo", lead: "Dentro do ciclo.", copy: "Ainda não é hora de agir." },
  { key: "risk", title: "Em risco", lead: "Passou do ciclo.", copy: "Ainda está dentro da janela\nde recuperação." },
  { key: "lost", title: "Perdido", lead: "Passou do limite.", copy: "Não entra na receita\nrecuperável." },
] as const;

export default function CicloSection() {
  return (
    <section className="cycle-section" id="por-que" aria-labelledby="cycle-title">
      <div className="cycle-copy">
        <p className="cycle-eyebrow">O tempo não é igual para todo procedimento</p>
        <h2 id="cycle-title">
          Botox pede <span>120 dias.</span><br />
          Limpeza de pele, <span>30.</span>
        </h2>
        <p className="cycle-intro">
          Por isso, uma lista fixa de pacientes inativos<br />{" "}
          não consegue dizer quem realmente precisa<br />{" "}
          de atenção agora.
        </p>
        <i className="cycle-copy-rule" aria-hidden="true" />
        <p className="cycle-explainer">
          O Reativa<span>+</span> considera o ciclo de cada<br />{" "}
          procedimento para entender o momento<br />{" "}
          de cada relacionamento.
        </p>

        <ul className="cycle-points">
          <li><Clock3 aria-hidden="true" /><span>Antes do ciclo, ainda não é hora.</span></li>
          <li><Hourglass aria-hidden="true" /><span>Depois do ciclo, começa a janela<br />de recuperação.</span></li>
          <li><LockKeyhole aria-hidden="true" /><span>Depois do limite, o relacionamento<br />deixa de entrar na conta recuperável.</span></li>
        </ul>
      </div>

      <div className="cycle-procedures">
        <ProcedureTimeline kind="botox" title="Botox" days="120 dias" />
        <ProcedureTimeline kind="skin" title="Limpeza de pele" days="30 dias" />
      </div>

      <div className="cycle-status-legend">
        {STATUS.map((item) => (
          <article className={`cycle-status-card cycle-status-${item.key}`} key={item.key}>
            <span className="cycle-target" aria-hidden="true"><i /></span>
            <div>
              <h3>{item.title}</h3>
              <strong>{item.lead}</strong>
              {item.copy.split("\n").map((line) => <p key={line}>{line}</p>)}
            </div>
          </article>
        ))}
      </div>

      <div className="cycle-question">
        <b aria-hidden="true">⌄</b>
        <p>Então por que tratar todos como <span>“inativos há 90 dias”?</span></p>
      </div>
    </section>
  );
}
