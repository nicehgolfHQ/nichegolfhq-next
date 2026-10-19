import { headers } from "next/headers";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { PrivacyChoices } from "@/components/PrivacyChoices";

export const metadata = {
  title: "Your Privacy Choices",
  description:
    "Opt out of sale or sharing in this browser, or send nichegolfHQ a privacy request by email.",
  alternates: { canonical: "/privacy-choices" },
};

export default async function PrivacyChoicesPage() {
  const h = await headers();
  const serverGpc = h.get("sec-gpc") === "1";
  const country = (h.get("x-vercel-ip-country") || "").toUpperCase();

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-5 py-12">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-950">Your Privacy Choices</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
            If you are not signed in, the switch is saved in this browser. If you are signed in, it is saved to your
            account and follows you on other devices. To opt out across devices without signing in, and to opt out of
            the newsletter, submit the form with your email.
          </p>
        </div>
        <PrivacyChoices serverGpc={serverGpc} country={country} />
        <div className="mt-8 text-center">
          <Link href="/privacy" className="text-sm text-zinc-700 underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
