import { NextRequest, NextResponse } from "next/server";

// POST /api/ai  { question: string }
export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    // IMPORTANT: we'll set this in the NEXT step
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server is missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    // Call an OpenAI-compatible chat endpoint
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a friendly financial education assistant for South African consumers. Keep answers short, plain-English, and general. Do NOT give regulated financial advice. Add: 'This is general info, not financial advice.' at the end.",
          },
          { role: "user", content: question },
        ],
        temperature: 0.2,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json(
        { error: `Upstream error: ${text.slice(0, 200)}` },
        { status: 500 }
      );
    }

    const data = await resp.json();
    const answer =
      data?.choices?.[0]?.message?.content ??
      "Sorry, I couldn’t generate a response.";

    return NextResponse.json({ answer });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
