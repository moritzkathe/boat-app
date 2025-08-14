import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import ThemeRegistry from "./ThemeRegistry";
import PasswordProtection from "./components/PasswordProtection";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cranchi Clipper",
  description: "Kalender, Ausgaben & Wunschliste",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="slurp" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="baiduspider" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="yandex" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        
        {/* iOS specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Clipper" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.svg" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.svg" />
      </head>
      <body className={`${inter.variable}`}>
        <ThemeRegistry>
          <Providers>
            <PasswordProtection>
              {children}
            </PasswordProtection>
          </Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}
