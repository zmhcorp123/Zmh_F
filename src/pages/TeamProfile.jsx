import { useEffect, useState } from "react";
import { CTA, PageHero, SectionHeader } from "../components/Sections";
import { Icon } from "../components/icons";
import { SEO } from "../components/SEO";
import { teamProfiles } from "../data/siteData";
import { settingsApi } from "../services/api";
import { NotFound } from "./NotFound";

function normalizeSlug(value = "") {
  return String(value).trim().toLowerCase();
}

function SkeletonLine({ className = "" }) {
  return <span className={"skeleton-line " + className} />;
}

function TeamProfileSkeleton() {
  return (
    <section className="page-hero route-page-skeleton" aria-label="Loading team profile">
      <div className="hero-copy">
        <SkeletonLine className="badge" />
        <SkeletonLine className="title" />
        <SkeletonLine className="title short" />
        <SkeletonLine className="text" />
        <SkeletonLine className="text mid" />
      </div>
      <div className="hero-visual page-hero-dashboard">
        <SkeletonLine className="panel" />
        <div className="route-panel-grid">{Array.from({ length: 6 }).map((_, index) => <SkeletonLine key={index} />)}</div>
      </div>
    </section>
  );
}

export function TeamProfile({ profile, slug }) {
  const routeSlug = normalizeSlug(slug);
  const staticProfile = profile || teamProfiles.find((item) => normalizeSlug(item.slug) === routeSlug) || null;
  const [liveProfile, setLiveProfile] = useState(null);
  const [loadedSlug, setLoadedSlug] = useState("");

  useEffect(() => {
    let active = true;
    settingsApi.teamProfiles().then((data) => {
      const found = Array.isArray(data.teamProfiles) ? data.teamProfiles.find((item) => normalizeSlug(item.slug) === routeSlug) : null;
      if (active) setLiveProfile(found || null);
    }).catch(() => {}).finally(() => {
      if (active) setLoadedSlug(routeSlug);
    });
    return () => { active = false; };
  }, [routeSlug]);

  const safeProfile = loadedSlug === routeSlug ? liveProfile || staticProfile : staticProfile;
  const loading = loadedSlug !== routeSlug && !staticProfile;
  if (loading && !safeProfile) return <TeamProfileSkeleton />;
  if (!safeProfile) return <NotFound />;
  return <><SEO title={safeProfile.name} description={safeProfile.summary} /><PageHero eyebrow={safeProfile.role} title={safeProfile.name} text={safeProfile.summary} image={false} secondary={{ label: "Back to Team", to: "/team" }} /><section className="split team-profile-detail"><div><SectionHeader eyebrow="Profile" title="Professional background" /><p className="lead">{safeProfile.bio}</p><p><strong>Location:</strong> {safeProfile.location}</p><a className="profile-linkedin" href={safeProfile.linkedin || "https://www.linkedin.com/"} target="_blank" rel="noreferrer"><Icon name="linkedin" size={20} /> LinkedIn profile</a></div><div><SectionHeader eyebrow="Focus Areas" title="Where this profile contributes" /><div className="check-list">{(safeProfile.focus || []).map((item) => <span key={item}>{item}</span>)}</div></div></section><CTA /></>;
}
