// File: src/app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "IFA360 — Customer",
  description: "Quotes, education, projections, and portfolio tools.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        {/* Header */}
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
            <Link href="/" className="font-bold text-lg">
              IFA360
            </Link>

            <nav className="flex gap-4 text-sm">
              <Link href="/quotes" className="hover:underline">Get Quotes</Link>
              <Link href="/projection" className="hover:underline">Projection</Link>
              <Link href="/education" className="hover:underline">Education</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
              <Link href="/astute" className="hover:underline">Astute</Link>
            </nav>
          </div>
        </header>

        {/* Page */}
        <main className="min-h-[calc(100vh-120px)]">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-100 border-t p-4 text-center text-sm">
          © {new Date().getFullYear()} IFA360. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
