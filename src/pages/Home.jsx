import { services, industries } from "../data/siteData";
import { Button } from "../components/Button";
import { Card, CTA, SectionHeader } from "../components/Sections";
import { SEO } from "../components/SEO";
import { navigate } from "../utils/router";

export function Home() {
  return (
    <>
      <SEO title="Home" description="Remote operations support for home service companies." />
      <section className="home-hero">
        <div className="hero-copy reveal">
          <span className="eyebrow">ZMH USA Corp.</span>
          <h1>Your Remote Operations Department for Home Service Companies</h1>
          <p>Helping HVAC, Plumbing, Roofing, Electrical and Home Service Businesses grow through professional remote operations support.</p>
          <div className="hero-actions"><Button to="/book-service" icon="calendar">Book Free Operations Audit</Button><Button to="/services" variant="secondary">Explore Services</Button></div>
          <div className="stats">{[["Calls", "Live answering"], ["Scheduling", "Calendar coordination"], ["Dispatch", "Clean handoffs"], ["CRM", "Accurate records"]].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
        </div>
        <div className="hero-visual reveal delay"><div className="ops-card"><span>Live Ops Board</span><strong>Ops</strong><small>Workflow visibility</small></div><div className="glass-grid">{["Calls", "Dispatch", "CRM", "Billing"].map((item) => <div key={item}>{item}<b>Active</b></div>)}</div></div>
      </section>
      <section className="logos"><span>Built for service operators</span>{["HVAC", "Plumbing", "Roofing", "Electrical", "Property Maintenance"].map((item) => <strong key={item}>{item}</strong>)}</section>
      <section><SectionHeader eyebrow="Services" title="The back office your crews wish they had" text="Modular support for the operational work that happens before, during, and after each job." /><div className="grid three">{services.slice(0, 6).map((item) => <Card key={item.slug} icon={item.icon} title={item.name} text={item.summary}><button className="learn" onClick={() => navigate("/services/" + item.slug)}>Learn more</button></Card>)}</div></section>
      <section><SectionHeader eyebrow="Industries" title="Built around home service realities" /><div className="pills">{industries.map((item) => <button key={item.slug} onClick={() => navigate("/industries/" + item.slug)}>{item.name}</button>)}</div></section>
      <CTA />
    </>
  );
}
