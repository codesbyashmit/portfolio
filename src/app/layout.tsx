import type { Metadata } from "next";
import { Geist, Geist_Mono, Chakra_Petch } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const chakraPetch = Chakra_Petch({
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-chakra",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ashmit Kumar | Portfolio",
  description: "Full Stack Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${chakraPetch.variable} antialiased bg-[#050505]`}
    >
      <body className="text-zinc-200">{children}</body>
    </html>
  );
}