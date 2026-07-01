import { teamProfiles } from "../../data/siteData";
import { SectionHeader } from "../../components/Sections";
import { Icon } from "../../components/icons";
import { navigate } from "../../utils/router";

export function TeamSection() {
  return <section id="team"><SectionHeader eyebrow="Leadership & Stakeholders" title="The people structure behind ZMH USA Corp." text="Founder and stakeholder profiles show the leadership responsibilities behind client delivery and operations quality." /><div className="team-grid">{teamProfiles.map((profile) => <article className="team-card reveal" key={profile.slug}><button className="team-profile-link" type="button" onClick={() => navigate("/team/" + profile.slug)}><span className="team-avatar">{profile.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</span><span><strong>{profile.name}</strong><small>{profile.role}</small></span></button><p>{profile.summary}</p><div className="team-card-actions"><button className="learn" type="button" onClick={() => navigate("/team/" + profile.slug)}>View profile</button><a className="linkedin-button" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label={"Open " + profile.name + " on LinkedIn"} title="LinkedIn"><Icon name="linkedin" size={18} /></a></div></article>)}</div></section>;
}
