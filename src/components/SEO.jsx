import { useEffect } from "react";

export function SEO({ title, description }) {
  useEffect(() => {
    document.title = title ? title + " | ZMH USA Corp." : "ZMH USA Corp. | Remote Operations Department";
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute("content", description);
  }, [title, description]);

  return (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ZMH USA Corp.",
        url: "https://zmhusacorp.com",
        sameAs: ["https://linkedin.com", "https://facebook.com", "https://instagram.com", "https://youtube.com", "https://x.com"],
      })}
    </script>
  );
}
