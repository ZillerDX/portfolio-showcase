import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const categorySlug = searchParams.get("category");
    const featured = searchParams.get("featured");
    const adminMode = searchParams.get("admin") === "true";

    const authed = await isAuthenticated();
    
    // Non-admin can only see published projects
    const whereClause: any = {};
    if (!authed || !adminMode) {
      whereClause.isPublished = true;
    }

    if (categorySlug && categorySlug !== "all") {
      whereClause.category = {
        slug: categorySlug,
      };
    }

    if (featured === "true") {
      whereClause.isFeatured = true;
    }

    if (search && search.trim() !== "") {
      const q = search.trim();
      whereClause.OR = [
        { title: { contains: q } },
        { summary: { contains: q } },
        { tagsJson: { contains: q } },
      ];
    }

    const projects = await db.project.findMany({
      where: whereClause,
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        links: true,
      },
    });

    return NextResponse.json(projects);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch projects" },
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
      slug: customSlug,
      summary,
      contentMarkdown,
      coverImage,
      pdfFile,
      categoryId,
      tags,
      isFeatured,
      isPublished,
      sortOrder,
      projectDate,
      images,
      links,
    } = body;

    if (!title || !summary || !categoryId || !coverImage) {
      return NextResponse.json(
        { error: "Title, summary, category, and cover image are required." },
        { status: 400 }
      );
    }

    let finalSlug = customSlug ? slugify(customSlug) : slugify(title);
    // Ensure unique slug
    const existing = await db.project.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const tagsJson = Array.isArray(tags)
      ? JSON.stringify(tags)
      : typeof tags === "string"
      ? JSON.stringify(tags.split(",").map((t: string) => t.trim()).filter(Boolean))
      : "[]";

    const project = await db.project.create({
      data: {
        title,
        slug: finalSlug,
        summary,
        contentMarkdown: contentMarkdown || "",
        coverImage,
        pdfFile: pdfFile || null,
        categoryId,
        tagsJson,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        sortOrder: sortOrder ? Number(sortOrder) : 0,
        projectDate: projectDate || null,
        images: {
          create: Array.isArray(images)
            ? images.map((img: any, idx: number) => ({
                imageUrl: img.imageUrl || img,
                caption: img.caption || null,
                sortOrder: img.sortOrder ?? idx,
              }))
            : [],
        },
        links: {
          create: Array.isArray(links)
            ? links.map((lnk: any) => ({
                label: lnk.label,
                url: lnk.url,
                type: lnk.type || "external",
              }))
            : [],
        },
      },
      include: {
        category: true,
        images: true,
        links: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err: any) {
    console.error("Create project error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
