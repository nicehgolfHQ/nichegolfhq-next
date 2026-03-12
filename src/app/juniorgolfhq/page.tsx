import NewsletterPage from "@/app/[newsletter]/page";

export const dynamic = "force-static";

export const metadata = {
  title: "juniorgolfHQ",
  description: "Junior golf hubs, rankings, and major schedule.",
  alternates: { canonical: "/juniorgolfhq" },
};

export default async function JuniorIndexPage() {
  return <NewsletterPage params={{ newsletter: "juniorgolfhq" }} />;
}
