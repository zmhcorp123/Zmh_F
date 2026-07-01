import { Button } from "./Button";
import { Icon } from "./icons";

export function PageHero({ eyebrow, title, text, primary = "Book a Free Operations Audit", secondary, image = true }) {
  return (
    <section className="page-hero">
      <div className="hero-copy reveal">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
        <div className="hero-actions"><Button to="/book-meeting" icon="calendar">{primary}</Button>{secondary && <Button to={secondary.to} variant="secondary">{secondary.label}</Button>}</div>
      </div>
      {image && <div className="hero-visual reveal delay"><div className="ops-card"><span>Live Ops Board</span><strong>Ops</strong><small>Workflow visibility</small></div><div className="glass-grid">{["Calls", "Dispatch", "CRM", "Billing"].map((item) => <div key={item}>{item}<b>Active</b></div>)}</div></div>}
    </section>
  );
}

export function SectionHeader({ eyebrow, title, text }) {
  return <div className="section-header"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

export function Card({ icon, title, text, children }) {
  return <article className="card reveal">{icon && <div className="card-icon"><Icon name={icon} /></div>}<h3>{title}</h3><p>{text}</p>{children}</article>;
}

export function CTA() {
  return <section className="cta"><span className="eyebrow">Ready when you are</span><h2>Build your remote operations department without slowing down your field team.</h2><p>Start with a free operations audit and receive a practical roadmap for calls, dispatch, CRM, reporting, and admin coverage.</p><Button to="/book-meeting" icon="calendar">Book a Free Operations Audit</Button></section>;
}
