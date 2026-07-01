import { CTA, PageHero, SectionHeader } from "../components/Sections";
import { Icon } from "../components/icons";
import { SEO } from "../components/SEO";

export function TeamProfile({ profile }) {
  return <><SEO title={profile.name} description={profile.summary} /><PageHero eyebrow={profile.role} title={profile.name} text={profile.summary} image={false} secondary={{ label: "Back to About", to: "/about" }} /><section className="split"><div><SectionHeader eyebrow="Profile" title="Professional background" /><p className="lead">{profile.bio}</p><p><strong>Location:</strong> {profile.location}</p><a className="profile-linkedin" href={profile.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" size={20} /> LinkedIn profile</a></div><div><SectionHeader eyebrow="Focus Areas" title="Where this profile contributes" /><div className="check-list">{profile.focus.map((item) => <span key={item}>{item}</span>)}</div></div></section><CTA /></>;
}
