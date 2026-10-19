import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/components/SiteShell";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo/structuredData";

export const metadata = {
  title: "About",
  description:
    "Learn about nichegolfHQ, the leading independent media and intelligence platform covering junior, mid-amateur, and senior amateur golf.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const aboutLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About nichegolfHQ",
    url: "https://www.nichegolfhq.com/about",
    description:
      "How nichegolfHQ covers junior, mid-amateur, and senior amateur golf, including sources and corrections.",
    isPartOf: { "@type": "WebSite", name: "nichegolfHQ", url: "https://www.nichegolfhq.com" },
    publisher: { "@type": "Organization", name: "nichegolfHQ", url: "https://www.nichegolfhq.com" },
  };
  const crumbs = breadcrumbLd([
    { name: "Home", item: "https://www.nichegolfhq.com" },
    { name: "About", item: "https://www.nichegolfhq.com/about" },
  ]);

  return (
    <SiteShell>
      <JsonLd data={aboutLd} />
      <JsonLd data={crumbs} />
      {/* Fixed background image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/brand/midamgolfhq/DJI_20260221154348_0766_D.jpeg"
          alt="Aerial view of a championship golf course"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Scrollable content over the image */}
      <div className="relative z-10">
        {/* Hero spacer with title */}
        <section className="flex h-[40vh] min-h-[260px] items-center justify-center">
          <h1
            className="font-serif text-5xl font-bold tracking-tight text-white md:text-7xl"
            style={{
              textShadow:
                "0 2px 24px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.3)",
            }}
          >
            About
          </h1>
        </section>

        {/* Content area — transparent bg, text over image */}
        <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-2">
          <div className="rounded-2xl bg-black/50 p-8 text-center backdrop-blur-md md:p-12">
            <p className="mx-auto max-w-2xl text-lg leading-8 text-white/90">
              nichegolfHQ is the leading independent media and intelligence
              platform covering amateur golf, focused on junior, mid-amateur,
              and senior events.
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/70">
              We cover the corners of competitive amateur golf the mainstream
              ignores — with dedicated coverage across our channels.
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/70">
              Started in 2019 with{" "}
              <span className="font-semibold text-white">midamgolfHQ</span>, and
              expanding into junior and senior coverage.
            </p>

            <div className="mt-8">
              <Link
                href="/"
                className="text-sm text-white/50 underline-offset-4 transition hover:text-white hover:underline"
              >
                &larr; Back home
              </Link>
            </div>
          </div>

          {/* Data and sources card */}
          <div className="mt-8 rounded-2xl bg-black/50 p-8 text-center backdrop-blur-md md:p-12">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-white md:text-3xl">
              Our approach to data and sources
            </h2>

            <p className="mt-6 text-base leading-7 text-white/80">
              nichegolfHQ is built on firsthand knowledge of the competitive
              amateur golf world. Many of the events we cover are ones we&apos;ve
              played in ourselves or have direct relationships with tournament
              directors and organizers.
            </p>

            <p className="mt-4 text-base leading-7 text-white/80">
              Where possible, we source information directly from tournament
              websites, official social media accounts, and live scoring
              platforms like Golf Genius. For player rankings and historical
              data, we cite established ranking services including
              amateurgolfinfo.com.
            </p>

            <p className="mt-4 text-base leading-7 text-white/80">
              When direct sources aren&apos;t available, we draw on our own
              experience and network within the amateur golf community to
              provide the most accurate coverage we can.
            </p>

            <p className="mt-4 text-base leading-7 text-white/80">
              If you run a tournament and would like to update, correct, or add
              information to our coverage, please reach out through our{" "}
              <Link
                href="/contact"
                className="font-semibold text-emerald-400 underline-offset-4 transition hover:underline"
              >
                contact page
              </Link>
              .
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-black/50 p-8 text-left backdrop-blur-md md:p-12">
            <h2 className="text-center font-serif text-2xl font-bold tracking-tight text-white md:text-3xl">
              Editorial policy
            </h2>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-white/80">
              How coverage works
            </h3>
            <p className="mt-2 text-base leading-7 text-white/80">
              nichegolfHQ publishes three kinds of pages. Tournament hubs collect dates, venue, format, eligibility, and past winners for junior, mid-amateur, and senior events. Daily briefs are short, dated roundups; each item names a source and links to it. Newsletter issues are the archived editions of midamgolfHQ, juniorgolfHQ, and seniorgolfHQ.
            </p>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-white/80">
              Sources
            </h3>
            <p className="mt-2 text-base leading-7 text-white/80">
              Scores, fields, and dates come from the tournament, its association (including the USGA and AJGA), or live scoring. Rankings are cited from amateurgolfinfo.com. A daily brief item is a summary of the linked source, not a rewrite presented as an original report.
            </p>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-white/80">
              Corrections
            </h3>
            <p className="mt-2 text-base leading-7 text-white/80">
              If a result, date, spelling, or attribution is wrong, tell us. We update the page and leave the corrected version in place. Bylines on articles stay with the channel staff desk.
            </p>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-white/80">
              Contact
            </h3>
            <p className="mt-2 text-base leading-7 text-white/80">
              Send corrections through the{" "}
              <Link
                href="/contact"
                className="font-semibold text-emerald-400 underline-offset-4 transition hover:underline"
              >
                contact form
              </Link>
              . Privacy requests go through{" "}
              <Link
                href="/privacy-choices"
                className="font-semibold text-emerald-400 underline-offset-4 transition hover:underline"
              >
                Your Privacy Choices
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
