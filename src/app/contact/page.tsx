import { SiteShell } from "@/components/SiteShell";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with the nichegolfHQ team. Send us a message or reach out on social media.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-6xl px-5 py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Contact us</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-600">
          Want to work together? Send a quick note and we'll get back to you.
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-600">
          Prefer a quick DM? Feel free to reach out on any of our social media
          accounts.
        </p>
        <div className="mx-auto mt-10 w-full max-w-2xl">
          <ContactForm />
        </div>
      </div>
    </SiteShell>
  );
}
