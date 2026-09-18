import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { projects: true },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
