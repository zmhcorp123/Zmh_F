import { faqs } from "../data/siteData";
import { PageHero } from "../components/Sections";
import { SEO } from "../components/SEO";

export function FAQ() {
  return <><SEO title="FAQ" /><PageHero eyebrow="FAQ" title="Answers before your operations audit" text="Fast answers about coverage, CRMs, dispatch, security, SOPs, and scaling." image={false} /><section><div className="accordion">{faqs.map(([q, a]) => <details key={q} open={q.includes("accent")}><summary>{q}</summary><p>{a}</p></details>)}</div></section></>;
}
