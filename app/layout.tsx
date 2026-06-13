import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import Navigation from "./components/Navigation";
import GSAPWrapper from "./components/providers/GSAPWrapper";
import PreloaderShell from "./components/PreloaderShell";
import SiteFooter from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedsechos.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Weds Echos — Wedding & Events Photography, Kathmandu",
    template: "%s | Weds Echos",
  },
  description:
    "Cinematic wedding and events photography studio based in Kathmandu, Nepal. Capturing your story with editorial elegance.",
  keywords: ["wedding photography", "Nepal", "Kathmandu", "wedding photographer", "events photography", "cinematic"],
  authors: [{ name: "Weds Echos" }],
  creator: "Weds Echos",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Weds Echos",
    title: "Weds Echos — Wedding & Events Photography, Kathmandu",
    description:
      "Cinematic wedding and events photography studio based in Kathmandu, Nepal. Capturing your story with editorial elegance.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weds Echos — Wedding & Events Photography, Kathmandu",
    description:
      "Cinematic wedding and events photography studio based in Kathmandu, Nepal. Capturing your story with editorial elegance.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": siteUrl,
    name: "Weds Echos",
    description: "Cinematic wedding and events photography studio based in Kathmandu, Nepal.",
    url: siteUrl,
    telephone: "+9779813741089",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
    sameAs: [
      "https://www.instagram.com/wedsechos/",
      "https://www.facebook.com/profile.php?id=61576426967402",
      "https://www.youtube.com/@WeddingEcho",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Photography Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wedding Photography & Videography" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Music & Events Photography" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Model Portfolio Photography" } },
      ],
    },
  };

  return (
    <html lang="en" className="h-screen">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}>
        <PreloaderShell>
          <SmoothScroll>
            <GSAPWrapper>
              <Navigation />
              <main>{children}</main>
              <SiteFooter />
            </GSAPWrapper>
          </SmoothScroll>
        </PreloaderShell>
      </body>
    </html>
  );
}
