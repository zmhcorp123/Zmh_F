import { motion } from "framer-motion";
import { services, testimonials, faqs } from "../data/siteData";
import { Button } from "../components/Button";
import { Icon } from "../components/icons";
import { SEO } from "../components/SEO";
import { navigate } from "../utils/router";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.55, ease: "easeOut" },
};

function OperationsDashboard() {
  const activities = ["New call received", "Job dispatched", "Invoice generated", "Payment received"];

  return (
    <motion.div className="saas-dashboard simple-dashboard" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
      <div className="dash-topline"><span className="live-dot" /> <div><strong>Live Operations Overview</strong><small>All systems running smoothly</small></div><button>Today</button></div>
      <div className="ops-metrics">
        {[["Calls", "128", "phone"], ["Dispatch", "64", "route"], ["CRM Updates", "92", "database"], ["Billing", "36", "receipt"]].map(([label, value, icon]) => (
          <div key={label}><span>{label}</span><strong>{value}</strong><small>Active</small><b><Icon name={icon} size={20} /></b></div>
        ))}
      </div>
      <div className="dash-bottom">
        <div className="performance-card"><strong>Operations Performance</strong><div className="line-graph">{Array.from({ length: 12 }).map((_, index) => <span key={index} style={{ height: `${42 + Math.sin(index / 1.35) * 16 + index * 1.4}%` }} />)}</div></div>
        <div className="activity-card"><strong>Recent Activities</strong>{activities.map((item, index) => <p key={item}><span className="live-dot small" />{item}<small>{(index + 1) * 4} min ago</small></p>)}</div>
      </div>
    </motion.div>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return <motion.div className="saas-section-title" {...fadeUp}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</motion.div>;
}

function HeroWaveTransition() {
  return (
    <div className="hero-wave-transition" aria-hidden="true">
      <svg viewBox="0 0 1440 150" preserveAspectRatio="none" focusable="false">
        <path className="wave-white" d="M0,35 C180,70 345,44 520,36 C720,26 850,78 1040,74 C1220,70 1330,43 1440,17 L1440,150 L0,150 Z" />
        <path className="wave-teal" d="M0,35 C180,70 345,44 520,36 C720,26 850,78 1040,74 C1220,70 1330,43 1440,17" />
        <path className="wave-blue" d="M0,48 C220,80 410,50 610,48 C810,46 950,90 1160,82 C1300,77 1380,45 1440,29" />
      </svg>
    </div>
  );
}

export function Home() {
  return (
    <>
      <SEO title="Home" description="Remote operations support for home service companies." />
      <section className="saas-hero home-hero">
        <div className="mesh-bg" aria-hidden="true" />
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <span className="hero-badge"><Icon name="shield" size={15} /> Trusted Remote Operations Partner</span>
          <h1>Your Remote Operations Department for <span>Home Service</span> Companies</h1>
          <p>Helping HVAC, plumbing, roofing, electrical and home service businesses grow with professional call handling, dispatch, CRM, support, and billing operations.</p>
          <div className="hero-actions"><Button to="/book-meeting" icon="calendar">Book Free Operations Audit</Button><Button to="/services" variant="secondary">Explore Services</Button></div>
          <div className="trust-strip">{[["100+", "Clients"], ["98%+", "Satisfaction"], ["24/7", "Operations"], ["Trusted", "Remote Team"]].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
        </motion.div>
        <OperationsDashboard />
      </section>
      <HeroWaveTransition />

      <section className="saas-services">
        <SectionTitle eyebrow="What we do" title="Complete Remote Operations Support for Home Service Businesses" />
        <div className="service-card-grid">{services.slice(0, 8).map((item) => <motion.article className="saas-card service-card" key={item.slug} {...fadeUp}><div className="card-icon"><Icon name={item.icon} /></div><h3>{item.name}</h3><p>{item.summary}</p><button className="learn" onClick={() => navigate("/services/" + item.slug)}>Learn More <Icon name="arrow" size={15} /></button></motion.article>)}</div>
      </section>

      <section className="saas-band">
        <SectionTitle eyebrow="Why choose us" title="Simple workflows, clear ownership, and reliable remote coverage." />
        <div className="comparison-grid">
          <motion.div className="comparison-card before" {...fadeUp}><h3>Before</h3>{["Missed calls", "Slow dispatch", "Messy CRM notes", "Billing follow-up gaps"].map((item) => <span key={item}>{item}</span>)}</motion.div>
          <motion.div className="comparison-card after" {...fadeUp}><h3>After</h3>{["24/7 coverage", "Clear handoffs", "Clean reporting", "Reliable invoice workflows"].map((item) => <span key={item}>{item}</span>)}</motion.div>
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="Testimonials" title="Operators trust repeatable systems" />
        <div className="testimonial-grid">{testimonials.map((item) => <motion.article className="quote" key={item.company} {...fadeUp}><div className="stars">5.0 rating</div><p>"{item.quote}"</p><strong>{item.name}</strong><span>{item.company}</span></motion.article>)}</div>
      </section>

      <section className="faq-contact-grid">
        <div>
          <SectionTitle eyebrow="FAQ" title="Common questions before your audit" />
          <div className="accordion">{faqs.slice(0, 5).map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
        </div>
        <motion.form className="contact-panel" {...fadeUp} onSubmit={(event) => { event.preventDefault(); navigate("/contact"); }}>
          <span className="eyebrow">Contact</span><h3>Ready to build your remote operations department?</h3><input placeholder="Work email" type="email" required /><textarea placeholder="Tell us about your operations bottleneck" /><Button type="submit" icon="arrow">Start Conversation</Button>
        </motion.form>
      </section>
    </>
  );
}
