import { Card, CTA, SectionHeader } from "../components/Sections";
import { SEO } from "../components/SEO";
import { DetailHero } from "../components/DetailHero";

export function IndustryDetail({ industry }) {
  const description = `ZMH helps ${industry.name} teams protect missed revenue, speed up communication, and keep jobs moving.`;
  return <><SEO title={industry.name} /><DetailHero type="industry" item={industry} description={description} /><section className="split"><div><SectionHeader eyebrow="Problems" title="Where teams lose time" /><div className="check-list warn">{industry.problems.map((item) => <span key={item}>{item}</span>)}</div></div><div><SectionHeader eyebrow="How ZMH Solves It" title="Structured remote support" /><div className="check-list">{industry.solutions.map((item) => <span key={item}>{item}</span>)}</div></div></section><section><SectionHeader eyebrow="Benefits" title="What improves" /><div className="grid four">{industry.benefits.map((item) => <Card key={item} title={item} text="Designed for measurable operational lift." />)}</div></section><section><SectionHeader eyebrow="Case Study" title={industry.name + " operations example"} /><div className="premium-panel"><h3>Remote operations pilot</h3><p>ZMH documents call types, routes urgent requests, keeps job records clean, and creates reporting that leadership can act on.</p></div></section><CTA /></>;
}
