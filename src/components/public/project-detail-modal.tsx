"use client";

import React, { useState } from "react";
import { ProjectData } from "@/types";
import { Modal } from "@/components/ui/modal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FileDown,
  ExternalLink,
  Github,
  Maximize2,
  Calendar,
  Layers,
  FileText,
  Images,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface ProjectDetailModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "gallery">("overview");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!project) return null;

  let tags: string[] = [];
  try {
    tags = JSON.parse(project.tagsJson || "[]");
  } catch {
    tags = [];
  }

  const allImages = [
    { imageUrl: project.coverImage, caption: "Main System Cover" },
    ...project.images,
  ];

  return (
    <Modal
      isOpen={Boolean(project)}
      onClose={onClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-2.5 truncate">
          {project.category && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              {project.category.name}
            </span>
          )}
          {project.isFeatured && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
              <Sparkles className="size-3 shrink-0" />
              <span>Featured</span>
            </span>
          )}
          <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate font-heading text-sm sm:text-base">
            {project.title}
          </span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "overview"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
            }`}
          >
            <BookOpen className="size-3.5 shrink-0" />
            <span>Case Study & Specs</span>
          </button>

          {allImages.length > 1 && (
            <button
              type="button"
              onClick={() => setActiveTab("gallery")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === "gallery"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
              }`}
            >
              <Images className="size-3.5 shrink-0" />
              <span>Screenshots ({allImages.length})</span>
            </button>
          )}
        </div>

        {/* Tab 1: Overview & Case Study */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Header Hero Image */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 shadow-sm">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Meta & Links Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xs">
              <div className="flex items-center gap-4">
                {project.projectDate && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    <Calendar className="size-3.5 shrink-0 text-blue-500" />
                    <span>{project.projectDate}</span>
                  </div>
                )}
                {project.category && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <Layers className="size-3.5 shrink-0 text-emerald-500" />
                    <span>{project.category.name}</span>
                  </div>
                )}
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-2">
                {project.links.map((lnk, idx) => (
                  <a
                    key={idx}
                    href={lnk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 active:scale-[0.98] transition-all shadow-2xs"
                  >
                    {lnk.type === "github" ? (
                      <Github className="size-3.5 shrink-0" />
                    ) : (
                      <ExternalLink className="size-3.5 shrink-0" />
                    )}
                    <span>{lnk.label}</span>
                  </a>
                ))}

                {project.pdfFile && (
                  <a
                    href={project.pdfFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 active:scale-[0.98] transition-all shadow-2xs"
                  >
                    <FileDown className="size-3.5 shrink-0 text-emerald-500" />
                    <span>Download PDF</span>
                  </a>
                )}
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Technologies Used
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tTag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60"
                    >
                      {tTag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="p-4 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/50 dark:bg-zinc-900/40 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 font-heading">Overview: </span>
              {project.summary}
            </div>

            {/* Markdown Case Study Body */}
            {project.contentMarkdown && (
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed prose-headings:font-heading prose-headings:tracking-tight prose-headings:font-bold prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800/80 prose-pre:rounded-2xl">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {project.contentMarkdown}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Image Gallery */}
        {activeTab === "gallery" && (
          <div className="space-y-4">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950">
              <img
                src={allImages[activeImageIndex]?.imageUrl}
                alt={allImages[activeImageIndex]?.caption || "Gallery"}
                className="w-full h-full object-contain"
              />
              {allImages[activeImageIndex]?.caption && (
                <div className="absolute bottom-0 inset-x-0 p-3 bg-zinc-950/80 backdrop-blur-md text-xs text-white text-center font-mono">
                  {allImages[activeImageIndex]?.caption}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2.5 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative size-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
