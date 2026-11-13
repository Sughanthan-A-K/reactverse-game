import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DiagnosticsDashboard } from "@/components/dev/DiagnosticsDashboard";
import { QADashboard } from "@/components/dev/QADashboard";
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
  title: "ReactVerse",
  description: "Interactive Story-Based Frontend Simulator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <DiagnosticsDashboard />
        <QADashboard />
      </body>
    </html>
  );
}
