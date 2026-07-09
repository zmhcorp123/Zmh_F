import { useEffect, useState } from "react";
import { teamProfiles } from "../../data/siteData";
import { SectionHeader } from "../../components/Sections";
import { Icon } from "../../components/icons";
import { settingsApi } from "../../services/api";
import { navigate } from "../../utils/router";

export function TeamSection() {
  const [profiles, setProfiles] = useState(teamProfiles);

  useEffect(() => {
    let active = true;
    settingsApi.teamProfiles().then((data) => {
      if (active && Array.isArray(data.teamProfiles) && data.teamProfiles.length) setProfiles(data.teamProfiles);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const primaryProfiles = profiles.slice(0, 3);
  const otherProfiles = profiles.slice(3);
  const renderProfile = (profile) => (
    <article className="team-card reveal" key={profile.slug}>
      <button className="team-profile-link" type="button" onClick={() => navigate("/team/" + profile.slug)}>
        <span className="team-avatar">{profile.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</span>
        <span><strong>{profile.name}</strong><small>{profile.role}</small></span>
      </button>
      <p>{profile.summary}</p>
      <div className="team-card-actions">
        <button className="learn" type="button" onClick={() => navigate("/team/" + profile.slug)}>View profile</button>
        <a className="linkedin-button" href={profile.linkedin || "https://www.linkedin.com/"} target="_blank" rel="noreferrer" aria-label={"Open " + profile.name + " on LinkedIn"} title="LinkedIn"><Icon name="linkedin" size={18} /></a>
      </div>
    </article>
  );

  return (
    <section id="team">
      <SectionHeader eyebrow="Leadership & Stakeholders" title="The people structure behind ZMH USA Corp." text="Founder and stakeholder profiles show the leadership responsibilities behind client delivery and operations quality." />
      <div className="team-grid team-grid-primary">{primaryProfiles.map(renderProfile)}</div>
      {otherProfiles.length > 0 && <div className="team-grid team-grid-secondary">{otherProfiles.map(renderProfile)}</div>}
    </section>
  );
}
