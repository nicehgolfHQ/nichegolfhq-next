import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

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
    title: "nichegolfHQ",
    description:
      "Competitive golfers covering the game beyond the mainstream. Overlooked stories, thoughtful coverage, off the beaten path.",
    images: ["/og/og-nichegolfhq.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_MEASUREMENT_ID = "G-BW8QC5W1CH";

  return (
    <html lang="en">
      <head>
        <style>{`:root{--font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;}`}</style>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className={`${sans.variable} ${mono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
