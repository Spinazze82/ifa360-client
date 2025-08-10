// File: src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");
  const [error, setError] = useState("");
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("working");
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, code }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Login failed.");
        setStatus("error");
        return;
      }

      router.replace(next);
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <main className="p-8 max-w-sm mx-auto">
      <h1 className="text-3xl font-bold">Login</h1>
      <p className="mt-2 text-gray-600">Enter your Access Code to continue.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Name (optional)</label>
          <input
            className="mt-1 w-full rounded border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email (optional)</label>
          <input
            type="email"
            className="mt-1 w-full rounded border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Access Code</label>
          <input
            className="mt-1 w-full rounded border p-2"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === "working"}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60 w-full"
        >
          {status === "working" ? "Signing in…" : "Sign in"}
        </button>

        {status === "error" && <p className="text-sm text-red-700">{error}</p>}

        <p className="text-sm text-gray-600">
          Don’t have an Access Code?{" "}
          <a href="/register" className="text-blue-700 underline">
            Register
          </a>.
        </p>
      </form>
    </main>
  );
}
