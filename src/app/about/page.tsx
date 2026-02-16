import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-5 py-12">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-950">About</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-700">
            nichegolfHQ covers the corners of competitive amateur golf the mainstream ignores — with dedicated junior,
            mid-am, and senior amateur coverage across our channels.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-700">
            Started in 2019 with <span className="font-semibold">midamgolfHQ</span>, and expanding into junior and senior coverage.
          </p>

          <div className="mt-8">
            <Link href="/" className="text-sm text-zinc-700 underline-offset-4 hover:underline">
              ← Back home
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
