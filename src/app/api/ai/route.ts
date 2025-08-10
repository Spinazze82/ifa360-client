// File: src/app/api/ai/route.ts
import { NextRequest, NextResponse } from "next/server";

// POST /api/ai   { question: string }
export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server is missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 350,
        messages: [
          {
            role: "system",
            content: [
              "You are a friendly financial EDUCATION assistant for South African consumers.",
              "ALWAYS answer in concise plain-English, ideally 4–7 bullet points.",
              "If the question is vague, first ask ONE clarifying question.",
              "If the user requests regulated/personalised advice, give general guidance only and suggest speaking to a licensed adviser.",
              "Use South African context (POPIA, TFSA, Rands).",
              "Use Rands (R) for any amounts.",
              "End every answer with: 'This is general info, not financial advice.'",
            ].join(" "),
          },
          {
            role: "user",
            content: [
              "Question:",
              question,
              "",
              "Context:",
              "- Country: South Africa.",
              "- Common products: life cover, disability, income protection, gap cover, funeral cover, TFSA, RA, unit trusts.",
              "- Keep it short, clear, and practical.",
            ].join("\n"),
          },
        ],
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json(
        { error: `Upstream error: ${text.slice(0, 300)}` },
        { status: 500 }
      );
    }

    const data = await resp.json();
    const answer =
      data?.choices?.[0]?.message?.content ??
      "Sorry, I couldn’t generate a response. Please try again.";

    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
