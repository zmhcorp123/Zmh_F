import { packages } from "../data/siteData";
import { CTA, PageHero } from "../components/Sections";
import { SEO } from "../components/SEO";
import { navigate } from "../utils/router";
import { useEffect, useState } from "react";
import { settingsApi } from "../services/api";

function featureList(features) {
  if (Array.isArray(features)) return features;
  if (typeof features === "string") return features.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
  return [];
}

function monthlyPrice(price) {
  const value = String(price || "Custom").trim();
  if (/custom|quote|month|monthly/i.test(value)) return value;
  return `${value} / month`;
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

  return <><SEO title="Pricing" /><PageHero eyebrow="Monthly Packages" title="Monthly operations support packages" text="Choose the monthly package that matches your call volume, scheduling complexity, and operational support needs." /><section className="saas-page-section pricing-page-section"><div className="monthly-pricing-note">All packages are managed as monthly plans by the admin team.</div><div className="pricing-grid">{packageRows.filter((item) => item.status !== "inactive").sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0)).map((item) => {
    const features = featureList(item.features);
    return <article className={"pricing-card reveal " + (item.recommended ? "featured" : "")} key={item.slug}>
      <div className="pricing-card-head">
        <span className="pricing-badge">{item.highlightBadge || (item.recommended ? "Recommended" : "Monthly Package")}</span>
        <h3>{item.name}</h3>
        <p>{item.description || item.bestFor}</p>
      </div>
      <strong className="price">{monthlyPrice(item.price)}</strong>
      <ul>{features.slice(0, 7).map((f) => <li key={f}>{f}</li>)}</ul>
      {features.length > 7 && <small className="feature-count">+{features.length - 7} more included</small>}
      <button className="learn" onClick={() => navigate(item.buttonLink || "/pricing/" + item.slug)}>{item.buttonText || "Package details"}</button>
    </article>;
  })}</div></section><CTA /></>;
}
