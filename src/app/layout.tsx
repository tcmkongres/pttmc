import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import AnalyticsWrapper from "../components/AnalyticsWrapper";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Polskie Towarzystwo Tradycyjnej Medycyny Chińskiej",
  description: "Przychodnia medycyny chińskiej w Krakowie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
      {/* Główna treść aplikacji */}
        <AuthProvider>{children}</AuthProvider>
        {/* Dodanie AnalyticsWrapper */}
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
