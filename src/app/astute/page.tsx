// File: src/app/astute/page.tsx
"use client";

import { useState } from "react";

function formatDate(d = new Date()) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export default function AstutePage() {
  const [clientName, setClientName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    if (f && f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      setFile(null);
      return;
    }
    if (f && f.size > 15 * 1024 * 1024) {
      setError("File is too large (max 15MB).");
      setFile(null);
      return;
    }
    setError("");
    setFile(f);
  }

  async function makeBrandedPdf() {
    try {
      if (!file) return setError("Please upload your Astute PDF first.");
      if (!consent) return setError("Please tick the consent checkbox to proceed.");
      setStatus("working");
      setError("");
      setDownloadUrl(null);

      // Dynamic import avoids SSR/bundling hiccups
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

      const arrayBuf = await file.arrayBuffer();

      // Load client PDF (password-protected PDFs will fail)
      const astuteDoc = await PDFDocument.load(arrayBuf).catch(() => {
        throw new Error("Could not read the PDF. If it’s password-protected, please export an unprotected copy.");
      });

      // Create wrapper
      const outDoc = await PDFDocument.create();
      const font = await outDoc.embedFont(StandardFonts.Helvetica);

      // A4 cover page
      const cover = outDoc.addPage([595.28, 841.89]);
      const { width, height } = cover.getSize();

      cover.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.09, 0.29, 0.6) });
      cover.drawText("Portfolio Pack", { x: 40, y: height - 50, size: 22, color: rgb(1, 1, 1), font });

      const lineY = height - 120;
      cover.drawText(`Client: ${clientName || "—"}`, { x: 40, y: lineY, size: 14, font, color: rgb(0, 0, 0) });
      cover.drawText(`ID: ${idNumber || "—"}`, { x: 40, y: lineY - 22, size: 12, font, color: rgb(0, 0, 0) });
      cover.drawText(`Generated: ${formatDate()}`, { x: 40, y: lineY - 44, size: 12, font, color: rgb(0, 0, 0) });

      const note =
        "This pack contains the client’s Astute portfolio PDF. It is provided for information only and does not constitute financial advice.";
      cover.drawText(note, {
        x: 40,
        y: lineY - 84,
        size: 11,
        font,
        color: rgb(0.2, 0.2, 0.2),
        maxWidth: width - 80,
        lineHeight: 14,
      });

      // Append Astute pages
      const copied = await outDoc.copyPages(astuteDoc, astuteDoc.getPageIndices());
      copied.forEach((p) => outDoc.addPage(p));

      // Save to blob (force a fresh ArrayBuffer to satisfy TS)
      const bytes = await outDoc.save(); // Uint8Array
      const copy = new Uint8Array(bytes);
      const blob = new Blob([copy.buffer], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("done");
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : "Could not build the PDF. Please ensure the upload is a valid, unprotected PDF.";
      console.error(e);
      setError(message);
      setStatus("error");
    }
  }

  function safeFileName(name: string) {
    return name.replace(/[^\w\-]+/g, "_");
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Astute Portfolio</h1>
      <p className="mt-2 text-gray-600">
        Download your portfolio from Astute, upload it here, and we’ll generate a branded PDF pack (cover page + your document).
      </p>

      {/* How-to */}
      <section className="mt-6 rounded border bg-white p-4">
        <h2 className="text-xl font-semibold">Steps</h2>
        <ol className="list-decimal ml-5 mt-3 space-y-2 text-sm">
          <li>
            Visit the Astute portal and sign in (opens in a new tab):{" "}
            <a className="text-blue-700 underline" href="https://www.astutefs.co.za/" target="_blank" rel="noreferrer">
              astutefs.co.za
            </a>
          </li>
          <li>Generate your consolidated portfolio report and download it as a PDF.</li>
          <li>Return here, complete your details, and upload the PDF below.</li>
          <li>Click <span className="font-medium">Create PDF pack</span> to download your branded document.</li>
        </ol>
        <p className="text-xs text-gray-500 mt-3">
          We never ask for your Astute credentials. You download from Astute directly and upload the PDF here.
        </p>
      </section>

      {/* Form */}
      <section className="mt-6 rounded border bg-white p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">Your full name</label>
          <input
            className="mt-1 w-full rounded border p-2"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="e.g. Thabo Mkhize"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">ID number (optional)</label>
          <input
            className="mt-1 w-full rounded border p-2"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="13 digits"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Upload Astute PDF</label>
          <input type="file" accept="application/pdf" className="mt-1" onChange={onFileChange} />
          {file && (
            <p className="text-xs text-gray-500 mt-1">
              Selected: <span className="font-medium">{file.name}</span> ({Math.round(file.size / 1024)} KB)
            </p>
          )}
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            I consent to processing my uploaded portfolio document to create a single PDF pack. This is for information only and does not constitute financial advice.
          </span>
        </label>

        <div className="flex items-center gap-3">
          <button
            onClick={makeBrandedPdf}
            disabled={status === "working"}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {status === "working" ? "Creating…" : "Create PDF pack"}
          </button>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`Astute-Portfolio-Pack-${safeFileName(clientName || "Client")}-${formatDate().replace(/\s/g, "-")}.pdf`}
              className="rounded border px-4 py-2 hover:bg-gray-50"
            >
              Download PDF
            </a>
          )}
        </div>

        {status === "error" && <p className="text-sm text-red-700">{error}</p>}
        {status === "done" && <p className="text-sm text-green-700">PDF ready — click Download.</p>}
      </section>

      <p className="mt-4 text-xs text-gray-500">
        POPIA notice: Files are processed locally in your browser for this feature. Do not upload documents on public/shared devices.
      </p>
    </main>
  );
}
