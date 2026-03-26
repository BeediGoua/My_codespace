import "./globals.css";
import type { Metadata } from "next";
import { Source_Sans_3, Space_Grotesk } from "next/font/google";
import { ReactNode } from "react";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Codespace Launcher",
  description: "Passer de l'idee au workspace GitHub en quelques clics.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
