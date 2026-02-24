import { redirect } from "next/navigation";

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

  // Full-page view (no iframe) so it doesn't feel like a site-inside-a-site.
  redirect(src);
}
