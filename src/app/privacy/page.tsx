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
          <div className="mt-3 text-sm text-zinc-600">Effective date: 2026-10-19</div>
        </div>

        <div className="space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm shadow-zinc-900/5">
          <p className="text-sm leading-7 text-zinc-700">
            This Privacy Policy explains how <span className="font-semibold">nichegolfHQ</span> (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;) collects, uses, and shares information when you visit https://www.nichegolfhq.com (the
            &quot;Site&quot;), including midamgolfHQ, juniorgolfHQ, and seniorgolfHQ.
          </p>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">1) Who we are</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
              <li>Publisher: nichegolfHQ</li>
              <li>Website: https://www.nichegolfhq.com</li>
              <li>
                General questions:{" "}
                <Link href="/contact" className="underline underline-offset-4 hover:text-zinc-950">
                  the contact form
                </Link>
              </li>
              <li>
                Privacy requests:{" "}
                <Link href="/privacy-choices" className="underline underline-offset-4 hover:text-zinc-950">
                  Your Privacy Choices
                </Link>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">2) Information we collect</h2>
            <div className="space-y-2 text-sm text-zinc-700">
              <div>
                <div className="font-semibold text-zinc-900">A) Information you provide</div>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Email address when you subscribe to a newsletter.</li>
                  <li>Name, email, state, and any details you include on the contact form, a sponsor inquiry, or a privacy request.</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-zinc-900">B) Information collected automatically</div>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Device and browser information, such as browser type and operating system.</li>
                  <li>Pages viewed and referring pages, when analytics is allowed.</li>
                  <li>Approximate country, inferred by our host from your IP address, so we know whether to show the cookie banner.</li>
                </ul>
              </div>
            </div>
            <p className="text-sm leading-7 text-zinc-700">
              The Site does not offer visitor sign-in. Cookie and opt-out choices are not stored on an account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">3) Cookies and similar technologies</h2>
            <div className="space-y-2 text-sm text-zinc-700">
              <div>
                <div className="font-semibold text-zinc-900">Necessary</div>
                <p className="mt-1">
                  A consent cookie remembers your cookie choice in this browser. A separate cookie remembers a Do Not
                  Sell or Share choice made on Your Privacy Choices.
                </p>
              </div>
              <div>
                <div className="font-semibold text-zinc-900">Analytics</div>
                <p className="mt-1">
                  We use Google Analytics 4 (measurement ID G-BW8QC5W1CH) to understand which pages are read. Google
                  signals and ads personalization are off, and advertising storage is denied. We do not run Google Ads.
                  In the EEA, the UK, and Switzerland, analytics stays off until you opt in. Elsewhere it is on until
                  you turn it off or send a Global Privacy Control signal.
                </p>
              </div>
              <div>
                <div className="font-semibold text-zinc-900">Performance</div>
                <p className="mt-1">Vercel Speed Insights measures how fast pages load.</p>
              </div>
              <div>
                <div className="font-semibold text-zinc-900">Newsletter</div>
                <p className="mt-1">
                  The subscribe form is a Beehiiv embed. Beehiiv sets its own cookies when you use that form and stores
                  the email address you submit.
                </p>
              </div>
              <div>
                <div className="font-semibold text-zinc-900">Storage and email</div>
                <p className="mt-1">
                  Supabase stores archived newsletter issues and the privacy requests you submit. Resend delivers the
                  email about a privacy request and a short confirmation to the address you provide.
                </p>
              </div>
            </div>
            <p className="text-sm leading-7 text-zinc-700">
              We do not use a third-party consent platform, retargeting tags, or advertising pixels. We do not sell
              personal information, share it for cross-context behavioral advertising, or run targeted ads.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">4) Your choices</h2>
            <p className="text-sm leading-7 text-zinc-700">
              Opt-outs are saved in this browser for visitors who are not signed in. Visitors in the EEA, the UK, and
              Switzerland see an opt-in banner. Anyone can reopen the choices from the Cookie Settings link in the footer.
            </p>
            <p className="text-sm leading-7 text-zinc-700">
              If you are signed in, the choice is saved to your account and follows that account on other devices. The
              stricter choice wins. A Global Privacy Control signal, a browser opt-out, or an email opt-out is not
              replaced by an older account setting that allowed analytics.
            </p>
            <p className="text-sm leading-7 text-zinc-700">
              To opt out across devices without signing in, and to opt out of the newsletter, submit the form on{" "}
              <Link href="/privacy-choices" className="underline underline-offset-4 hover:text-zinc-950">
                Your Privacy Choices
              </Link>{" "}
              with your email. If you later sign in with that same email, the opt-out follows the account.
            </p>
            <p className="text-sm leading-7 text-zinc-700">
              A Global Privacy Control signal, sent as the Sec-GPC header or exposed by the browser as
              navigator.globalPrivacyControl, is an opt-out of sale or sharing. We also deny analytics storage when
              that signal is present. The Your Privacy Choices page says so when a signal is detected.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">5) How we use information</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
              <li>Provide and operate the Site.</li>
              <li>Deliver newsletters you subscribe to.</li>
              <li>Respond to inquiries, sponsor notes, and privacy requests.</li>
              <li>Measure readership when analytics is allowed.</li>
              <li>Keep the Site secure and limit abuse.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">6) How we share information</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
              <li>Vercel, for hosting and speed measurement.</li>
              <li>Google, for analytics, when that is allowed.</li>
              <li>Beehiiv, for newsletter subscriptions.</li>
              <li>Supabase, for stored issues and privacy requests.</li>
              <li>Resend, to send privacy-request email.</li>
              <li>Authorities or other parties when the law requires it, or to protect rights and safety.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">7) Requests and response time</h2>
            <p className="text-sm leading-7 text-zinc-700">
              You can ask to access, correct, or delete personal information, or to opt out of sale or sharing. Use{" "}
              <Link href="/privacy-choices" className="underline underline-offset-4 hover:text-zinc-950">
                Your Privacy Choices
              </Link>
              . We respond within 45 days. We may need to confirm that the email address belongs to you before we
              complete the request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">8) Children</h2>
            <p className="text-sm leading-7 text-zinc-700">
              The Site is not directed to children under 13, and we do not knowingly collect personal information from
              children under 13. We do not sell or share personal information, and we do not run targeted ads.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">9) Changes to this policy</h2>
            <p className="text-sm leading-7 text-zinc-700">
              We may update this Privacy Policy from time to time. When we do, we change the effective date at the top.
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
