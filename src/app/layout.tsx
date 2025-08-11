// File: src/app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "IFA360 — Customer",
  description: "Quotes and projections made simple.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        {/* Header */}
        <header className="border-b bg-white">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight">IFA360</Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/quotes" className="hover:underline">Get Quotes</Link>
              <Link href="/projection" className="hover:underline">Projection</Link>
            </nav>
          </div>
        </header>

        {/* Page */}
        <main className="min-h-[calc(100vh-128px)]">{children}</main>

        {/* Footer */}
        <footer className="border-t">
          <div className="container h-16 flex items-center justify-between text-sm text-gray-600">
            <span>© {new Date().getFullYear()} IFA360</span>
            <span className="hidden sm:inline">Simple comparisons. Clear decisions.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
