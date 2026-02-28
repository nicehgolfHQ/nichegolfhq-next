import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for nichegolfHQ.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-5 py-12">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-950">Privacy Policy</h1>
          <div className="mt-3 text-sm text-zinc-600">Effective date: 2026-02-27</div>
        </div>

        <div className="space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm shadow-zinc-900/5">
          <p className="text-sm leading-7 text-zinc-700">
            This Privacy Policy explains how <span className="font-semibold">nichegolfHQ</span> ("we," "us," or "our") collects,
            uses, and shares information when you visit https://www.nichegolfhq.com (the “Site”), including our brand pages and
            sections such as midamgolfHQ, juniorgolfHQ, and seniorgolfHQ.
          </p>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">1) Who we are</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
              <li>Publisher: nichegolfHQ</li>
              <li>Website: https://www.nichegolfhq.com</li>
              <li>Contact: privacy@nichegolfhq.com</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">2) Information we collect</h2>
            <div className="space-y-2 text-sm text-zinc-700">
              <div>
                <div className="font-semibold text-zinc-900">A) Information you provide</div>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Email address when you subscribe to a newsletter.</li>
                  <li>Message content and contact details when you contact us via forms or email.</li>
                  <li>Sponsor/partnership inquiries (name, company, email, and any details you include).</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-zinc-900">B) Information collected automatically</div>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Device and browser information (e.g., browser type, operating system).</li>
                  <li>Usage information (pages viewed, time spent, referring/exit pages).</li>
                  <li>Approximate location (e.g., country/region inferred from IP address).</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">3) Cookies, pixels, and similar technologies</h2>
            <p className="text-sm leading-7 text-zinc-700">
              We use cookies and similar technologies for site functionality, analytics, and (in some cases) marketing/retargeting.
            </p>
            <div className="space-y-2 text-sm text-zinc-700">
              <div>
                <div className="font-semibold text-zinc-900">Consent management</div>
                <p className="mt-1">
                  We use <span className="font-semibold">Ketch</span> as our consent management platform. You can update your consent
                  choices at any time via the “Privacy Settings” link in the site footer.
                </p>
              </div>
              <div>
                <div className="font-semibold text-zinc-900">Analytics</div>
                <p className="mt-1">We use Google Analytics to understand how visitors use the Site.</p>
              </div>
              <div>
                <div className="font-semibold text-zinc-900">Marketing / retargeting</div>
                <p className="mt-1">We may use Simpli.fi (and similar tools in the future) to build audiences and run retargeting campaigns.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">4) How we use information</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
              <li>Provide and operate the Site.</li>
              <li>Deliver newsletters and subscription services.</li>
              <li>Respond to inquiries and provide support.</li>
              <li>Improve content, site performance, and user experience.</li>
              <li>Measure audience and engagement (analytics).</li>
              <li>Conduct marketing/retargeting where permitted.</li>
              <li>Prevent fraud, abuse, and security issues.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">5) How we share information</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
              <li>Vendors/service providers (hosting, analytics, consent management, newsletter tooling).</li>
              <li>Advertising/marketing partners (e.g., Simpli.fi) where permitted.</li>
              <li>Legal/safety reasons if required to comply with law or protect rights and safety.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">6) Your choices and rights</h2>
            <p className="text-sm leading-7 text-zinc-700">
              Depending on your location, you may have rights to access, correct, or delete certain personal information, and to
              withdraw consent. To request help, contact privacy@nichegolfhq.com.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">7) Children’s privacy</h2>
            <p className="text-sm leading-7 text-zinc-700">
              The Site is not intended for children under 13 (or under 16 in some jurisdictions). We do not knowingly collect
              personal information from children.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">8) Changes to this policy</h2>
            <p className="text-sm leading-7 text-zinc-700">
              We may update this Privacy Policy from time to time and will update the effective date at the top when changes are made.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-zinc-700 underline-offset-4 hover:underline">
            ← Back home
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
