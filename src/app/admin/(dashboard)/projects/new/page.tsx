import React from "react";
import { db } from "@/lib/db";
import { ProjectForm } from "@/components/admin/project-form";
import { CategoryData } from "@/types";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Create New Project
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Add an engineering project, cover preview, PDF whitepaper, and case study.
        </p>
      </div>

      <ProjectForm categories={categories as unknown as CategoryData[]} />
    </div>
  );
}
