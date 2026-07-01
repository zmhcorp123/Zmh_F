import { PageHero } from "../components/Sections";
import { SEO } from "../components/SEO";

export function Legal({ type }) {
  const title = type || "Privacy Policy";
  return <><SEO title={title} /><PageHero eyebrow="Legal" title={title} text="Current policy information for website visitors and client portal users." image={false} /><section className="legal"><h2>{title}</h2><p>ZMH USA Corp. uses submitted information to respond to inquiries, manage client accounts, process booking requests, and provide operational support services.</p><p>Last updated: June 30, 2026.</p></section></>;
}
