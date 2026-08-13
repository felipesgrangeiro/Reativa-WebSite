import { Heart, LineChart, PhoneCall, Users } from "lucide-react";

const PERSONAS = [
  {
    key: "owner",
    icon: Users,
    role: "Dono da clínica",
    question: <>Quanto dinheiro<br />estou deixando<br />de recuperar?</>,
  },
  {
    key: "reception",
    icon: PhoneCall,
    role: "Recepção",
    question: <>Quem eu<br />chamo<br />agora?</>,
  },
  {
    key: "manager",
    icon: LineChart,
    role: "Gestor",
    question: <>O que está<br />funcionando?</>,
  },
  {
    key: "patient",
    icon: Heart,
    role: "Paciente",
    question: <>Isso é cuidado<br />ou é<br />cobrança?</>,
  },
] as const;

export default function PersonasStripSection() {
  return (
    <section className="personas-strip" aria-label="Reativa+ para cada perfil">
      {PERSONAS.map(({ key, icon: Icon, role, question }) => (
        <article className={`persona-strip-card persona-strip-${key}`} key={key}>
          <div className="persona-strip-role"><span><Icon aria-hidden="true" /></span><strong>{role}</strong></div>
          <h2>{question}</h2>
          <a href="#diagnostico">Ver mais <b aria-hidden="true">→</b></a>
        </article>
      ))}
    </section>
  );
}
