import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/components/SiteShell";

export const metadata = {
  title: "About",
  description:
    "Learn about nichegolfHQ, the leading independent media and intelligence platform covering junior, mid-amateur, and senior amateur golf.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <SiteShell>
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
        <section className="flex h-[60vh] min-h-[400px] items-center justify-center">
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
        <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-12">
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
        </div>
      </div>
    </SiteShell>
  );
}
