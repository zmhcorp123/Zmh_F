import { useEffect, useState } from "react";
import { CTA, PageHero, SectionHeader } from "../components/Sections";
import { Icon } from "../components/icons";
import { SEO } from "../components/SEO";
import { teamProfiles } from "../data/siteData";
import { settingsApi } from "../services/api";

export function TeamProfile({ profile, slug }) {
  const [liveProfile, setLiveProfile] = useState(profile);

  useEffect(() => {
    let active = true;
    settingsApi.teamProfiles().then((data) => {
      const found = Array.isArray(data.teamProfiles) ? data.teamProfiles.find((item) => item.slug === slug) : null;
      if (active && found) setLiveProfile(found);
    }).catch(() => {});
    return () => { active = false; };
  }, [slug]);

  const safeProfile = liveProfile || teamProfiles.find((item) => item.slug === slug) || teamProfiles[0];
  return <><SEO title={safeProfile.name} description={safeProfile.summary} /><PageHero eyebrow={safeProfile.role} title={safeProfile.name} text={safeProfile.summary} image={false} secondary={{ label: "Back to Team", to: "/team" }} /><section className="split team-profile-detail"><div><SectionHeader eyebrow="Profile" title="Professional background" /><p className="lead">{safeProfile.bio}</p><p><strong>Location:</strong> {safeProfile.location}</p><a className="profile-linkedin" href={safeProfile.linkedin || "https://www.linkedin.com/"} target="_blank" rel="noreferrer"><Icon name="linkedin" size={20} /> LinkedIn profile</a></div><div><SectionHeader eyebrow="Focus Areas" title="Where this profile contributes" /><div className="check-list">{(safeProfile.focus || []).map((item) => <span key={item}>{item}</span>)}</div></div></section><CTA /></>;
}
