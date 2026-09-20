"use client";

import React, { useState, useMemo } from "react";
import { ProfileData, CategoryData, ProjectData, CertificateData } from "@/types";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicHero } from "@/components/public/hero";
import { PublicCertificates } from "@/components/public/certificates";
import { ProjectFilter } from "@/components/public/project-filter";
import { ProjectCard } from "@/components/public/project-card";
import { ProjectDetailModal } from "@/components/public/project-detail-modal";
import { FolderSearch, Sparkles, ArrowUp } from "lucide-react";

interface ShowcaseClientProps {
  profile: ProfileData;
  categories: CategoryData[];
  initialProjects: ProjectData[];
  certificates?: CertificateData[];
}

export function ShowcaseClient({
  profile,
  categories,
  initialProjects,
  certificates = [],
}: ShowcaseClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTechStack, setSelectedTechStack] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);

  // Extract all unique tech stack tags across all projects with frequency counts
  const availableTechStacks = useMemo(() => {
    const stackMap = new Map<string, number>();
    initialProjects.forEach((proj) => {
      try {
        const tags: string[] = JSON.parse(proj.tagsJson || "[]");
        tags.forEach((tag) => {
          const trimmed = tag.trim();
          if (trimmed) {
            stackMap.set(trimmed, (stackMap.get(trimmed) || 0) + 1);
          }
        });
      } catch {
        // ignore malformed tags json
      }
    });

    return Array.from(stackMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [initialProjects]);

  // Filter projects instantaneously
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      // Category filter
      if (selectedCategory !== "all") {
        if (project.category?.slug !== selectedCategory) {
          return false;
        }
      }

      // Tech stack filter
      if (selectedTechStack !== "all") {
        try {
          const tags: string[] = JSON.parse(project.tagsJson || "[]");
          if (!tags.some((t) => t.toLowerCase() === selectedTechStack.toLowerCase())) {
            return false;
          }
        } catch {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = project.title.toLowerCase().includes(query);
        const summaryMatch = project.summary.toLowerCase().includes(query);
        const tagMatch = project.tagsJson.toLowerCase().includes(query);
        const categoryMatch = project.category?.name.toLowerCase().includes(query);

        if (!titleMatch && !summaryMatch && !tagMatch && !categoryMatch) {
          return false;
        }
      }

      return true;
    });
  }, [initialProjects, selectedCategory, selectedTechStack, searchQuery]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground ambient-mesh transition-colors duration-200">
      {/* Top Docked Navigation */}
      <PublicNavbar
        resumePdfUrl={profile.resumePdfUrl}
        name={profile.name}
        title={profile.title}
      />

      {/* Executive Hero Section */}
      <PublicHero profile={profile} />

      {/* Verified Certifications & Credentials Section */}
      <PublicCertificates certificates={certificates} />

      {/* Main Project Showcase Section */}
      <main id="projects" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono mb-1">
              <Sparkles className="size-3.5 shrink-0" />
              <span>Engineered Systems</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-heading">
              Selected Works & Project Showcase
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Showing {filteredProjects.length} of {initialProjects.length} projects
          </p>
        </div>

        {/* Filter and Search Bar */}
        <ProjectFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          availableTechStacks={availableTechStacks}
          selectedTechStack={selectedTechStack}
          onSelectTechStack={(stack) => setSelectedTechStack(stack)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCount={initialProjects.length}
        />

        {/* Project Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={(proj) => setActiveProject(proj)}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30">
            <div className="size-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto mb-4">
              <FolderSearch className="size-7 shrink-0" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-heading">
              No matching projects found
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-sm mx-auto">
              We couldn&apos;t find any results for &ldquo;{searchQuery}&rdquo;. Try clearing your search filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedTechStack("all");
              }}
              className="mt-5 px-4 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Project Detail Modal & PDF Viewer */}
      <ProjectDetailModal
        key={activeProject?.id || "none"}
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />

      {/* Sleek Footer */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 py-10 mt-16 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">
              {profile.name
                ? profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "TC"}
            </div>
            <span>
              &copy; {new Date().getFullYear()} {profile.name}. Portfolio & Architecture.
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a href="#projects" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Showcase
            </a>
            <a href="#certificates" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Certificates
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Back to top"
            >
              <ArrowUp className="size-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
