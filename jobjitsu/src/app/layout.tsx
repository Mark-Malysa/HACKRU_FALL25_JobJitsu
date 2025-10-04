// src/app/layout.tsx (Update import to default)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobJitsu",
  description: "LeetCode for the entire interview journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="pt-16 bg-white">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}