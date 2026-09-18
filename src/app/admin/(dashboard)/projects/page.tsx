"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProjectData, CategoryData } from "@/types";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Sparkles,
  ExternalLink,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export default function AdminProjectsListPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<ProjectData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects?admin=true");
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);

      const catRes = await fetch("/api/categories");
      const catData = await catRes.json();
      if (Array.isArray(catData)) setCategories(catData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/projects/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error("Failed to delete project", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleStatus = async (project: ProjectData, field: "isPublished" | "isFeatured") => {
    const updatedVal = !project[field];
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: updatedVal }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, [field]: updatedVal } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = projects.filter((p) => {
    if (categoryFilter !== "all" && p.category?.slug !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Project Showcase Repository
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage, publish, and reorder all portfolio works and dossiers.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity active:scale-[0.98] shadow-xs"
        >
          <PlusCircle className="size-4 shrink-0" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex items-center flex-1">
          <Search className="absolute left-3 size-4 text-zinc-400 pointer-events-none shrink-0" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4">Project</th>
                <th className="p-4">Category</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Published</th>
                <th className="p-4">PDF Whitepaper</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500">
                    Loading projects...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500">
                    No projects found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-11 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shrink-0">
                          <img
                            src={p.coverImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                            {p.title}
                          </div>
                          <div className="font-mono text-[11px] text-zinc-400">
                            /{p.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-zinc-600 dark:text-zinc-300">
                      {p.category?.name}
                    </td>

                    {/* Featured toggle */}
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(p, "isFeatured")}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                          p.isFeatured
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 bg-zinc-100 dark:bg-zinc-800"
                        }`}
                      >
                        <Sparkles className="size-3 shrink-0" />
                        <span>{p.isFeatured ? "Featured" : "Standard"}</span>
                      </button>
                    </td>

                    {/* Published toggle */}
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(p, "isPublished")}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                          p.isPublished
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 bg-zinc-100 dark:bg-zinc-800"
                        }`}
                      >
                        {p.isPublished ? (
                          <>
                            <Check className="size-3 shrink-0" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <X className="size-3 shrink-0" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* PDF */}
                    <td className="p-4">
                      {p.pdfFile ? (
                        <a
                          href={p.pdfFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500 transition-colors font-mono text-[11px]"
                        >
                          <FileText className="size-3.5 shrink-0 text-blue-500" />
                          <span>View PDF</span>
                        </a>
                      ) : (
                        <span className="text-zinc-400 text-[11px]">No file</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/project/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          title="Preview public"
                        >
                          <Eye className="size-3.5 shrink-0" />
                        </Link>
                        <Link
                          href={`/admin/projects/${p.id}`}
                          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          title="Edit"
                        >
                          <Edit className="size-3.5 shrink-0" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="size-3.5 shrink-0" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        maxWidth="sm"
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-600 shrink-0">
              <AlertTriangle className="size-5 shrink-0" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Delete &ldquo;{deleteTarget?.title}&rdquo;?
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                This action cannot be undone. The project, attached media, and related links will be permanently removed.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              loading={isDeleting}
            >
              Delete Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
