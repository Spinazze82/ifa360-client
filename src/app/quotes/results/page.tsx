"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {
  return (
    <Suspense fallback={<main className="p-8">Loading…</main>}>
      <ResultsInner />
    </Suspense>
  );
}

function ResultsInner() {
  const sp = useSearchParams();

  const name = sp.get("name") ?? "";
  const ageStr = sp.get("age") ?? "";
  const smoker = sp.get("smoker") ?? "no";
  const coverStr = sp.get("cover") ?? "";

  const age = Number(ageStr);
  const cover = Number(coverStr);

  // Demo estimate (placeholder — not real pricing)
  const estimate = useMemo(() => {
    if (Number.isNaN(age) || Number.isNaN(cover) || cover <= 0 || age < 18) return null;
    const units = cover / 100_000;
    const basePerUnit = 45;
    const ageFactor = 1 + Math.max(0, age - 30) * 0.02;
    const smokerFactor = smoker === "yes" ? 1.6 : 1.0;
    return Math.round(units * basePerUnit * ageFactor * smokerFactor);
  }, [age, cover, smoker]);

  // Lead capture (posts to Formspree)
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("https://formspree.io/f/movlyeqe", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          form: "lead",
          name,
          age: ageStr,
          smoker,
          cover: coverStr,
          estimatedPremium: estimate !== null ? `R${estimate}` : "-",
          clientEmail,
          clientPhone,
          source: "ifa360-customer-site",
        }),
      });

      if (res.ok) {
        setStatus("ok");
        setClientEmail("");
        setClientPhone("");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Your Quote Preview</h1>
      <p className="mt-2 text-gray-600">
        This is a demo estimate to help you compare options. Not financial advice.
      </p>

      <div className="mt-6 space-y-2 rounded border p-4 bg-white">
        <div><span className="font-medium">Name:</span> {name || "—"}</div>
        <div><span className="font-medium">Age:</span> {ageStr || "—"}</div>
        <div><span className="font-medium">Smoker:</span> {smoker}</div>
        <div><span className="font-medium">Cover:</span> {coverStr ? `R${coverStr}` : "—"}</div>
      </div>

      <div className="mt-6 rounded border p-4 bg-white">
        {estimate !== null ? (
          <p className="text-xl">
            <span className="font-semibold">Estimated monthly premium:</span> R{estimate}
          </p>
        ) : (
          <p>Please provide name, age, smoker status, and cover amount.</p>
        )}
      </div>

      {/* Lead Capture */}
      <section className="mt-8 rounded border p-4 bg-white">
        <h2 className="text-2xl font-semibold">Talk to an adviser</h2>
        <p className="mt-1 text-gray-600">
          Share your contact details and we’ll get an authorised adviser to contact you.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium">Your email</label>
            <input
              type="email"
              className="mt-1 w-full rounded border p-2"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium">Your phone</label>
            <input
              type="tel"
              className="mt-1 w-full rounded border p-2"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="e.g. 082 123 4567"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send my details to an adviser"}
            </button>
            {status === "ok" && (
              <p className="text-sm text-green-700 mt-2">
                Thanks! An adviser will contact you shortly.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-700 mt-2">{errorMsg}</p>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
