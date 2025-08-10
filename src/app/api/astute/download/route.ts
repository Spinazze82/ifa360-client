// File: src/app/api/astute/download/route.ts
import { NextRequest } from "next/server";

// Force Node runtime for pdf-lib
export const runtime = "nodejs";
// Avoid caching
export const dynamic = "force-dynamic";

type Payload = {
  clientName?: string;
  idNumber?: string;
  email?: string;
  mobile?: string;
  consent?: boolean;
  ts?: number;
};

// In production, replace the function below with a call to Astute FSE:
//
// 1) Ensure you are contracted/onboarded with Astute FSE.
// 2) Store credentials in env: ASTUTE_CLIENT_ID / ASTUTE_CLIENT_SECRET / etc.
// 3) Call their Consolidated Client Portfolio service (server-side only).
// 4) Receive PDF bytes and stream them back in the response below.
async function fetchAstutePdfDemo(payload: Payload): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);

  // Cover
  const page = doc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.09, 0.29, 0.6) });
  page.drawText("Astute Portfolio (Demo)", { x: 40, y: height - 50, size: 22, color: rgb(1, 1, 1), font });

  const lineY = height - 120;
  page.drawText(`Client: ${payload.clientName || "—"}`, { x: 40, y: lineY, size: 14, font, color: rgb(0, 0, 0) });
  page.drawText(`ID: ${payload.idNumber || "—"}`, { x: 40, y: lineY - 22, size: 12, font, color: rgb(0, 0, 0) });
  page.drawText(`Generated: ${new Date().toLocaleString()}`, { x: 40, y: lineY - 44, size: 12, font, color: rgb(0, 0, 0) });

  const note =
    "This is a placeholder PDF. Once Astute API credentials are configured, this endpoint will return the actual consolidated portfolio PDF.";
  page.drawText(note, {
    x: 40,
    y: lineY - 84,
    size: 11,
    font,
    color: rgb(0.2, 0.2, 0.2),
    maxWidth: width - 80,
    lineHeight: 14,
  });

  return await doc.save(); // Uint8Array
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as Payload;

    if (!payload?.consent) {
      return new Response("Consent is required.", { status: 400 });
    }
    if (!payload?.clientName || !payload?.idNumber) {
      return new Response("Missing required fields.", { status: 400 });
    }

    // TODO: Plug in real Astute call here (server-side only).
    const pdfBytes = await fetchAstutePdfDemo(payload);

    // Build a fresh ArrayBuffer for Blob compatibility
    const copy = new Uint8Array(pdfBytes);
    const buf = copy.buffer;

    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Astute-Portfolio-${(payload.clientName || "Client")
          .replace(/[^\w\-]+/g, "_")}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected server error.";
    return new Response(message, { status: 500 });
  }
}
