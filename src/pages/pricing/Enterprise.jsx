import { packages } from "../../data/siteData";
import { PackageDetail } from "../PackageDetail";
import { NotFound } from "../NotFound";

export function Enterprise() {
  const plan = packages.find((item) => item.slug === "enterprise");
  return plan ? <PackageDetail plan={plan} /> : <NotFound />;
}
