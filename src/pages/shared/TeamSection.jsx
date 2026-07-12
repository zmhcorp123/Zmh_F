import { useEffect, useState } from "react";
import { SectionHeader } from "../../components/Sections";
import { Icon } from "../../components/icons";
import { settingsApi } from "../../services/api";
import { navigate } from "../../utils/router";

export function TeamSection() {
  const [profiles, setProfiles] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;
    settingsApi.teamProfiles().then((data) => {
      if (active) {
        // Public profiles must always be the exact values saved in MongoDB.
        setProfiles(Array.isArray(data.teamProfiles) ? data.teamProfiles : []);
      }
    }).catch(() => {
      if (active) {
        setProfiles([]);
        setLoadFailed(true);
      }
    });
    return () => { active = false; };
  }, []);

  // The leadership row is role-based, not dependent on the order in which an
  // admin happens to save profiles. CEO first, then co-founders; every other
  // team member always follows in the lower grid.
  const orderedProfiles = (profiles || [])
    .map((profile, index) => ({ profile, index }))
    .sort((a, b) => {
      const rank = (role = "") => {
        const normalizedRole = String(role).toLowerCase();
        if (/\b(ceo|chief executive officer)\b/.test(normalizedRole)) return 0;
        if (/\bco[- ]?founder\b/.test(normalizedRole)) return 1;
        return 2;
      };
      return rank(a.profile.role) - rank(b.profile.role) || a.index - b.index;
    })
    .map(({ profile }) => profile);
  const primaryProfiles = orderedProfiles.slice(0, 3);
  const otherProfiles = orderedProfiles.slice(3);
  const getInitials = (name = "Team Profile") => name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  const renderProfile = (profile) => (
    <article className="team-card reveal" key={profile.slug}>
      <button className="team-profile-link" type="button" onClick={() => navigate("/team/" + profile.slug)}>
        <span className={profile.image ? "team-avatar team-photo" : "team-avatar"} style={{ "--avatar-position": profile.imagePosition || "50% 28%" }}>
          {profile.image && <img src={profile.image} alt={profile.name} loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
          <span className="team-avatar-initials">{getInitials(profile.name)}</span>
        </span>
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
      {profiles === null && <p>Loading team profiles…</p>}
      {loadFailed && <p>Team profiles are temporarily unavailable. Please refresh and try again.</p>}
      {Array.isArray(profiles) && !loadFailed && <>
        <div className="team-grid team-grid-primary">{primaryProfiles.map(renderProfile)}</div>
      {otherProfiles.length > 0 && <div className="team-grid team-grid-secondary">{otherProfiles.map(renderProfile)}</div>}
      </>}
    </section>
  );
}
