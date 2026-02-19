import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ServiceWorker from "@/components/ServiceWorker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Store Locator",
  description: "Role-based smart store item locator and storefront experience",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Smart Store Locator",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: "/pwa%20logo.png",
    apple: "/pwa%20logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#e6a97b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServiceWorker />
        {children}
      </body>
    </html>
  );
}
