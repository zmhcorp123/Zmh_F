import { CTA, PageHero } from "../components/Sections";
import { SEO } from "../components/SEO";
import { workflowSteps } from "./shared/pageConstants";

export function HowItWorks() {
  return <><SEO title="How It Works" /><PageHero eyebrow="Workflow" title="A clean operating rhythm from first call to follow-up" text="The ZMH model turns scattered requests into documented, trackable work." /><section><ol className="timeline large">{workflowSteps.map((item, index) => <li key={item}>{item}{index < workflowSteps.length - 1 && <span>Next</span>}</li>)}</ol></section><CTA /></>;
}
