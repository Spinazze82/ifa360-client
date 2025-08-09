import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "IFA360",
  description: "Customer portal with quotes, tools, and education",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white shadow-md">
          <div className="container mx-auto flex items-center justify-between p-4">
            <Link href="/" className="text-lg font-bold">
              IFA360
            </Link>
            <nav className="flex gap-4">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/quotes" className="hover:underline">
                Quotes
              </Link>
              <Link href="/budget" className="hover:underline">
                Budget Tools
              </Link>
              <Link href="/education" className="hover:underline">
                Education
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
              <Link href="/privacy" className="hover:underline">
                Privacy
              </Link>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 container mx-auto p-4">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-100 border-t p-4 text-center text-sm">
          © {new Date().getFullY
