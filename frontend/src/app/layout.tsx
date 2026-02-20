import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import QueryProvider from "../providers/QueryProvider";

export const metadata: Metadata = {
  title: {
    template: '%s | Memes Concept Store',
    default: 'Memes Concept Store',
  },
  description: "The best memes in town. Buy exclusive meme-based merchandise.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Memes Concept Store',
  },
};

import { PostHogProvider } from "../providers/PostHogProvider";
import { Footer } from "../components/ui/Footer";
import { CookieBanner } from "../components/ui/CookieBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PostHogProvider>
          <QueryProvider>
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <CookieBanner />
            </div>
          </QueryProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
