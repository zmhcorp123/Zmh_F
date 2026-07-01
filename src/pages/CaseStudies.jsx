import { caseStudies } from "../data/siteData";
import { PageHero } from "../components/Sections";
import { SEO } from "../components/SEO";

export function CaseStudies() {
  return <><SEO title="Case Studies" /><PageHero eyebrow="Proof" title="Operational outcomes by service area" text="Selected examples of how disciplined remote operations support can improve field-service workflows." /><section><div className="case-timeline">{caseStudies.map((item) => <article key={item.title}><span>{item.metric}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section></>;
}
