import { faqs } from "../data/siteData";
import { CTA, PageHero, SectionHeader } from "../components/Sections";
import { SEO } from "../components/SEO";

export function ServiceDetail({ service }) {
  return <><SEO title={service.name} /><PageHero eyebrow="Service" title={service.name + " for home service operators"} text={service.summary} secondary={{ label: "All Services", to: "/services" }} /><section className="split"><div><SectionHeader eyebrow="Benefits" title="Operational outcomes" /><div className="check-list">{service.benefits.map((item) => <span key={item}>{item}</span>)}</div></div><div><SectionHeader eyebrow="Features" title="What is included" /><div className="check-list">{service.features.map((item) => <span key={item}>{item}</span>)}</div></div></section><section><SectionHeader eyebrow="Workflow" title="From intake to clean handoff" /><ol className="timeline"><li>Define scripts and SOPs</li><li>Answer or process the request</li><li>Document in CRM</li><li>Escalate if needed</li><li>Report outcomes</li></ol></section><section><SectionHeader eyebrow="FAQ" title={"Questions about " + service.name} /><div className="accordion">{faqs.slice(0, 4).map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section><CTA /></>;
}
