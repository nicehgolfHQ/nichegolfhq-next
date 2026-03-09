import { redirect } from "next/navigation";

export const dynamic = "force-static";

export const metadata = {
  title: "Mid-Am Schedule | midamgolfHQ",
  description: "Mid-amateur tournament schedule and event hubs.",
  alternates: { canonical: "/midamgolfhq" },
};

export default function MidAmMajorsRedirectPage() {
  redirect("/midamgolfhq");
}
