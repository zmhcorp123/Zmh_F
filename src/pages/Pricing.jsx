import { packages } from "../data/siteData";
import { Card, CTA, PageHero } from "../components/Sections";
import { SEO } from "../components/SEO";
import { navigate } from "../utils/router";
import { useEffect, useState } from "react";
import { settingsApi } from "../services/api";

function featureList(features) {
  if (Array.isArray(features)) return features;
  if (typeof features === "string") return features.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
  return [];
}

export function Pricing() {
  const [packageRows, setPackageRows] = useState(packages);

  useEffect(() => {
    let active = true;
    settingsApi.packages().then((data) => {
      if (active && Array.isArray(data.packages)) setPackageRows(data.packages);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  return <><SEO title="Pricing" /><PageHero eyebrow="Packages" title="Flexible operations support packages" text="Choose the package that matches your call volume, scheduling complexity, and operational support needs." /><section><div className="grid four">{packageRows.filter((item) => item.status !== "inactive").sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0)).map((item) => <Card key={item.slug} title={item.name} text={item.description || item.bestFor}>{(item.highlightBadge || item.recommended) && <span className="status-pill">{item.highlightBadge || "Recommended"}</span>}<strong className="price">{item.price}</strong><ul>{featureList(item.features).map((f) => <li key={f}>{f}</li>)}</ul><button className="learn" onClick={() => navigate(item.buttonLink || "/pricing/" + item.slug)}>{item.buttonText || "Package details"}</button></Card>)}</div></section><CTA /></>;
}
