import { useState } from "react";
import { services, testimonials, faqs } from "../data/siteData";
import { Button } from "../components/Button";
import { Icon } from "../components/icons";
import { SEO } from "../components/SEO";
import { contactApi } from "../services/api";
import { navigate } from "../utils/router";

function OperationsDashboard() {
  const activities = ["New call received", "Job dispatched", "Invoice generated", "Payment received"];

  return (
    <div className="saas-dashboard simple-dashboard reveal-lite reveal-hero-panel">
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
    </div>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return <div className="saas-section-title reveal-lite"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
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
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");

  const submitHomeContact = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();
    setContactLoading(true);
    setContactError("");
    try {
      await contactApi.send({
        name: "Home page visitor",
        email,
        message,
        company: "",
        phone: "",
      });
      formElement.reset();
      window.alert("An admin will contact you soon.");
      navigate("/");
    } catch (error) {
      setContactError(error.message || "Could not send your message. Please try again.");
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <>
      <SEO title="Home" description="Remote operations support for companies." />
      <section className="saas-hero home-hero">
        <div className="mesh-bg" aria-hidden="true" />
        <div className="hero-copy reveal-lite reveal-hero-copy">
          <span className="hero-badge"><Icon name="shield" size={15} /> Trusted Remote Operations Partner</span>
          <h1>Remote Operations Department for <span>Your companies</span> </h1>
          <p>Helping HVAC, plumbing, roofing, electrical and home service businesses grow with professional call handling, dispatch, CRM, support, and billing operations.</p>
          <div className="hero-actions"><Button to="/book-meeting" icon="calendar">Book Free Operations Audit</Button><Button to="/services" variant="secondary">Explore Services</Button></div>
          <div className="trust-strip">{[["100+", "Clients", "users"], ["98%+", "Satisfaction", "check"], ["24/7", "Operations", "headset"], ["Trusted", "Remote Team", "shield"]].map(([value, label, icon]) => <div key={label}><b className="trust-icon"><Icon name={icon} size={22} /></b><strong>{value}</strong><span>{label}</span></div>)}</div>
        </div>
        <OperationsDashboard />
      </section>
      <HeroWaveTransition />

      <section className="saas-services">
        <SectionTitle eyebrow="What we do" title="Complete Remote Operations Support for Home Service Businesses" />
        <div className="service-card-grid">{services.slice(0, 8).map((item) => <article className="saas-card service-card reveal-lite" key={item.slug}><div className="card-icon"><Icon name={item.icon} /></div><h3>{item.name}</h3><p>{item.summary}</p><button className="learn" onClick={() => navigate("/services/" + item.slug)}>Learn More <Icon name="arrow" size={15} /></button></article>)}</div>
      </section>

      <section className="saas-band">
        <SectionTitle eyebrow="Why choose us" title="Simple workflows, clear ownership, and reliable remote coverage." />
        <div className="comparison-grid">
          <div className="comparison-card before reveal-lite"><h3>Before</h3>{["Missed calls", "Slow dispatch", "Messy CRM notes", "Billing follow-up gaps"].map((item) => <span key={item}>{item}</span>)}</div>
          <div className="comparison-card after reveal-lite"><h3>After</h3>{["24/7 coverage", "Clear handoffs", "Clean reporting", "Reliable invoice workflows"].map((item) => <span key={item}>{item}</span>)}</div>
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="Testimonials" title="Operators trust repeatable systems" />
        <div className="testimonial-grid">{testimonials.map((item) => <article className="quote reveal-lite" key={item.company}><div className="stars">5.0 rating</div><p>"{item.quote}"</p><strong>{item.name}</strong><span>{item.company}</span></article>)}</div>
      </section>

      <section className="faq-contact-grid">
        <div>
          <SectionTitle eyebrow="FAQ" title="Common questions before your audit" />
          <div className="accordion">{faqs.slice(0, 5).map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
        </div>
        <form className="contact-panel reveal-lite" onSubmit={submitHomeContact}>
          <span className="eyebrow">Contact</span><h3>Ready to build your remote operations department?</h3><input name="email" placeholder="Work email" type="email" required /><textarea name="message" placeholder="Tell us about your operations bottleneck" required />{contactError && <div className="form-error">{contactError}</div>}<Button type="submit" icon="arrow">{contactLoading ? "Sending Inquiry..." : "Send Inquiry"}</Button>
        </form>
      </section>
    </>
  );
}
