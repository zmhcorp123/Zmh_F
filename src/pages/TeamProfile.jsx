import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { CTA, PageHero, SectionHeader } from "../components/Sections";
import { Icon } from "../components/icons";
import { SEO } from "../components/SEO";
import { settingsApi } from "../services/api";
import { NotFound } from "./NotFound";

function normalizeSlug(value = "") {
  return String(value).trim().toLowerCase();
}

function TeamHeroPortrait({ profile }) {
  if (!profile?.image) return null;
  return (
    <div
      className="team-hero-portrait-wrap reveal delay"
      aria-label={`${profile.name} portrait`}
      style={{ "--portrait-position": profile.imagePosition || "50% 28%" }}
    >
      <div className="team-hero-noise" aria-hidden="true" />
      <div className="team-hero-glow cyan" aria-hidden="true" />
      <div className="team-hero-glow purple" aria-hidden="true" />
      <div className="team-hero-glow blue" aria-hidden="true" />
      <div className="team-hero-portrait-card">
        <img src={profile.image} alt={profile.name} loading="eager" fetchPriority="high" />
      </div>
      <div className="team-hero-quote-card">
        <span className="team-hero-quote-icon"><Quote size={24} /></span>
        <p>Building solutions<br />that <strong>create impact</strong></p>
      </div>
    </div>
  );
}

export function TeamProfile({ slug }) {
  const routeSlug = normalizeSlug(slug);
  const [liveProfile, setLiveProfile] = useState(null);
  const [loadedSlug, setLoadedSlug] = useState("");

  useEffect(() => {
    let active = true;
    async function loadTeamProfile() {
      try {
        const data = await settingsApi.teamProfiles();
        const found = Array.isArray(data.teamProfiles) ? data.teamProfiles.find((item) => normalizeSlug(item.slug) === routeSlug) : null;
        if (active) setLiveProfile(found || null);
      } catch (err) {
        console.error(err);
        if (active) setLiveProfile(null);
      } finally {
        if (active) setLoadedSlug(routeSlug);
      }
    }
    loadTeamProfile();
    return () => { active = false; };
  }, [routeSlug]);

  const safeProfile = loadedSlug === routeSlug ? liveProfile : null;
  const loading = loadedSlug !== routeSlug;
  if (loading) return null;
  if (!safeProfile) return <NotFound />;
  return <><SEO title={safeProfile.name} description={safeProfile.summary} /><PageHero eyebrow={safeProfile.role} title={safeProfile.name} text={safeProfile.summary} image={false} visual={<TeamHeroPortrait profile={safeProfile} />} className="team-member-hero" secondary={{ label: "Back to Team", to: "/team" }} /><section className="split team-profile-detail"><div><SectionHeader eyebrow="Profile" title="Professional background" /><p className="lead">{safeProfile.bio}</p><p><strong>Location:</strong> {safeProfile.location}</p><a className="profile-linkedin" href={safeProfile.linkedin || "https://www.linkedin.com/"} target="_blank" rel="noreferrer"><Icon name="linkedin" size={20} /> LinkedIn profile</a></div><div><SectionHeader eyebrow="Focus Areas" title="Where this profile contributes" /><div className="check-list">{(safeProfile.focus || []).map((item) => <span key={item}>{item}</span>)}</div></div></section><CTA /></>;
}
