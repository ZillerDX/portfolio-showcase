"use client";

import React, { useState } from "react";
import { CertificateData } from "@/types";
import {
  Award,
  FileText,
  FileDown,
  Info,
  ChevronRight,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface PublicCertificatesProps {
  certificates: CertificateData[];
}

export function PublicCertificates({ certificates }: PublicCertificatesProps) {
  const [activeCert, setActiveCert] = useState<CertificateData | null>(null);

  if (!certificates || certificates.length === 0) return null;

  return (
    <section id="certificates" className="py-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono mb-1">
              <Award className="size-3.5 shrink-0" />
              <span>Certifications</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-heading">
              Professional Certifications
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {certificates.length} corporate accreditations & credentials &bull; Click to read details
          </p>
        </div>

        {/* Compact Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setActiveCert(cert)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveCert(cert);
                }
              }}
              className="group relative flex flex-col justify-between p-4 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 overflow-hidden shadow-xs hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md card-hover-glow transition-all duration-200 cursor-pointer text-left focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {/* Top Accent Stripe */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-2">
                {/* Header: Issuer & Date */}
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                  <span className="truncate font-semibold text-zinc-600 dark:text-zinc-400">
                    {cert.issuer}
                  </span>
                  <span className="shrink-0">{cert.issueDate}</span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-heading leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cert.title}
                </h3>

                {/* Compact Description (2 lines clamp) */}
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {cert.description}
                </p>
              </div>

              {/* Action Link Footer */}
              <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="size-3.5 shrink-0" />
                  <span>Read description</span>
                </span>
                <ChevronRight className="size-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Details & Document Reader Modal */}
      {activeCert && (
        <Modal
          isOpen={Boolean(activeCert)}
          onClose={() => setActiveCert(null)}
          maxWidth="4xl"
          title={
            <div className="flex items-center gap-2 truncate">
              <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Award className="size-4 shrink-0" />
              </div>
              <div className="flex flex-col truncate text-left">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate font-heading text-sm sm:text-base leading-tight">
                  {activeCert.title}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {activeCert.issuer} &bull; Issued: {activeCert.issueDate}
                </span>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Full Detailed Description Card */}
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
                  <Info className="size-3.5 shrink-0" />
                  <span>Certification Overview</span>
                </div>
                {activeCert.credentialId && (
                  <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 bg-white/80 dark:bg-zinc-900/80 px-2 py-0.5 rounded-md border border-zinc-200/60 dark:border-zinc-800/60">
                    ID: {activeCert.credentialId}
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed">
                {activeCert.description}
              </p>
            </div>

            {/* Document Header & Download Action */}
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                <FileText className="size-4 shrink-0 text-blue-500" />
                <span>Official PDF Certificate</span>
              </div>

              {activeCert.fileUrl && (
                <a
                  href={activeCert.fileUrl}
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity shadow-xs"
                >
                  <FileDown className="size-3.5 shrink-0" />
                  <span>Download PDF</span>
                </a>
              )}
            </div>

            {/* Embedded PDF iframe */}
            {activeCert.fileUrl && (
              <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 shadow-inner">
                <iframe
                  src={`${activeCert.fileUrl}#view=FitH`}
                  title={`${activeCert.title} PDF Document`}
                  className="w-full h-full border-none"
                />
              </div>
            )}
          </div>
        </Modal>
      )}
    </section>
  );
}
