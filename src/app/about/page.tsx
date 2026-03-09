import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/components/SiteShell";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
        <Image
          src="/brand/midamgolfhq/DJI_20260221154348_0766_D.jpeg"
          alt="Aerial view of a championship golf course"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1
            className="font-serif text-5xl font-bold tracking-tight text-white md:text-6xl"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
          >
            About
          </h1>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto w-full max-w-3xl px-5 py-12">
        <div className="text-center">
          <p className="mx-auto max-w-2xl text-lg leading-8 text-zinc-700">
            nichegolfHQ is the leading independent media and intelligence
            platform covering amateur golf, focused on junior, mid-amateur, and
            senior events.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-700">
            We cover the corners of competitive amateur golf the mainstream
            ignores — with dedicated coverage across our channels.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-700">
            Started in 2019 with{" "}
            <span className="font-semibold">midamgolfHQ</span>, and expanding
            into junior and senior coverage.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="text-sm text-zinc-700 underline-offset-4 hover:underline"
            >
              &larr; Back home
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
