import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Chris Kang | Full-stack Developer & UI Architect",
  description:
    "Minimalist portfolio of Chris Kang, a Tokyo-based software architect who believes beauty lies in performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansSC.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
