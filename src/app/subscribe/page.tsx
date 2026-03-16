import { SiteShell } from "@/components/SiteShell";
import { BeehiivEmbed } from "@/components/BeehiivEmbed";
import { getFeedBySlug } from "@/lib/feeds";

const ORDER = ["juniorgolfhq", "midamgolfhq", "seniorgolfhq"] as const;

export const metadata = {
  title: "Subscribe",
  description:
    "Subscribe to nichegolfHQ newsletters covering junior, mid-amateur, and senior amateur golf.",
  alternates: {
    canonical: "/subscribe",
  },
};

export default function SubscribePage() {
  const feeds = ORDER.map((slug) => {
    const feed = getFeedBySlug(slug);
    if (!feed) throw new Error(`Missing feed config for ${slug}`);
    return feed;
  });

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-2xl px-5 py-14 text-center">
        <h1 className="sr-only">Subscribe</h1>
        <div className="flex flex-col gap-10">
          {feeds.map((feed) => (
            <section key={feed.slug} className="flex flex-col gap-4">
              <div className="text-xs text-zinc-500">{feed.name}</div>
              <div className="mx-auto w-full md:max-w-2xl">
                <BeehiivEmbed
                  src={feed.subscribeEmbedUrl}
                  height={feed.subscribeEmbedHeight}
                  title={`${feed.name} subscribe`}
                />
              </div>
            </section>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
