import { Button } from "../components/Button";
import { SEO } from "../components/SEO";

export function NotFound() {
  return <><SEO title="404" /><section className="not-found"><h1>404</h1><p>This page is not available.</p><Button to="/">Return Home</Button></section></>;
}
