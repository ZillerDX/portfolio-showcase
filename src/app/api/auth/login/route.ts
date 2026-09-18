import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, setAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid administrator password" },
        { status: 401 }
      );
    }

    await setAdminSession();

    return NextResponse.json({ success: true, message: "Logged in successfully" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
