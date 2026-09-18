import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Search by ID or by slug
    const project = await db.project.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        links: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const authed = await isAuthenticated();
    if (!project.isPublished && !authed) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch project" },
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

    const { id } = params;
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

    const existing = await db.project.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let finalSlug = existing.slug;
    if (customSlug && customSlug !== existing.slug) {
      finalSlug = slugify(customSlug);
      const duplicate = await db.project.findFirst({
        where: { slug: finalSlug, NOT: { id } },
      });
      if (duplicate) {
        finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const tagsJson = Array.isArray(tags)
      ? JSON.stringify(tags)
      : typeof tags === "string"
      ? JSON.stringify(tags.split(",").map((t: string) => t.trim()).filter(Boolean))
      : existing.tagsJson;

    // Execute update with transaction to safely update images and links
    const updated = await db.$transaction(async (tx) => {
      // Clear old images & links if arrays are provided
      if (Array.isArray(images)) {
        await tx.projectImage.deleteMany({ where: { projectId: id } });
      }
      if (Array.isArray(links)) {
        await tx.projectLink.deleteMany({ where: { projectId: id } });
      }

      return tx.project.update({
        where: { id },
        data: {
          title: title ?? existing.title,
          slug: finalSlug,
          summary: summary ?? existing.summary,
          contentMarkdown: contentMarkdown ?? existing.contentMarkdown,
          coverImage: coverImage ?? existing.coverImage,
          pdfFile: pdfFile !== undefined ? pdfFile : existing.pdfFile,
          categoryId: categoryId ?? existing.categoryId,
          tagsJson,
          isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
          isPublished: isPublished !== undefined ? Boolean(isPublished) : existing.isPublished,
          sortOrder: sortOrder !== undefined ? Number(sortOrder) : existing.sortOrder,
          projectDate: projectDate !== undefined ? projectDate : existing.projectDate,
          images: Array.isArray(images)
            ? {
                create: images.map((img: any, idx: number) => ({
                  imageUrl: img.imageUrl || img,
                  caption: img.caption || null,
                  sortOrder: img.sortOrder ?? idx,
                })),
              }
            : undefined,
          links: Array.isArray(links)
            ? {
                create: links.map((lnk: any) => ({
                  label: lnk.label,
                  url: lnk.url,
                  type: lnk.type || "external",
                })),
              }
            : undefined,
        },
        include: {
          category: true,
          images: true,
          links: true,
        },
      });
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("Update project error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update project" },
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

    const { id } = params;
    await db.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete project" },
      { status: 500 }
    );
  }
}
