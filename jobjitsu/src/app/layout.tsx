// src/app/layout.tsx (updated)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";  // Assuming Sonner for toasts

import { Providers } from "@/components/Providers";  // New import

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
        <Providers>  {/* Wrap children here */}
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}