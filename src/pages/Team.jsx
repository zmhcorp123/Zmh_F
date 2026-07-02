import { Card, CTA, PageHero, SectionHeader } from "../components/Sections";
import { SEO } from "../components/SEO";
import { TeamSection } from "./shared/TeamSection";

export function Team() {
  return <><SEO title="Leadership & Stakeholders" description="Founder and stakeholder profiles for ZMH USA Corp." /><PageHero eyebrow="Team" title="Founder and stakeholder profiles" text="Meet the people structure behind ZMH USA Corp. and the operating responsibilities that support client delivery." image={false} /><section className="split"><div><SectionHeader eyebrow="Hybrid Operating Model" title="The best of local oversight and global execution" /><p>Our strength lies in combining the best of two worlds: U.S. client oversight with a disciplined Bangladesh operations center.</p></div><div className="grid two"><Card title="United States Presence" text="Our U.S. representative provides local business oversight, client relationships, and strategic support, ensuring accountability and clear communication for every client." /><Card title="Bangladesh Operations Center" text="Our Bangladesh operations team manages daily workflows, customer interactions, scheduling, dispatch coordination, CRM updates, and administrative processes using standardized operating procedures and modern cloud-based systems." /></div></section><TeamSection /><CTA /></>;
}
