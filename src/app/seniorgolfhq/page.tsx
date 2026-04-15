import Script from "next/script";
import NewsletterPage from "@/app/[newsletter]/page";

export const dynamic = "force-static";

export const metadata = {
  title: "seniorgolfHQ",
  description: "Senior amateur hubs, rankings, and major schedule.",
  alternates: { canonical: "/seniorgolfhq" },
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "seniorgolfHQ",
  url: "https://www.nichegolfhq.com/seniorgolfhq",
  logo: "https://www.nichegolfhq.com/brand/seniorgolfhq/logo.png",
  parentOrganization: {
    "@type": "Organization",
    name: "nichegolfHQ",
    url: "https://www.nichegolfhq.com",
  },
  description: "Senior amateur hubs, rankings, and major schedule.",
  sameAs: ["https://www.nichegolfhq.com/seniorgolfhq"],
};

const webPageLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "seniorgolfHQ",
  url: "https://www.nichegolfhq.com/seniorgolfhq",
  description: "Senior amateur hubs, rankings, and major schedule.",
  isPartOf: { "@type": "WebSite", name: "nichegolfHQ", url: "https://www.nichegolfhq.com" },
};

export default async function SeniorIndexPage() {
  return (
    <>
      <Script id="ld-org-senior" type="application/ld+json">
        {JSON.stringify(orgLd)}
      </Script>
      <Script id="ld-webpage-senior" type="application/ld+json">
        {JSON.stringify(webPageLd)}
      </Script>
      <NewsletterPage params={{ newsletter: "seniorgolfhq" }} />
    </>
  );
}
