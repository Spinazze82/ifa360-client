import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "IFA360 — Customer",
  description: "Smarter insurance decisions, in minutes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        {/* Top bar with tabs (like pic 2) */}
        <header className="border-b bg-white">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-tight">IFA360</Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/quotes" className="hover:underline">Get Quotes</Link>
              <Link href="/projection" className="hover:underline">Projection</Link>
            </nav>
          </div>
        </header>

        <main className="min-h-[calc(100vh-128px)] bg-gray-50">{children}</main>

        <footer className="border-t bg-white">
          <div className="container h-16 flex items-center justify-between text-sm text-gray-600">
            <span>© {new Date().getFullYear()} IFA360</span>
            <span className="hidden sm:inline">Simple comparisons. Clear decisions.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
