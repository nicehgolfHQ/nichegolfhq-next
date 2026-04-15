import Script from "next/script";
import NewsletterPage from "@/app/[newsletter]/page";

export const dynamic = "force-static";

// Keep canonical + SEO strings, but restore the original midamgolfHQ landing experience
// (hero + rankings + hub design) by reusing the newsletter landing page.
export const metadata = {
  title: "midamgolfHQ",
  description: "Mid-amateur golf tournament hubs, rankings, and major schedule.",
  alternates: { canonical: "/midamgolfhq" },
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "midamgolfHQ",
  url: "https://www.nichegolfhq.com/midamgolfhq",
  logo: "https://www.nichegolfhq.com/brand/midamgolfhq/logo.png",
  parentOrganization: {
    "@type": "Organization",
    name: "nichegolfHQ",
    url: "https://www.nichegolfhq.com",
  },
  description: "Mid-amateur golf tournament hubs, rankings, and major schedule.",
  sameAs: ["https://www.nichegolfhq.com/midamgolfhq"],
};

const webPageLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "midamgolfHQ",
  url: "https://www.nichegolfhq.com/midamgolfhq",
  description: "Mid-amateur golf tournament hubs, rankings, and major schedule.",
  isPartOf: { "@type": "WebSite", name: "nichegolfHQ", url: "https://www.nichegolfhq.com" },
};

export default async function MidAmIndexPage() {
  return (
    <>
      <Script id="ld-org-midam" type="application/ld+json">
        {JSON.stringify(orgLd)}
      </Script>
      <Script id="ld-webpage-midam" type="application/ld+json">
        {JSON.stringify(webPageLd)}
      </Script>
      <NewsletterPage params={{ newsletter: "midamgolfhq" }} />
    </>
  );
}
