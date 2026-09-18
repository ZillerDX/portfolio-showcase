import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const certificate = await db.certificate.findUnique({
      where: { id: params.id },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(certificate);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch certificate" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const existing = await db.certificate.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    const skillsJson = Array.isArray(skills)
      ? JSON.stringify(skills)
      : typeof skills === "string"
      ? JSON.stringify(skills.split(",").map((s: string) => s.trim()).filter(Boolean))
      : existing.skillsJson;

    const updated = await db.certificate.update({
      where: { id: params.id },
      data: {
        title: title !== undefined ? title : existing.title,
        issuer: issuer !== undefined ? issuer : existing.issuer,
        issueDate: issueDate !== undefined ? issueDate : existing.issueDate,
        expiryDate: expiryDate !== undefined ? expiryDate : existing.expiryDate,
        credentialId: credentialId !== undefined ? credentialId : existing.credentialId,
        credentialUrl: credentialUrl !== undefined ? credentialUrl : existing.credentialUrl,
        description: description !== undefined ? description : existing.description,
        skillsJson,
        fileUrl: fileUrl !== undefined ? fileUrl : existing.fileUrl,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : existing.sortOrder,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("Update certificate error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update certificate" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const existing = await db.certificate.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    await db.certificate.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete certificate error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete certificate" },
      { status: 500 }
    );
  }
}
