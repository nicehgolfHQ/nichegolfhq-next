import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ConsentManager } from "@/components/ConsentManager";
import { consentDefaultScript } from "@/lib/privacy/consentScript";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const GA_MEASUREMENT_ID = "G-BW8QC5W1CH";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nichegolfhq.com"),
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/brand/nichegolfhq/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/brand/nichegolfhq/icon.png" }],
  },
  title: {
    default: "nichegolfHQ",
    template: "%s | nichegolfHQ",
  },
  description:
    "Competitive golfers covering the game beyond the mainstream. Overlooked stories, thoughtful coverage, off the beaten path.",
  openGraph: {
    type: "website",
    siteName: "nichegolfHQ",
    images: [
      {
        url: "/og/og-nichegolfhq.png",
        width: 1200,
        height: 630,
        alt: "nichegolfHQ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@midamgolfhq",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const country = (h.get("x-vercel-ip-country") || "").toUpperCase();
  const serverGpc = h.get("sec-gpc") === "1";

  return (
    <html lang="en">
      <head>
        <style>{`:root{--font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;}`}</style>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="nichegolfHQ Daily Briefs"
          href="https://www.nichegolfhq.com/briefs/feed.xml"
        />

        <Script id="consent-defaults" strategy="beforeInteractive">
          {consentDefaultScript(serverGpc)}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            gtag('js', new Date());
            gtag('set', 'ads_data_redaction', true);
            gtag('config', '${GA_MEASUREMENT_ID}', {
              allow_google_signals: false,
              allow_ad_personalization_signals: false
            });
          `}
        </Script>
      </head>
      <body className={`${sans.variable} font-sans antialiased`}>
        {children}
        <ConsentManager country={country} serverGpc={serverGpc} />
        <SpeedInsights />
      </body>
    </html>
  );
}
