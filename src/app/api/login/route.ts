import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { code, name, email } = await req.json();

    const ACCESS_CODE = process.env.ACCESS_CODE;
    const AUTH_SECRET = process.env.AUTH_SECRET;

    if (!ACCESS_CODE || !AUTH_SECRET) {
      return NextResponse.json(
        { error: "Server missing ACCESS_CODE or AUTH_SECRET" },
        { status: 500 }
      );
    }

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Missing access code" }, { status: 400 });
    }

    if (code !== ACCESS_CODE) {
      return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(AUTH_SECRET);
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 60 * 60 * 24 * 7;

    const token = await new SignJWT({
      sub: "ifa360-user",
      name: name || "User",
      email: email || undefined,
      iat: now,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(exp)
      .sign(secret);

    const res = NextResponse.json({ ok: true });
    res.cookies.set("ifa360_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
