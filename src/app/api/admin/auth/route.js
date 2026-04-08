import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const payload = await request.json();
    const password = payload?.password;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { ok: false, message: "ADMIN_PASSWORD is not configured." },
        { status: 500 },
      );
    }

    if (typeof password !== "string" || !password.trim()) {
      return NextResponse.json(
        { ok: false, message: "Password is required." },
        { status: 400 },
      );
    }

    if (password === adminPassword) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { ok: false, message: "Incorrect password." },
      { status: 401 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 },
    );
  }
}
