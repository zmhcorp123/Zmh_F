import { packages } from "../../data/siteData";
import { PackageDetail } from "../PackageDetail";
import { NotFound } from "../NotFound";

export function Pro() {
  const plan = packages.find((item) => item.slug === "professional");
  return plan ? <PackageDetail plan={plan} /> : <NotFound />;
}
