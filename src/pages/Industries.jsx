import { industries } from "../data/siteData";
import { Card, CTA, PageHero } from "../components/Sections";
import { SEO } from "../components/SEO";
import { navigate } from "../utils/router";

export function Industries() {
  return <><SEO title="Industries" /><PageHero eyebrow="Industries" title="Remote support for field-service teams with real operational pressure" text="Every industry page includes problems, solutions, benefits, services, and a practical case-study model." image={false} /><section><div className="grid three industry-card-grid">{industries.map((item) => <Card key={item.slug} icon={item.icon} title={item.name} text={item.problems[0]}><button className="learn" onClick={() => navigate("/industries/" + item.slug)}>View industry</button></Card>)}</div></section><CTA /></>;
}
