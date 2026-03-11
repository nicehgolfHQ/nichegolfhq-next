import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

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

        {/* Ketch consent manager (tag as provided by Ketch; loads early so it can gate other tags) */}
        <Script id="ketch-smart-tag" strategy="beforeInteractive">
          {`!function(){window.semaphore=window.semaphore||[],window.ketch=function(){window.semaphore.push(arguments)};var e=new URLSearchParams(document.location.search),n=document.createElement("script");n.type="text/javascript", n.src="https://global.ketchcdn.com/web/v3/config/nicegolfhq/website_smart_tag/boot.js", n.defer=n.async=!0,document.getElementsByTagName("head")[0].appendChild(n)}();`}
        </Script>

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

        {/* Simpli.fi retargeting tag (Ketch should gate this under Marketing consent where required) */}
        <Script
          id="simplifi"
          async
          referrerPolicy="no-referrer-when-downgrade"
          src="https://tag.simpli.fi/sifitag/ed67e2ba-f353-49ca-9d4b-e76237917756"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${sans.variable} font-sans antialiased`}>
        {children}
      
            
    </html>
  );
}
