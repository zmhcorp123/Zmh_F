import { caseStudies } from "../data/siteData";
import { CTA, PageHero, SectionHeader } from "../components/Sections";
import { SEO } from "../components/SEO";

export function CaseStudies() {
  return <><SEO title="Case Studies" /><PageHero eyebrow="Proof" title="Operational outcomes by service area" text="Selected examples of how disciplined remote operations support can improve field-service workflows." /><section><SectionHeader eyebrow="Case Studies" title="Built around the work ZMH supports every day" text="Each example maps to the website's core services: call answering, dispatch, scheduling, CRM management, customer support, billing, reporting, and after-hours coverage." /><div className="case-timeline case-study-grid">{caseStudies.map((item) => <article className="case-card" key={item.title}><span>{item.metric}</span><h3>{item.title}</h3><p>{item.body}</p><div className="case-meta"><strong>{item.industry}</strong><small>{item.services.join(" | ")}</small></div><p className="case-outcome">{item.outcome}</p></article>)}</div></section><CTA /></>;
}
