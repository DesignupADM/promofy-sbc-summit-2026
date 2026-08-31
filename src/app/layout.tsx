import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://promofy.ai"),
  title: "Promofy at SBC Summit 2026 | AI Gamification & Loyalty",
  description:
    "Meet Promofy at SBC Summit 2026 in Lisbon, 29 September–1 October. Explore AI-driven gamification, loyalty, acquisition and sports engagement. Book a meeting.",
  keywords: [
    "Promofy SBC Summit 2026",
    "SBC Summit Lisbon 2026",
    "iGaming gamification platform",
    "iGaming loyalty platform",
    "sportsbook gamification",
    "casino gamification",
    "player engagement platform",
    "sports engagement platform",
    "AI gamification",
    "iGaming retention",
    "CRM gamification integration",
  ],
  alternates: { canonical: "/sbc-summit-2026/" },
  openGraph: {
    type: "website",
    url: "/sbc-summit-2026/",
    siteName: "Promofy",
    title: "Promofy at SBC Summit 2026 | Turn Engagement On in Lisbon",
    description:
      "Meet Promofy at SBC Summit 2026 in Lisbon, 29 September–1 October. Experience the AI-powered engagement ecosystem live at Startup Hub S18.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Promofy at SBC Summit 2026",
    description: "Turn engagement on. Live in Lisbon, 29 September–1 October. Startup Hub · S18.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#110d1d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
