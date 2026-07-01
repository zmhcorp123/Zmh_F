import { packages } from "../data/siteData";
import { Card, CTA, PageHero } from "../components/Sections";
import { SEO } from "../components/SEO";
import { navigate } from "../utils/router";
import { useEffect, useState } from "react";
import { settingsApi } from "../services/api";

export function Pricing() {
  const [packageRows, setPackageRows] = useState(packages);

  useEffect(() => {
    let active = true;
    settingsApi.packages().then((data) => {
      if (active && Array.isArray(data.packages)) setPackageRows(data.packages);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  return <><SEO title="Pricing" /><PageHero eyebrow="Packages" title="Flexible operations support packages" text="Choose the package that matches your call volume, scheduling complexity, and operational support needs." /><section><div className="grid four">{packageRows.map((item) => <Card key={item.slug} title={item.name} text={item.bestFor}><strong className="price">{item.price}</strong><ul>{item.features.map((f) => <li key={f}>{f}</li>)}</ul><button className="learn" onClick={() => navigate("/pricing/" + item.slug)}>Package details</button></Card>)}</div></section><CTA /></>;
}
