import { CTA, PageHero, SectionHeader } from "../components/Sections";
import { SEO } from "../components/SEO";
import { useEffect, useState } from "react";
import { settingsApi } from "../services/api";

export function PackageDetail({ plan }) {
  const [livePlan, setLivePlan] = useState(plan);

  useEffect(() => {
    let active = true;
    settingsApi.packages().then((data) => {
      const match = Array.isArray(data.packages) ? data.packages.find((item) => item.slug === plan.slug) : null;
      if (active && match) setLivePlan(match);
    }).catch(() => {});
    return () => { active = false; };
  }, [plan.slug]);

  return <><SEO title={livePlan.name + " Package"} /><PageHero eyebrow="Package" title={livePlan.name + " operations package"} text={livePlan.bestFor} secondary={{ label: "Compare Packages", to: "/pricing" }} /><section className="split"><div><SectionHeader eyebrow="Included" title="Core features" /><div className="check-list">{livePlan.features.map((item) => <span key={item}>{item}</span>)}</div></div><div className="premium-panel"><h3>Monthly pricing</h3><strong className="price">{livePlan.price}</strong><p>Package pricing and included items are managed from the admin dashboard.</p></div></section><section><SectionHeader eyebrow="Add-ons" title="Expand when ready" /><div className="pills">{["After-hours", "Dedicated supervisor", "Advanced reports", "CRM integration", "SOP buildout"].map((item) => <span key={item}>{item}</span>)}</div></section><CTA /></>;
}
