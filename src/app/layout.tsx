import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Street Scout — Premium Anime Jerseys",
  description:
    "Premium anime jerseys built for everyday legends. Luxury fashion meets Japanese street culture and competitive esports aesthetics.",
  keywords: [
    "anime jersey",
    "streetwear",
    "anime streetwear",
    "premium anime",
    "Japanese streetwear",
    "anime fashion",
    "Street Scout",
  ],
  authors: [{ name: "Street Scout" }],
  openGraph: {
    title: "Street Scout — Premium Anime Jerseys",
    description: "Wear Your Fandom. Premium Anime Jerseys Built For Everyday Legends.",
    siteName: "Street Scout",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Street Scout — Premium Anime Jerseys",
    description: "Wear Your Fandom. Premium Anime Jerseys Built For Everyday Legends.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoJP.variable} ${bebasNeue.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
