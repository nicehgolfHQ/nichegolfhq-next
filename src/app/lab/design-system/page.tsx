import { SiteShell } from "@/components/SiteShell";

export const metadata = {
  title: "Design System Preview (Lab) | nichegolfHQ",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignSystemLabPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-4">
          <div className="text-xs font-medium text-zinc-500">Lab</div>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
            Design System Preview
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Sandbox page for reviewing a potential redesign. Not linked in nav; safe to iterate.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <iframe
            title="Design system preview"
            src="/lab/design-system.html"
            className="h-[80vh] w-full"
          />
        </div>
      </div>
    </SiteShell>
  );
}
