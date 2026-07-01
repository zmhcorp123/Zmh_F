import { packages } from "../data/siteData";
import { Card, CTA, PageHero } from "../components/Sections";
import { SEO } from "../components/SEO";
import { navigate } from "../utils/router";

export function Pricing() {
  return <><SEO title="Pricing" /><PageHero eyebrow="Packages" title="Flexible operations support packages" text="Choose the package that matches your call volume, scheduling complexity, and operational support needs." /><section><div className="grid four">{packages.map((item) => <Card key={item.slug} title={item.name} text={item.bestFor}><strong className="price">{item.price}</strong><ul>{item.features.map((f) => <li key={f}>{f}</li>)}</ul><button className="learn" onClick={() => navigate("/pricing/" + item.slug)}>Package details</button></Card>)}</div></section><CTA /></>;
}
