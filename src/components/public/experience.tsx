import React from "react";
import { Briefcase, GraduationCap } from "lucide-react";

const highlights = [
  {
    label: "End-to-end internal app (Krones Australia)",
    text: "Gathered requirements from overseas stakeholders, built the workflows with Power Apps, Power Automate and SharePoint, deployed to production and wrote the operational documentation.",
  },
  {
    label: "User training in English",
    text: "Delivered 2 training sessions: one for Thailand operations and one regional webinar for international teams.",
  },
  {
    label: "Internal AI Lead Instructor",
    text: "Ran 8 bilingual Microsoft Copilot / applied-AI workshops (6 on-site, 2 regional webinars) and gave weekly updates proposing new AI use cases.",
  },
];

export function PublicExperience() {
  return (
    <section id="experience" className="py-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono mb-1">
            <Briefcase className="size-3.5 shrink-0" />
            <span>Experience</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-heading">
            Information Technology Intern, Krones (Thailand)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
            Dec 2025 – Sep 2026 · Bangkok
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 shadow-xs"
            >
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-heading mb-1.5">
                {item.label}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap className="size-3.5 shrink-0 text-blue-500" />
            BSc Data Science and Software Innovation, Ubon Ratchathani University (2022–2026)
          </span>
          <span>
            Krones work used the company&apos;s Microsoft Power Platform stack; the software projects below are self-directed and deployed.
          </span>
        </div>
      </div>
    </section>
  );
}
