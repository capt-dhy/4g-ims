import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "4G-IMS | Inventory Management System",
  description: "A premium inventory management system built with Next.js and MongoDB.",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-100 antialiased`}
    >
      <body className="d-flex flex-row min-vh-100 bg-light text-dark">
        <Sidebar />
        <main className="flex-grow-1 overflow-auto d-flex flex-column w-100">
          {children}
        </main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
