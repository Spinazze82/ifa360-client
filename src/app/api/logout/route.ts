import { NextResponse } from "next/server";

export function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("ifa360_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
