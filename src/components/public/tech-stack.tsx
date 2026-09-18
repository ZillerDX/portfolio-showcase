"use client";

import React from "react";
import { SkillCategory } from "@/types";
import { Code2, Server, Database, Layers, Sparkles } from "lucide-react";

const CATEGORY_META: Record<
  string,
  { icon: React.ReactNode; color: string; borderAccent: string; gradient: string }
> = {
  "Frontend & UI Systems": {
    icon: <Code2 className="size-4 shrink-0 text-blue-500" />,
    color: "text-blue-500",
    borderAccent: "group-hover:border-blue-500/50",
    gradient: "from-blue-500 to-cyan-400",
  },
  "Backend & Systems": {
    icon: <Server className="size-4 shrink-0 text-emerald-500" />,
    color: "text-emerald-500",
    borderAccent: "group-hover:border-emerald-500/50",
    gradient: "from-emerald-500 to-teal-400",
  },
  "Database & Cloud Infrastructure": {
    icon: <Database className="size-4 shrink-0 text-amber-500" />,
    color: "text-amber-500",
    borderAccent: "group-hover:border-amber-500/50",
    gradient: "from-amber-500 to-orange-400",
  },
  "Engineering Practices": {
    icon: <Layers className="size-4 shrink-0 text-purple-500" />,
    color: "text-purple-500",
    borderAccent: "group-hover:border-purple-500/50",
    gradient: "from-purple-500 to-indigo-400",
  },
};

export function PublicTechStack({ skillsJson }: { skillsJson: string }) {
  let categories: SkillCategory[] = [];
  try {
    categories = JSON.parse(skillsJson || "[]");
  } catch {
    categories = [];
  }

  if (!categories || categories.length === 0) return null;

  return (
    <section id="stack" className="py-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono mb-1">
              <Sparkles className="size-3.5 shrink-0" />
              <span>Technical Competencies</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-heading">
              Core Tech Stack & Systems Architecture
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Engineered with modern, type-safe, and high-concurrency tooling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => {
            const meta = CATEGORY_META[cat.category] || {
              icon: <Code2 className="size-4 shrink-0 text-zinc-400" />,
              color: "text-zinc-400",
              borderAccent: "group-hover:border-zinc-500/50",
              gradient: "from-zinc-500 to-zinc-400",
            };

            return (
              <div
                key={idx}
                className={`group relative flex flex-col justify-between p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 overflow-hidden shadow-xs hover:shadow-md card-hover-glow transition-all duration-300 ${meta.borderAccent}`}
              >
                {/* Top colored accent line */}
                <div
                  className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${meta.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
                />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      {meta.icon}
                      <span className="text-xs font-bold font-heading text-zinc-900 dark:text-zinc-100">
                        {cat.category}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-medium">
                      {cat.skills.length}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-zinc-50 hover:bg-white dark:bg-zinc-800/70 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/90 dark:border-zinc-700/60 font-mono text-[11px] hover:scale-[1.03] active:scale-95 transition-all duration-150 cursor-default shadow-2xs"
                      >
                        <span className="size-1 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                        <span>{skill.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
