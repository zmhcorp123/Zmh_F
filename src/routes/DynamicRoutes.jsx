import { useParams } from "react-router-dom";
import { industries, packages, services, teamProfiles } from "../data/siteData";
import { IndustryDetail } from "../pages/IndustryDetail";
import { NotFound } from "../pages/NotFound";
import { PackageDetail } from "../pages/PackageDetail";
import { ServiceDetail } from "../pages/ServiceDetail";
import { TeamProfile } from "../pages/TeamProfile";

export function ServiceRoute() {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug);
  return service ? <ServiceDetail service={service} /> : <NotFound />;
}

export function IndustryRoute() {
  const { slug } = useParams();
  const industry = industries.find((item) => item.slug === slug);
  return industry ? <IndustryDetail industry={industry} /> : <NotFound />;
}

export function PackageRoute() {
  const { slug } = useParams();
  const routeAliases = { pro: "professional" };
  const planSlug = routeAliases[slug] || slug;
  const plan = packages.find((item) => item.slug === planSlug);
  return plan ? <PackageDetail plan={plan} /> : <NotFound />;
}

export function TeamProfileRoute() {
  const { slug } = useParams();
  const profile = teamProfiles.find((item) => item.slug === slug);
  return <TeamProfile profile={profile || null} slug={slug} />;
}
