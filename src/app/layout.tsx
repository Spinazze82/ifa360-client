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
      <body className="min-h-screen">
        {/* Sticky glass header */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[color:var(--panel)]/70 backdrop-blur-xl">
          <div className="container flex h-14 items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight text-white">
              IFA360
            </Link>

            <nav className="flex items-center gap-5 text-sm text-white/90">
              <Link href="/quotes" className="hoverline">Get Quotes</Link>
              <Link href="/projection" className="hoverline">Projection</Link>
              {/* Keep Privacy if you need it; remove if not */}
              <Link href="/privacy" className="hoverline">Privacy</Link>
            </nav>
          </div>
        </header>

        {/* Page */}
        <main className="pb-20">{children}</main>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-[color:var(--panel)]/60">
          <div className="container flex h-16 items-center justify-between text-sm text-white/70">
            <span>© {new Date().getFullYear()} IFA360</span>
            <span className="hidden sm:inline">Built for simple, fast financial decisions.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
