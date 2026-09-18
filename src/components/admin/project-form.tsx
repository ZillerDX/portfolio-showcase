"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectData, CategoryData, ProjectLinkData, ProjectImageData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Upload,
  FileText,
  Trash2,
  Plus,
  ArrowLeft,
  Eye,
  Edit3,
  Check,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

interface ProjectFormProps {
  initialData?: ProjectData;
  categories: CategoryData[];
  isEditing?: boolean;
}

export function ProjectForm({
  initialData,
  categories,
  isEditing = false,
}: ProjectFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || categories[0]?.id || ""
  );
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [contentMarkdown, setContentMarkdown] = useState(
    initialData?.contentMarkdown || ""
  );
  const [coverImage, setCoverImage] = useState(
    initialData?.coverImage || "/uploads/images/project-apex.svg"
  );
  const [pdfFile, setPdfFile] = useState<string | null>(
    initialData?.pdfFile || null
  );
  const [projectDate, setProjectDate] = useState(
    initialData?.projectDate || ""
  );
  const [sortOrder, setSortOrder] = useState<number>(
    initialData?.sortOrder ?? 0
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(
    initialData?.isFeatured ?? false
  );
  const [isPublished, setIsPublished] = useState<boolean>(
    initialData?.isPublished ?? true
  );

  // Tags
  let initialTags: string[] = [];
  try {
    initialTags = JSON.parse(initialData?.tagsJson || "[]");
  } catch {}
  const [tagsInput, setTagsInput] = useState(initialTags.join(", "));

  // Dynamic Links
  const [links, setLinks] = useState<ProjectLinkData[]>(
    initialData?.links || [
      { label: "Live Demo", url: "https://demo.example.com", type: "demo" },
      { label: "GitHub", url: "https://github.com/example", type: "github" },
    ]
  );

  // Dynamic Gallery Images
  const [images, setImages] = useState<ProjectImageData[]>(
    initialData?.images || []
  );

  // Markdown tab
  const [markdownTab, setMarkdownTab] = useState<"write" | "preview">("write");

  // Loading & error states
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File upload handler
  const handleFileUpload = async (
    file: File,
    type: "cover" | "pdf" | "gallery"
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      if (type === "cover") setUploadingCover(true);
      if (type === "pdf") setUploadingPdf(true);
      if (type === "gallery") setUploadingGallery(true);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (type === "cover") {
        setCoverImage(data.url);
      } else if (type === "pdf") {
        setPdfFile(data.url);
      } else if (type === "gallery") {
        setImages((prev) => [
          ...prev,
          { imageUrl: data.url, caption: file.name, sortOrder: prev.length },
        ]);
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload file");
    } finally {
      if (type === "cover") setUploadingCover(false);
      if (type === "pdf") setUploadingPdf(false);
      if (type === "gallery") setUploadingGallery(false);
    }
  };

  const handleAddLink = () => {
    setLinks((prev) => [
      ...prev,
      { label: "External Link", url: "https://", type: "external" },
    ]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateLink = (
    index: number,
    field: keyof ProjectLinkData,
    value: string
  ) => {
    setLinks((prev) =>
      prev.map((lnk, i) => (i === index ? { ...lnk, [field]: value } : lnk))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug: slug || undefined,
      categoryId,
      summary,
      contentMarkdown,
      coverImage,
      pdfFile,
      projectDate,
      sortOrder,
      isFeatured,
      isPublished,
      tags: tagsArray,
      links,
      images,
    };

    try {
      const endpoint = isEditing
        ? `/api/projects/${initialData?.id}`
        : "/api/projects";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save project");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="size-3.5 shrink-0" />
          <span>Back to Projects</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/projects")}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={saving}>
            <Check className="size-3.5 shrink-0" />
            <span>{isEditing ? "Update Project" : "Publish Project"}</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Card 1: Core Details */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-4">
        <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          General Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Project Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Apex — Modern Financial Analytics Terminal"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              URL Slug (Optional, auto-generated)
            </label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="apex-financial-analytics"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-9 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Completion Date / Period
            </label>
            <Input
              value={projectDate}
              onChange={(e) => setProjectDate(e.target.value)}
              placeholder="e.g. 2024-06 or Q2 2024"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Display Sort Order
            </label>
            <Input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500"
            />
            <span>Published (Visible to Public)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded border-zinc-300 dark:border-zinc-700 text-amber-600 focus:ring-amber-500"
            />
            <span>Featured Project (Highlighted in Hero Grid)</span>
          </label>
        </div>

        {/* Summary */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Project Summary (Brief snippet for cards) *
          </label>
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            placeholder="A concise 1-2 sentence description of the project..."
            required
          />
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Technologies & Tags (Comma separated)
          </label>
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Next.js, TypeScript, Tailwind CSS, WebGL, Go"
          />
        </div>
      </div>

      {/* Card 2: Cover Image & PDF Document Upload */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-6">
        <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Media & Document Attachments
        </h2>

        {/* Cover Image */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Cover Image (16:9 recommended) *
          </label>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 shrink-0">
              <img
                src={coverImage}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <Upload className="size-3.5 shrink-0" />
                  <span>{uploadingCover ? "Uploading..." : "Upload New Cover"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "cover");
                    }}
                    disabled={uploadingCover}
                  />
                </label>
              </div>

              <Input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="/uploads/images/cover.png or https://..."
                className="text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* PDF Document Upload */}
        <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Technical Dossier / Presentation Document (PDF)
            </label>
            {pdfFile && (
              <button
                type="button"
                onClick={() => setPdfFile(null)}
                className="text-xs text-red-500 hover:underline inline-flex items-center gap-1"
              >
                <Trash2 className="size-3 shrink-0" />
                <span>Remove PDF</span>
              </button>
            )}
          </div>

          {pdfFile ? (
            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <FileText className="size-5 shrink-0 text-blue-500" />
                <div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    PDF Attached
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 truncate max-w-xs sm:max-w-md">
                    {pdfFile}
                  </div>
                </div>
              </div>
              <a
                href={pdfFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Inspect
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 transition-colors">
                <Upload className="size-3.5 shrink-0" />
                <span>{uploadingPdf ? "Uploading PDF..." : "Upload Document (PDF)"}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, "pdf");
                  }}
                  disabled={uploadingPdf}
                />
              </label>
              <span className="text-xs text-zinc-400">
                Whitepapers, architecture diagrams, or slide decks (PDF)
              </span>
            </div>
          )}
        </div>

        {/* Gallery Upload */}
        <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Additional Gallery Screenshots ({images.length})
            </label>
            <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
              <Plus className="size-3.5 shrink-0" />
              <span>Add Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "gallery");
                }}
                disabled={uploadingGallery}
              />
            </label>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-video bg-zinc-950"
                >
                  <img
                    src={img.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImages((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="absolute top-1 right-1 p-1 rounded-md bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="size-3 shrink-0" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card 3: External Links */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            External Links & References
          </h2>
          <button
            type="button"
            onClick={handleAddLink}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline"
          >
            <Plus className="size-3.5 shrink-0" />
            <span>Add Link</span>
          </button>
        </div>

        <div className="space-y-3">
          {links.map((link, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
            >
              <Input
                value={link.label}
                onChange={(e) => handleUpdateLink(idx, "label", e.target.value)}
                placeholder="Label (e.g. Live Demo)"
                className="w-1/3 text-xs"
              />
              <Input
                value={link.url}
                onChange={(e) => handleUpdateLink(idx, "url", e.target.value)}
                placeholder="https://..."
                className="flex-1 text-xs"
              />
              <select
                value={link.type}
                onChange={(e) =>
                  handleUpdateLink(idx, "type", e.target.value as any)
                }
                className="h-9 px-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
              >
                <option value="demo">Demo</option>
                <option value="github">GitHub</option>
                <option value="article">Article / Paper</option>
                <option value="external">External</option>
              </select>
              <button
                type="button"
                onClick={() => handleRemoveLink(idx)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="size-3.5 shrink-0" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Card 4: Markdown In-Depth Specification */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Detailed Case Study & Architecture (Markdown)
            </h2>
            <p className="text-xs text-zinc-500">
              Document technical hurdles, architecture decisions, benchmarks, and code snippets.
            </p>
          </div>

          <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 bg-zinc-100 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setMarkdownTab("write")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                markdownTab === "write"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <Edit3 className="size-3 shrink-0 inline mr-1" />
              Write
            </button>
            <button
              type="button"
              onClick={() => setMarkdownTab("preview")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                markdownTab === "preview"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <Eye className="size-3 shrink-0 inline mr-1" />
              Preview
            </button>
          </div>
        </div>

        {markdownTab === "write" ? (
          <Textarea
            value={contentMarkdown}
            onChange={(e) => setContentMarkdown(e.target.value)}
            rows={12}
            className="font-mono text-xs leading-relaxed"
            placeholder="## System Architecture...&#10;&#10;Explain the problem, technical stack, and solution in detail."
          />
        ) : (
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 min-h-[250px] prose prose-zinc dark:prose-invert max-w-none text-xs">
            {contentMarkdown ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {contentMarkdown}
              </ReactMarkdown>
            ) : (
              <span className="text-zinc-400 italic">
                No content entered yet. Switch back to Write mode.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Submit button bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={saving}>
          <Check className="size-4 shrink-0" />
          <span>{isEditing ? "Save Changes" : "Publish Project"}</span>
        </Button>
      </div>
    </form>
  );
}
