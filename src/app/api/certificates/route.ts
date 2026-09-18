import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const certificates = await db.certificate.findMany({
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(certificates);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      credentialUrl,
      description,
      skills,
      fileUrl,
      sortOrder,
      isFeatured,
    } = body;

    if (!title || !issuer || !issueDate || !description) {
      return NextResponse.json(
        { error: "Title, issuer, issue date, and description are required." },
        { status: 400 }
      );
    }

    const skillsJson = Array.isArray(skills)
      ? JSON.stringify(skills)
      : typeof skills === "string"
      ? JSON.stringify(skills.split(",").map((s: string) => s.trim()).filter(Boolean))
      : "[]";

    const certificate = await db.certificate.create({
      data: {
        title,
        issuer,
        issueDate,
        expiryDate: expiryDate || null,
        credentialId: credentialId || null,
        credentialUrl: credentialUrl || null,
        description,
        skillsJson,
        fileUrl: fileUrl || null,
        sortOrder: sortOrder ? Number(sortOrder) : 0,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
      },
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (err: any) {
    console.error("Create certificate error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create certificate" },
      { status: 500 }
    );
  }
}
