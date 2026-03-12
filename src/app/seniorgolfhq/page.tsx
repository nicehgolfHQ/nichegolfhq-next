import NewsletterPage from "@/app/[newsletter]/page";

export const dynamic = "force-static";

export const metadata = {
  title: "seniorgolfHQ",
  description: "Senior amateur hubs, rankings, and major schedule.",
  alternates: { canonical: "/seniorgolfhq" },
};

export default async function SeniorIndexPage() {
  return <NewsletterPage params={{ newsletter: "seniorgolfhq" }} />;
}
