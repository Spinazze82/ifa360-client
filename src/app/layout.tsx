// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IFA360 — Customer Portal",
  description: "Customer-facing portal for insurance quotes and tools",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navigation Bar (blue) */}
        <nav className="bg-blue-600 p-4 text-white">
          <ul className="container flex space-x-6">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/quotes" className="hover:underline">Get Quotes</Link></li>
            <li><Link href="/projection" className="hover:underline">Projection</Link></li>
          </ul>
        </nav>

        {/* Main Page Content */}
        <main className="container py-8">{children}</main>
      </body>
    </html>
  );
}
