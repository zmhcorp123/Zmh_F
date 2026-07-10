import { Button } from "./Button";
import { Icon } from "./icons";

export function PageHero({ eyebrow, title, text, primary = "Book a Free Operations Audit", secondary, image = true, visual, className = "" }) {
  const metrics = [
    ["Calls", "128", "Active"],
    ["Dispatch", "64", "Live"],
    ["CRM", "92", "Today"],
    ["Billing", "36", "Pending"]
  ];

  return (
    <section className={"page-hero " + className}>
      <div className="hero-copy reveal">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
        <div className="hero-actions"><Button to="/book-meeting" icon="calendar">{primary}</Button>{secondary && <Button to={secondary.to} variant="secondary">{secondary.label}</Button>}</div>
        <div className="hero-trust-row" aria-label="Company performance highlights">
          <span><strong>100+</strong> Clients</span>
          <span><strong>97.8%</strong> Satisfaction</span>
          <span><strong>24/7</strong> Operations</span>
        </div>
      </div>
      {visual}
      {image && (
        <div className="hero-visual page-hero-dashboard reveal delay" aria-label="Live operations dashboard preview">
          <div className="hero-dashboard-top">
            <div>
              <span className="live-dot" />
              <strong>Live Operations Overview</strong>
              <small>All systems running smoothly</small>
            </div>
            <span className="dashboard-filter">Today</span>
          </div>
          <div className="hero-dashboard-grid">
            <div className="hero-kpi wide">
              <span>Client Satisfaction</span>
              <strong>97.8%</strong>
              <small>+2.4% this month</small>
              <div className="hero-chart-line" />
            </div>
            <div className="hero-kpi">
              <span>Active Operations</span>
              <strong>4</strong>
              <small>Live now</small>
            </div>
            {metrics.map(([label, value, status]) => (
              <div className="hero-kpi compact" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <small>{status}</small>
              </div>
            ))}
            <div className="hero-performance">
              <span>Operations Performance</span>
              <div className="hero-bars">
                {[48, 68, 78, 62, 84, 70, 91].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
              </div>
            </div>
            <div className="hero-activity">
              <span>Recent Activities</span>
              {["New call received", "Job dispatched", "Invoice generated", "Payment received"].map((activity, index) => (
                <small key={activity}><b />{activity}<em>{index * 4 + 2}m</em></small>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function SectionHeader({ eyebrow, title, text }) {
  return <div className="section-header"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

export function Card({ icon, title, text, children }) {
  return <article className="card saas-card reveal">{icon && <div className="card-icon"><Icon name={icon} /></div>}<h3>{title}</h3>{text && <p>{text}</p>}{children}</article>;
}

export function CTA() {
  return <section className="cta saas-cta"><span className="eyebrow">Ready when you are</span><h2>Build your remote operations department without slowing down your field team.</h2><p>Start with a free operations audit and receive a practical roadmap for calls, dispatch, CRM, reporting, and admin coverage.</p><div className="hero-actions"><Button to="/book-meeting" icon="calendar">Book a Free Operations Audit</Button><Button to="/services" variant="secondary">Explore Services</Button></div></section>;
}
