"use client";
import { useMemo, useState } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const name = (searchParams.name as string) || "";
  const ageStr = (searchParams.age as string) || "";
  const smoker = (searchParams.smoker as string) || "no";
  const coverStr = (searchParams.cover as string) || "";

  const age = Number(ageStr);
  const cover = Number(coverStr);

  // Simple demo estimate (placeholder — not real pricing)
  const estimate = useMemo(() => {
    if (Number.isNaN(age) || Number.isNaN(cover) || cover <= 0 || age < 18) return null;
    const units = cover / 100_000;
    const basePerUnit = 45; // demo only
    const ageFactor = 1 + Math.max(0, age - 30) * 0.02;
    const smokerFactor = smoker === "yes" ? 1.6 : 1.0;
    return Math.round(units * basePerUnit * ageFactor * smokerFactor);
  }, [age, cover, smoker]);

  // Lead capture (no backend yet): mailto handoff
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const mailtoHref = useMemo(() => {
    const to = "leads@yourdomain.co.za"; // <-- change this later to your email
    const subject = encodeURIComponent("New IFA360 Lead: Quote request");
    const body = encodeURIComponent(
      [
        "New client lead details:",
        `Name: ${name || "-"}`,
        `Email: ${clientEmail || "-"}`,
        `Phone: ${clientPhone || "-"}`,
        `Age: ${ageStr || "-"}`,
        `Smoker: ${smoker}`,
        `Cover: ${coverStr ? "R" + coverStr : "-"}`,
        `Estimated premium (demo): ${estimate !== null ? "R" + estimate : "-"}`,
        "",
        "— Sent from IFA360 Customer Site",
      ].join("\n")
    );
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }, [name, clientEmail, clientPhone, ageStr, smoker, coverStr, estimate]);

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

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium">Your email</label>
            <input
              type="email"
              className="mt-1 w-full rounded border p-2"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="you@example.com"
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
            />
          </div>
        </div>

        <div className="mt-4">
          <a
            href={mailtoHref}
            className="inline-block rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Send my details to an adviser
          </a>
          <p className="mt-2 text-xs text-gray-500">
            Clicking will open your email app with the details pre-filled. You can review and send.
          </p>
        </div>
      </section>
    </main>
  );
}
