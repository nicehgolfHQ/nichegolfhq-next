import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export const metadata = {
  title: "Terms of Use",
  description: "Terms of Use for nichegolfHQ.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-5 py-12">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-950">Terms of Use</h1>
          <div className="mt-3 text-sm text-zinc-600">Effective date: 2026-02-27</div>
        </div>

        <div className="space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm shadow-zinc-900/5">
          <p className="text-sm leading-7 text-zinc-700">
            These Terms of Use (the “Terms”) govern your access to and use of https://www.nichegolfhq.com (the “Site”) operated by
            nichegolfHQ (“we,” “us,” or “our”). By accessing or using the Site, you agree to these Terms.
          </p>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">1) Content and purpose</h2>
            <p className="text-sm leading-7 text-zinc-700">
              The Site publishes editorial content and information related to competitive amateur golf, including schedule hubs,
              archives, newsletters, and related resources. Content is provided for general informational purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">2) No professional advice</h2>
            <p className="text-sm leading-7 text-zinc-700">
              The Site is not providing legal, medical, financial, or other professional advice. You are responsible for how you use
              information from the Site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">3) Intellectual property</h2>
            <p className="text-sm leading-7 text-zinc-700">
              Unless otherwise indicated, the Site and its content (including text, design, graphics, and logos) are owned by
              nichegolfHQ or its licensors and are protected by applicable intellectual property laws.
            </p>
            <p className="text-sm leading-7 text-zinc-700">
              You may share links to our pages. You may not reproduce, republish, distribute, or exploit Site content for commercial
              purposes without our prior written permission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">4) Third-party links</h2>
            <p className="text-sm leading-7 text-zinc-700">
              The Site may link to third-party websites or services. We do not control those third parties and are not responsible
              for their content, policies, or practices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">5) User conduct</h2>
            <p className="text-sm leading-7 text-zinc-700">
              You agree not to misuse the Site, including attempting to disrupt the Site, scrape in a way that harms availability, or
              access the Site using automated means that violate applicable laws or our published policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">6) Disclaimers</h2>
            <p className="text-sm leading-7 text-zinc-700">
              The Site is provided on an “as is” and “as available” basis without warranties of any kind, express or implied.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">7) Limitation of liability</h2>
            <p className="text-sm leading-7 text-zinc-700">
              To the fullest extent permitted by law, nichegolfHQ will not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or revenues, arising from your use of the Site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">8) Changes</h2>
            <p className="text-sm leading-7 text-zinc-700">
              We may update these Terms from time to time. We will update the effective date above when we do.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">9) Contact</h2>
            <p className="text-sm leading-7 text-zinc-700">Questions: visit our <Link href="/contact" className="underline underline-offset-4 hover:text-zinc-950">contact page</Link>.</p>
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
