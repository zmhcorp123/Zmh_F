import { blogPosts } from "../data/siteData";
import { Card, PageHero } from "../components/Sections";
import { SEO } from "../components/SEO";

export function Blog() {
  return <><SEO title="Blog" /><PageHero eyebrow="Resources" title="Operations insights for home service leaders" text="Articles, playbooks, and growth guides for better service operations." /><section><div className="grid two">{blogPosts.map((post) => <Card key={post} title={post} text="Practical guidance for improving calls, scheduling, CRM hygiene, and customer follow-up." />)}</div></section></>;
}
