import NewsletterPage from "@/app/[newsletter]/page";

export const dynamic = "force-static";

// Keep canonical + SEO strings, but restore the original midamgolfHQ landing experience
// (hero + rankings + hub design) by reusing the newsletter landing page.
export const metadata = {
  title: "midamgolfHQ",
  description: "Mid-amateur golf tournament hubs, rankings, and major schedule.",
  alternates: { canonical: "/midamgolfhq" },
};

export default async function MidAmIndexPage() {
  return <NewsletterPage params={{ newsletter: "midamgolfhq" }} />;
}
