// File: src/app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "IFA360 — Customer",
  description: "Compare quotes and run simple investment projections.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container h-16 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-tight">IFA360</Link>
            <nav className="flex items-center gap-6">
              <Link href="/quotes" className="navlink">Get Quotes</Link>
              <Link href="/projection" className="navlink">Projection</Link>
              {/* Keep Privacy if you need it */}
              <Link href="/privacy" className="navlink">Privacy</Link>
            </nav>
          </div>
        </header>

        <main className="pb-16">{children}</main>

        <footer className="border-t" style={{borderColor: "var(--border)"}}>
          <div className="container h-16 flex items-center justify-between text-sm text-gray-600">
            <span>© {new Date().getFullYear()} IFA360</span>
            <span className="hidden sm:inline">Simple comparisons. Clear decisions.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
