import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IFA360 — Customer Portal",
  description: "Customer-facing portal for insurance quotes, tools, and education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {/* Top Navigation */}
        <nav className="bg-blue-600 text-white">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex h-14 items-center justify-between">
              <Link href="/" className="font-semibold tracking-wide">
                IFA360
              </Link>
              <ul className="flex items-center gap-6 text-sm">
                <li><Link href="/" className="hover:underline">Home</Link></li>
                <li><Link href="/quotes" className="hover:underline">Get Quotes</Link></li>
                <li><Link href="/budget" className="hover:underline">Budget Tools</Link></li>
                <li><Link href="/education" className="hover:underline">Education</Link></li>
                <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="min-h-[70vh]">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-10 border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-600">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} IFA360. All rights reserved.</p>
              <div className="flex gap-4">
                <Link href="/education" className="hover:underline">Education</Link>
                <Link href="/contact" className="hover:underline">Contact</Link>
                <Link href="/privacy" className="hover:underline">Privacy</Link>
              </div>
            </div>
            <p className="mt-3 text-xs">
              Demo site — estimates are illustrative only and not financial advice.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
