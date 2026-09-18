"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  FileDown,
  Terminal,
  FolderGit2,
  Award,
} from "lucide-react";
import { ResumeModal } from "@/components/public/resume-modal";

export function PublicNavbar({
  resumePdfUrl,
  name = "Tanathon Chanapha",
  title = "Full-Stack & Systems Architect",
}: {
  resumePdfUrl?: string;
  name?: string;
  title?: string;
}) {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight"
        >
          <div className="size-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
            <Terminal className="size-4 shrink-0" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold leading-none font-heading">{name}</span>
            </div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono tracking-tight mt-0.5">
              Portfolio & Architecture
            </span>
          </div>
        </Link>

        {/* Right Actions & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <a
              href="#projects"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <FolderGit2 className="size-3.5 shrink-0 text-blue-500" />
              <span>Showcase</span>
            </a>
            <a
              href="#certificates"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <Award className="size-3.5 shrink-0 text-indigo-500" />
              <span>Certificates</span>
            </a>
          </nav>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5 hidden md:block" />

          {/* Download Resume Action Button (Replacing old Resume PDF link) */}
          {resumePdfUrl && (
            <button
              type="button"
              onClick={() => setIsResumeOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <FileDown className="size-3.5 shrink-0 text-blue-400 dark:text-blue-600" />
              <span className="hidden sm:inline">Download Resume</span>
              <span className="sm:hidden">Resume</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <ThemeToggle />
        </div>
      </div>

      {/* Interactive Resume Viewer Modal */}
      {resumePdfUrl && (
        <ResumeModal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
          resumePdfUrl={resumePdfUrl}
          name={name}
          title={title}
        />
      )}
    </header>
  );
}
