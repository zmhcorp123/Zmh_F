import { packages } from "../../data/siteData";
import { PackageDetail } from "../PackageDetail";
import { NotFound } from "../NotFound";

export function Starter() {
  const plan = packages.find((item) => item.slug === "starter");
  return plan ? <PackageDetail plan={plan} /> : <NotFound />;
}
