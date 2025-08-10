"use client";

import { useState } from "react";

export default function Page() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("https://formspree.io/f/movlyeqe", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          form: "register",
          fullName,
          email,
          mobile,
          notes,
          source: "ifa360-customer-site",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("ok");
      setFullName("");
      setEmail("");
      setMobile("");
      setNotes("");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Register</h1>
      <p className="mt-2 text-gray-600">
        Request access to the full suite (Quotes, Projection, Astute). We’ll email you an Access Code.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input className="mt-1 w-full rounded border p-2" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" className="mt-1 w-full rounded border p-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Mobile (optional)</label>
          <input className="mt-1 w-full rounded border p-2" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Notes (optional)</label>
          <textarea rows={4} className="mt-1 w-full rounded border p-2" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {status === "sending" ? "Submitting…" : "Request Access"}
        </button>

        {status === "ok" && <p className="text-sm text-green-700">Thanks — we’ll email you an Access Code.</p>}
        {status === "error" && <p className="text-sm text-red-700">{error}</p>}
      </form>
    </main>
  );
}
