import { services } from "../data/siteData";
import { Card, CTA, PageHero } from "../components/Sections";
import { SEO } from "../components/SEO";
import { navigate } from "../utils/router";

export function Services() {
  return <><SEO title="Services" /><PageHero eyebrow="Services" title="Services that keep your business moving" text="From responsive operations support to intelligent automation and software engineering, choose the expertise your team needs." secondary={{ label: "View Pricing", to: "/pricing" }} image={false} /><section className="saas-page-section"><div className="grid three service-card-grid">{services.map((item) => <Card key={item.slug} icon={item.icon} title={item.name} text={item.summary}><button className="learn" onClick={() => navigate("/services/" + item.slug)}>Open service</button></Card>)}</div></section><CTA /></>;
}
