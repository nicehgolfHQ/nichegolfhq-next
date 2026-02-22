import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export const metadata = {
  title: "Majors | nichegolfHQ",
  description: "Majors hubs across midamgolfHQ, juniorgolfHQ, and seniorgolfHQ.",
};

export default function MajorsLandingPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-5xl px-5 py-10">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-950">Majors</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">
            Choose a track to view the majors schedule and event hubs.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-3">
          <Link
            href="/midamgolfhq/majors"
            className="rounded-3xl border border-zinc-200 bg-white p-6 text-center transition hover:border-zinc-300 hover:bg-zinc-50"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">midamgolfHQ</div>
            <div className="mt-2 font-serif text-2xl font-semibold tracking-tight text-zinc-950">Mid-Am Majors</div>
            <div className="mt-2 text-sm text-zinc-600">2026 schedule + results hubs</div>
          </Link>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">juniorgolfHQ</div>
            <div className="mt-2 font-serif text-2xl font-semibold tracking-tight text-zinc-950">Junior Majors</div>
            <div className="mt-2 text-sm text-zinc-500">Coming next</div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">seniorgolfHQ</div>
            <div className="mt-2 font-serif text-2xl font-semibold tracking-tight text-zinc-950">Senior Majors</div>
            <div className="mt-2 text-sm text-zinc-500">Coming next</div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
