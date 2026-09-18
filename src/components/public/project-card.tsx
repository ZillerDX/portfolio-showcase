"use client";

import React from "react";
import { ProjectData } from "@/types";
import {
  ExternalLink,
  Github,
  ArrowRight,
  Calendar,
} from "lucide-react";

interface ProjectCardProps {
  project: ProjectData;
  onSelect: (project: ProjectData) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  let tags: string[] = [];
  try {
    tags = JSON.parse(project.tagsJson || "[]");
  } catch {
    tags = [];
  }

  return (
    <article className="group flex flex-col rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/80 overflow-hidden shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg card-hover-glow transition-all duration-300">
      {/* Cover Image Container */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950 cursor-pointer"
        onClick={() => onSelect(project)}
      >
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Ambient subtle vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

        {/* Top Badges Overlay: Category on Left, Date on Right (No Featured Badge) */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
          {project.category ? (
            <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white border border-white/15 shadow-xs">
              {project.category.name}
            </span>
          ) : <div />}

          {project.projectDate && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-zinc-300 border border-white/10 shadow-xs">
              <Calendar className="size-3 shrink-0 text-zinc-400" />
              <span>{project.projectDate}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Project Title */}
          <h3
            className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-2 leading-snug"
            onClick={() => onSelect(project)}
          >
            {project.title}
          </h3>

          {/* Project Summary */}
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Tech Stack Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/50"
              >
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="text-[11px] font-mono px-1.5 py-0.5 text-zinc-400">
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
          {/* Quick links with vector icons */}
          <div className="flex items-center gap-1">
            {project.links.map((link, idx) => {
              if (link.type === "github") {
                return (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.label}
                    className="p-2 rounded-lg text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Github className="size-4 shrink-0" />
                  </a>
                );
              }
              if (link.type === "demo") {
                return (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.label}
                    className="p-2 rounded-lg text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <ExternalLink className="size-4 shrink-0" />
                  </a>
                );
              }
              return null;
            })}
          </div>

          {/* Inspect Button with sliding arrow */}
          <button
            type="button"
            onClick={() => onSelect(project)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors active:scale-[0.98] cursor-pointer"
          >
            <span>Case Study</span>
            <ArrowRight className="size-3.5 shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </article>
  );
}
