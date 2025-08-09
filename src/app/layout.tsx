import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "IFA360 — Customer Portal",
  description: "Customer portal with quotes, tools, and education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        {/* Header */}
        <header className="bg-blue-600 text-white shadow-md">
          <div className="mx-auto max-w-6xl flex items-center justify-between p-4">
            <Link href="/" className="text-lg font-bold">
              IFA360
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/quotes" className="hover:underline">Quotes</Link>
              <Link href="/budget" className="hover:underline">Budget Tools</Link>
              <Link href="/education" className="hover:underline">Education</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
              <Link href="/privacy" className="hover:underline">Privacy</Link>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 mx-auto max-w-6xl p-4">{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t">
          <div className="mx-auto max-w-6xl p-4 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} IFA360. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
