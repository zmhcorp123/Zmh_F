import { CTA, PageHero, SectionHeader } from "../components/Sections";
import { SEO } from "../components/SEO";

export function PackageDetail({ plan }) {
  return <><SEO title={plan.name + " Package"} /><PageHero eyebrow="Package" title={plan.name + " operations package"} text={plan.bestFor} secondary={{ label: "Compare Packages", to: "/pricing" }} /><section className="split"><div><SectionHeader eyebrow="Included" title="Core features" /><div className="check-list">{plan.features.map((item) => <span key={item}>{item}</span>)}</div></div><div className="premium-panel"><h3>Monthly pricing</h3><strong className="price">{plan.price}</strong><p>Connect backend quoting later for dynamic prices, add-ons, and contract terms.</p></div></section><section><SectionHeader eyebrow="Add-ons" title="Expand when ready" /><div className="pills">{["After-hours", "Dedicated supervisor", "Advanced reports", "CRM integration", "SOP buildout"].map((item) => <span key={item}>{item}</span>)}</div></section><CTA /></>;
}
