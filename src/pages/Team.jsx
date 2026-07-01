import { CTA, PageHero } from "../components/Sections";
import { SEO } from "../components/SEO";
import { TeamSection } from "./shared/TeamSection";

export function Team() {
  return <><SEO title="Leadership & Stakeholders" description="Founder and stakeholder profiles for ZMH USA Corp." /><PageHero eyebrow="Team" title="Founder and stakeholder profiles" text="Meet the people structure behind ZMH USA Corp. and the operating responsibilities that support client delivery." image={false} /><TeamSection /><CTA /></>;
}
