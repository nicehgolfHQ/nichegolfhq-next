import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export const metadata = {
  title: "Design System Preview (Lab) | nichegolfHQ",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignSystemLabPage({
  searchParams,
}: {
  searchParams?: { theme?: string };
}) {
  const theme = searchParams?.theme === "light" ? "light" : "dark";
  const src = theme === "light" ? "/lab/design-system-light.html" : "/lab/design-system-dark.html";

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-4">
          <div className="text-xs font-medium text-zinc-500">Lab</div>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950">Design mockups</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Two aesthetic directions. Sandbox only.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/lab/design-system?theme=dark" className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
              Option A: Dark nav + cream
            </Link>
            <Link href="/lab/design-system?theme=light" className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
              Option B: Mostly light
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <iframe title="Design system preview" src={src} className="h-[80vh] w-full" />
        </div>

        <p className="mt-3 text-xs text-zinc-500">
          Tip: open <code>/lab/design-system?theme=dark</code> or <code>?theme=light</code>.
        </p>
      </div>
    </SiteShell>
  );
}
