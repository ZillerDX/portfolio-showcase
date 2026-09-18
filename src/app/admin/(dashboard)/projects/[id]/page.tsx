import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProjectForm } from "@/components/admin/project-form";
import { ProjectData, CategoryData } from "@/types";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await db.project.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
      links: true,
    },
  });

  if (!project) {
    notFound();
  }

  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Edit Project: {project.title}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Modify technical specifications, update documents, or adjust publication status.
        </p>
      </div>

      <ProjectForm
        initialData={project as unknown as ProjectData}
        categories={categories as unknown as CategoryData[]}
        isEditing
      />
    </div>
  );
}
