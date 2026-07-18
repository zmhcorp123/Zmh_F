import { Quote } from "lucide-react";
import { teamProfiles } from "../data/siteData";
import { CTA, PageHero, SectionHeader } from "../components/Sections";
import { Icon } from "../components/icons";
import { SEO } from "../components/SEO";
import { NotFound } from "./NotFound";

function normalizeSlug(value = "") {
  return String(value).trim().toLowerCase();
}

function TeamHeroPortrait({ profile }) {
  if (!profile?.image) return null;
  return (
    <div className="team-hero-portrait-wrap reveal delay" aria-label={`${profile.name} portrait`} style={{ "--portrait-position": profile.imagePosition || "50% 28%" }}>
      <div className="team-hero-noise" aria-hidden="true" />
      <div className="team-hero-glow cyan" aria-hidden="true" />
      <div className="team-hero-glow purple" aria-hidden="true" />
      <div className="team-hero-glow blue" aria-hidden="true" />
      <div className="team-hero-portrait-card"><img src={profile.image} alt={profile.name} loading="eager" fetchPriority="high" /></div>
      <div className="team-hero-quote-card"><span className="team-hero-quote-icon"><Quote size={24} /></span><p>Building solutions<br />that <strong>create impact</strong></p></div>
    </div>
  );
}

export function TeamProfile({ slug }) {
  const safeProfile = teamProfiles.find((item) => normalizeSlug(item.slug) === normalizeSlug(slug));
  if (!safeProfile) return <NotFound />;
  return <><SEO title={safeProfile.name} description={safeProfile.summary} /><PageHero eyebrow={safeProfile.role} title={safeProfile.name} text={safeProfile.summary} image={false} visual={<TeamHeroPortrait profile={safeProfile} />} className="team-member-hero" secondary={{ label: "Back to Team", to: "/team" }} /><section className="split team-profile-detail"><div><SectionHeader eyebrow="Profile" title="Professional background" /><p className="lead">{safeProfile.bio}</p><p><strong>Location:</strong> {safeProfile.location}</p><a className="profile-linkedin" href={safeProfile.linkedin || "https://www.linkedin.com/"} target="_blank" rel="noreferrer"><Icon name="linkedin" size={20} /> LinkedIn profile</a></div><div><SectionHeader eyebrow="Focus Areas" title="Where this profile contributes" /><div className="check-list">{(safeProfile.focus || []).map((item) => <span key={item}>{item}</span>)}</div></div></section><CTA /></>;
}
