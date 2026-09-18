import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name || "upload";
    const ext = path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_\-]/g, "_");
    const uniqueName = `${Date.now()}-${baseName}${ext}`;

    const isPdf = ext === ".pdf" || file.type === "application/pdf";
    const isImage = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"].includes(ext);

    if (!isPdf && !isImage) {
      return NextResponse.json(
        { error: "Unsupported file type. Only images and PDF files are allowed." },
        { status: 400 }
      );
    }

    const subDir = isPdf ? "documents" : "images";
    const uploadDir = path.join(process.cwd(), "public", "uploads", subDir);
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${subDir}/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: originalName,
      size: file.size,
      type: isPdf ? "document" : "image",
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "File upload failed" },
      { status: 500 }
    );
  }
}
