import { Preloader } from "@/components/ui/preloader";
import { ThemeProvider } from "@/providers/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import { Suspense } from "react";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "EventScope | Master Your Event Tracking",
    template: "%s | EventScope",
  },
  description:
    "The ultimate playground to design, simulate, and validate your analytics events. Ensure data quality with our Schema Builder and Event Simulator.",
  applicationName: "EventScope",
  metadataBase: new URL("https://event-scope-labs.vercel.app"),
  authors: [{ name: "Muhammad Fariz Rahman", url: "https://ayisrhmn.vercel.app" }],
  keywords: [
    "EventScope",
    "Event Tracking",
    "Analytics Validation",
    "Schema Builder",
    "Event Simulator",
    "Data Quality",
    "Product Analytics",
    "Tracking Plan",
    "Muhammad Fariz Rahman",
    "Ayisrhmn",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "EventScope | Master Your Event Tracking",
    description:
      "The ultimate playground to design, simulate, and validate your analytics events. Ensure data quality with our Schema Builder and Event Simulator.",
    url: "https://event-scope-labs.vercel.app",
    siteName: "EventScope",
    images: [
      {
        url: "https://event-scope-labs.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "EventScope - Event Tracking Playground",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EventScope | Master Your Event Tracking",
    description:
      "The ultimate playground to design, simulate, and validate your analytics events. Ensure data quality with our Schema Builder and Event Simulator.",
    images: ["https://event-scope-labs.vercel.app/og-image.png"],
    creator: "@ayisrhmn",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://event-scope-labs.vercel.app",
  },
  other: {
    "google-site-verification": "QXVlq8lAnlntE6dV6T9lXJODwjSB5c6pxMi4pTQVsDw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://event-scope-labs.vercel.app/#website",
        name: "EventScope",
        url: "https://event-scope-labs.vercel.app",
        description: "Master Your Event Tracking with Precision",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://event-scope-labs.vercel.app/?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://event-scope-labs.vercel.app/#software",
        name: "EventScope",
        url: "https://event-scope-labs.vercel.app",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        description:
          "The ultimate playground to design, simulate, and validate your analytics events.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        author: {
          "@type": "Person",
          name: "Muhammad Fariz Rahman",
          url: "https://ayisrhmn.vercel.app",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://event-scope-labs.vercel.app/#organization",
        name: "EventScope",
        url: "https://event-scope-labs.vercel.app",
        logo: {
          "@type": "ImageObject",
          url: "https://event-scope-labs.vercel.app/og-image.png",
        },
        sameAs: [
          "https://github.com/ayisrhmn",
          "https://linkedin.com/in/ayisrhmn",
          "https://twitter.com/ayisrhmn",
        ],
      },
    ],
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Preloader />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Suspense>{children}</Suspense>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
