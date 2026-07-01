import { Card, PageHero } from "../components/Sections";
import { SEO } from "../components/SEO";

export function Careers() {
  return <><SEO title="Careers" /><PageHero eyebrow="Careers" title="Join a team building better remote operations" text="Explore roles focused on reliable client support and disciplined operations delivery." /><section><div className="grid three">{["Operations Specialist", "Client Success Manager", "Quality Analyst"].map((job) => <Card key={job} title={job} text="Remote-friendly role supporting home service clients with documented processes and quality standards." />)}</div></section></>;
}
