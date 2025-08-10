// File: src/app/astute/page.tsx
"use client";

import { useState } from "react";

function formatDate(d = new Date()) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export default function AstuteApiPage() {
  const [clientName, setClientName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [consent, setConsent] = useState(false);

  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function fetchFromAstute() {
    try {
      setError("");
      if (!clientName || !idNumber) {
        setError("Please enter your full name and ID number.");
        return;
      }
      if (!consent) {
        setError("Please tick the consent checkbox to proceed.");
        return;
      }
      setStatus("working");

      // Call our server route which (later) calls Astute FSE and streams back a PDF.
      const resp = await fetch("/api/astute/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          idNumber,
          email,
          mobile,
          consent: true,
          ts: Date.now(),
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Astute download failed.");
      }

      // Get PDF bytes and download
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Astute-Portfolio-${clientName.replace(/[^\w\-]+/g, "_")}-${formatDate()
        .replace(/\s/g, "-")
        .replace(/,/g, "")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setStatus("done");
    } catch (e: unknown) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Astute Portfolio (API)</h1>
      <p className="mt-2 text-gray-600">
        This will fetch your consolidated portfolio via our Astute integration and let you download it as a PDF.
      </p>

      <section className="mt-6 rounded border bg-white p-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Full name</label>
            <input
              className="mt-1 w-full rounded border p-2"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Thabo Mkhize"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">South African ID number</label>
            <input
              className="mt-1 w-full rounded border p-2"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="13 digits"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email (optional)</label>
            <input
              type="email"
              className="mt-1 w-full rounded border p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Mobile (optional)</label>
            <input
              className="mt-1 w-full rounded border p-2"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. 082 123 4567"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            I consent to my information being used to request my portfolio from Astute and to receive a PDF copy. This is
            for information only and does not constitute financial advice.
          </span>
        </label>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchFromAstute}
            disabled={status === "working"}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {status === "working" ? "Fetching…" : "Fetch from Astute"}
          </button>
          {status === "done" && <span className="text-green-700 text-sm">Downloaded.</span>}
          {status === "error" && <span className="text-red-700 text-sm">{error}</span>}
        </div>

        <p className="text-xs text-gray-500">
          Note: Real API access requires your firm to be onboarded with Astute FSE and use server-side credentials. This page is wired
          for that flow; today it returns a demo PDF until credentials are provided.
        </p>
      </section>
    </main>
  );
}
