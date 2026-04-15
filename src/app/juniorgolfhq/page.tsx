import Script from "next/script";
import NewsletterPage from "@/app/[newsletter]/page";

export const dynamic = "force-static";

export const metadata = {
  title: "juniorgolfHQ",
  description: "Junior golf hubs, rankings, and major schedule.",
  alternates: { canonical: "/juniorgolfhq" },
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "juniorgolfHQ",
  url: "https://www.nichegolfhq.com/juniorgolfhq",
  logo: "https://www.nichegolfhq.com/brand/juniorgolfhq/logo.png",
  parentOrganization: {
    "@type": "Organization",
    name: "nichegolfHQ",
    url: "https://www.nichegolfhq.com",
  },
  description: "Junior golf hubs, rankings, and major schedule.",
  sameAs: ["https://www.nichegolfhq.com/juniorgolfhq"],
};

const webPageLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "juniorgolfHQ",
  url: "https://www.nichegolfhq.com/juniorgolfhq",
  description: "Junior golf hubs, rankings, and major schedule.",
  isPartOf: { "@type": "WebSite", name: "nichegolfHQ", url: "https://www.nichegolfhq.com" },
};

export default async function JuniorIndexPage() {
  return (
    <>
      <Script id="ld-org-junior" type="application/ld+json">
        {JSON.stringify(orgLd)}
      </Script>
      <Script id="ld-webpage-junior" type="application/ld+json">
        {JSON.stringify(webPageLd)}
      </Script>
      <NewsletterPage params={{ newsletter: "juniorgolfhq" }} />
    </>
  );
}
