import {
  Check,
  Database,
  MoreHorizontal,
  ScanFace,
  Smile,
  Syringe,
  Target,
  TriangleAlert,
  X,
} from "lucide-react";

function DataRows() {
  return (
    <div className="process-data-rows" aria-hidden="true">
      <span /><span /><span /><span /><span />
    </div>
  );
}

export default function ComoFuncionaSection() {
  return (
    <section className="process-section" id="como-funciona" aria-labelledby="process-title">
      <header className="process-intro">
        <p>Como funciona</p>
        <h2 id="process-title">Da sua base à<br /><span>ordem de ação.</span></h2>
        <div>
          O Reativa+ organiza os dados da clínica, considera o ciclo<br />{" "}
          de cada procedimento e o estado do relacionamento para<br />{" "}
          indicar quem merece atenção primeiro.
        </div>
      </header>

      <div className="process-flow">
        <article className="process-step">
          <header><b>01</b><i /><h3>A base é preparada</h3><p>Os dados da clínica<br />entram para análise.</p></header>
          <div className="process-card process-card-base">
            <Database aria-hidden="true" />
            <div className="process-data-group"><strong>Pacientes</strong><DataRows /></div>
            <div className="process-data-group"><strong>Procedimentos</strong><DataRows /></div>
            <div className="process-data-group"><strong>Datas</strong><DataRows /></div>
          </div>
        </article>

        <article className="process-step">
          <header><b>02</b><i /><h3>O ciclo entra na conta</h3><p>Cada procedimento é analisado<br />conforme sua referência de retorno.</p></header>
          <div className="process-card process-card-cycle">
            <div className="process-cycle-labels"><strong>Último evento</strong><strong>Ciclo</strong></div>
            <div className="process-cycle-line"><i /><i /></div>
            <div className="process-procedure-icons" aria-hidden="true"><Syringe /><ScanFace /><Smile /><MoreHorizontal /></div>
            <p>O tempo esperado<br />depende do procedimento.</p>
          </div>
        </article>

        <article className="process-step">
          <header><b>03</b><i /><h3>O relacionamento<br />é classificado</h3><p>Cada paciente é classificado<br />de acordo com o seu ciclo.</p></header>
          <div className="process-card process-card-status">
            <div className="process-status-row process-status-active"><span><Check /></span><div><strong>Ativo</strong><p>Dentro do ciclo esperado.</p></div></div>
            <div className="process-status-row process-status-risk"><span><TriangleAlert /></span><div><strong>Em risco</strong><p>Fora do ciclo. Atenção agora.</p></div></div>
            <div className="process-status-row process-status-lost"><span><X /></span><div><strong>Perdido</strong><p>Janela de recuperação encerrada.</p></div></div>
          </div>
        </article>

        <article className="process-step">
          <header><b>04</b><i /><h3>A prioridade aparece</h3><p>A clínica recebe a ordem de<br />quem merece atenção primeiro.</p></header>
          <div className="process-card process-card-priority">
            <div className="process-priority-title"><Target aria-hidden="true" /><strong>Fila de prioridades</strong></div>
            <ol><li><b>01</b><span>atenção primeiro</span></li><li><b>02</b><span>próximo</span></li><li><b>03</b><span>depois</span></li></ol>
            <p>Comece por aqui.</p>
          </div>
        </article>
      </div>

      <div className="process-conclusion"><i /><p>Menos interpretação manual.<br /><strong>Mais clareza para agir.</strong></p><i /></div>
    </section>
  );
}
