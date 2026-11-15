import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/shared/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Odaboo | Find Expert Services For Any Need",
  description: "Connect with trusted professionals for your home, business, and personal needs. Book appointments, manage payments, and get things done.",
  icons: {
    icon: [
      { url: "/Logo.png", href: "/Logo.png" },
    ],
    shortcut: "/Logo.png",
    apple: "/Logo.png",
  },
  openGraph: {
    images: "/Logo.png",
  },
};

import { ConditionalFooter } from "@/shared/ConditionalFooter";
import { LanguageProvider } from "@/context/LanguageContext";
import { ExtensionAttributeCleanup } from "@/shared/ExtensionAttributeCleanup";
import { RoleGuard } from "@/components/RoleGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col bg-white`} suppressHydrationWarning>
        <LanguageProvider>
          <ExtensionAttributeCleanup />
          <Navbar />
          <RoleGuard>
            <main className="flex-grow" suppressHydrationWarning>
              {children}
            </main>
          </RoleGuard>
          <ConditionalFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
