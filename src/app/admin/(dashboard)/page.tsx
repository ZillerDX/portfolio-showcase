import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import {
  FolderGit2,
  PlusCircle,
  FileText,
  Sparkles,
  Layers,
  ArrowUpRight,
  User,
  CheckCircle2,
  Eye,
  Edit,
  Database,
  HardDrive,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalProjects,
    featuredProjects,
    pdfProjects,
    categoriesCount,
    totalCertificates,
    recentProjects,
    profile,
  ] = await Promise.all([
    db.project.count(),
    db.project.count({ where: { isFeatured: true } }),
    db.project.count({ where: { pdfFile: { not: null } } }),
    db.category.count(),
    db.certificate.count(),
    db.project.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    db.profile.findUnique({ where: { id: "default" } }),
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 shadow-xs">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
            <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-heading">
            Welcome back, {profile?.name || "Admin"}
          </h1>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <span className={`size-2 rounded-full shrink-0 ${profile?.availableForWork ? "bg-emerald-500" : "bg-zinc-400"}`} />
              <span>{profile?.availableForWork ? "Open for new projects" : "Unavailable"}</span>
            </span>
            <span>&bull;</span>
            <span>{totalProjects} projects published</span>
            <span>&bull;</span>
            <span>{categoriesCount} active categories</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 active:scale-[0.98] transition-all shadow-xs"
          >
            <PlusCircle className="size-4 shrink-0" />
            <span>New Project</span>
          </Link>
          <Link
            href="/admin/certificates"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 active:scale-[0.98] transition-all shadow-2xs"
          >
            <Award className="size-4 shrink-0 text-blue-500" />
            <span>Certificates</span>
          </Link>
          <Link
            href="/admin/profile"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 active:scale-[0.98] transition-all shadow-2xs"
          >
            <User className="size-4 shrink-0" />
            <span>Profile & Stack</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid (5 Columns) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">Total Projects</span>
            <FolderGit2 className="size-4 shrink-0 text-blue-500" />
          </div>
          <div className="text-3xl font-bold tracking-tight font-mono text-zinc-900 dark:text-zinc-100">
            {totalProjects}
          </div>
          <div className="text-[11px] text-zinc-400">
            Published in repository
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">Featured</span>
            <Sparkles className="size-4 shrink-0 text-amber-500" />
          </div>
          <div className="text-3xl font-bold tracking-tight font-mono text-zinc-900 dark:text-zinc-100">
            {featuredProjects}
          </div>
          <div className="text-[11px] text-zinc-400">
            Pinned to showcase top
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">PDF Whitepapers</span>
            <FileText className="size-4 shrink-0 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold tracking-tight font-mono text-zinc-900 dark:text-zinc-100">
            {pdfProjects}
          </div>
          <div className="text-[11px] text-zinc-400">
            Technical dossiers attached
          </div>
        </div>

        <Link
          href="/admin/certificates"
          className="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 shadow-xs space-y-2 hover:border-blue-500/50 transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider font-mono group-hover:text-blue-500 transition-colors">Certificates</span>
            <Award className="size-4 shrink-0 text-blue-500" />
          </div>
          <div className="text-3xl font-bold tracking-tight font-mono text-zinc-900 dark:text-zinc-100">
            {totalCertificates}
          </div>
          <div className="text-[11px] text-zinc-400 group-hover:text-blue-500 transition-colors flex items-center gap-1">
            <span>Manage licenses</span>
            <ArrowUpRight className="size-3 shrink-0" />
          </div>
        </Link>

        <div className="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 shadow-xs space-y-2 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">Taxonomies</span>
            <Layers className="size-4 shrink-0 text-purple-500" />
          </div>
          <div className="text-3xl font-bold tracking-tight font-mono text-zinc-900 dark:text-zinc-100">
            {categoriesCount}
          </div>
          <div className="text-[11px] text-zinc-400">
            Engineering domain tags
          </div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-zinc-200/90 dark:border-zinc-800/90 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-heading">
              Recent Engineering Records
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Manage, edit specifications, or preview your published works.
            </p>
          </div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>View All ({totalProjects})</span>
            <ArrowUpRight className="size-3.5 shrink-0" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4">Project</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">PDF Whitepaper</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {recentProjects.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {/* Resilient Thumbnail Container */}
                      <div className="size-10 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-950 flex items-center justify-center shrink-0">
                        <img
                          src={p.coverImage}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 font-heading">
                          {p.title}
                        </div>
                        <div className="font-mono text-[11px] text-zinc-400">
                          /{p.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-300">
                    <span className="font-medium">{p.category.name}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {p.isPublished ? (
                        <Badge variant="success" size="sm">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" size="sm">
                          Draft
                        </Badge>
                      )}
                      {p.isFeatured && (
                        <Badge variant="warning" size="sm">
                          <Sparkles className="size-2.5 shrink-0" />
                          <span>Featured</span>
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {p.pdfFile ? (
                      <span className="inline-flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">
                        <FileText className="size-3.5 shrink-0 text-blue-500" />
                        <span>Attached</span>
                      </span>
                    ) : (
                      <span className="text-zinc-400 text-[11px] font-mono">&mdash;</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        href={`/project/${p.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Preview Public Page"
                      >
                        <Eye className="size-4 shrink-0" />
                      </Link>
                      <Link
                        href={`/admin/projects/${p.id}`}
                        className="p-2 rounded-lg text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Edit Project"
                      >
                        <Edit className="size-4 shrink-0" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Telemetry Widget */}
      <div className="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Database className="size-3.5 shrink-0 text-emerald-500" />
            <span>DB: SQLite (Prisma ORM)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HardDrive className="size-3.5 shrink-0 text-blue-500" />
            <span>Storage: Local Filesystem</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <ShieldCheck className="size-3.5 shrink-0 text-amber-500" />
          <span>Auth: Signed HMAC Session Cookie</span>
        </div>
      </div>
    </div>
  );
}
