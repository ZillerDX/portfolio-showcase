import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { PublicNavbar } from "@/components/public/navbar";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Calendar,
  Layers,
  FileDown,
  ExternalLink,
  Github,
  Maximize2,
  FileText,
} from "lucide-react";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const projects = await db.project.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    return projects.map((p) => ({ slug: p.slug }));
  } catch (e) {
    console.error("generateStaticParams failed:", e);
    return [];
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let project = null;
  let profile = null;

  try {
    project = await db.project.findFirst({
      where: {
        slug: params.slug,
        isPublished: true,
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        links: true,
      },
    });

    profile = await db.profile.findUnique({
      where: { id: "default" },
    });
  } catch (error) {
    console.error("Error fetching project detail:", error);
  }

  if (!project) {
    notFound();
  }

  let tags: string[] = [];
  try {
    tags = JSON.parse(project.tagsJson || "[]");
  } catch {
    tags = [];
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <PublicNavbar
        resumePdfUrl={profile?.resumePdfUrl}
        name={profile?.name}
        title={profile?.title}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Back navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="size-3.5 shrink-0" />
          <span>Back to all projects</span>
        </Link>

        {/* Header Title & Badges */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {project.category && (
              <Badge variant="secondary" size="sm">
                {project.category.name}
              </Badge>
            )}
            {project.isFeatured && (
              <Badge variant="warning" size="sm">
                Featured System
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {project.title}
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Meta & Links Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            {project.projectDate && (
              <div className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5 shrink-0" />
                <span>{project.projectDate}</span>
              </div>
            )}
            {project.category && (
              <div className="inline-flex items-center gap-1.5">
                <Layers className="size-3.5 shrink-0" />
                <span>{project.category.name}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {project.links.map((lnk, idx) => (
              <a
                key={idx}
                href={lnk.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity"
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
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 transition-colors"
              >
                <FileDown className="size-3.5 shrink-0" />
                <span>Download PDF</span>
              </a>
            )}
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Technologies & Infrastructure
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Markdown Content */}
        {project.contentMarkdown && (
          <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Technical Architecture & Case Study
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed prose-headings:tracking-tight prose-headings:font-bold prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.contentMarkdown}
              </ReactMarkdown>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 py-8 mt-12 bg-zinc-50/50 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="hover:underline">
            &larr; Return to Portfolio Showcase
          </Link>
        </div>
      </footer>
    </div>
  );
}
