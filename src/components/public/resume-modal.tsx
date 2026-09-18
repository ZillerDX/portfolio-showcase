"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import { FileText, ExternalLink, FileDown } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumePdfUrl: string;
  name?: string;
  title?: string;
}

export function ResumeModal({
  isOpen,
  onClose,
  resumePdfUrl,
  name = "Tanathon Chanapha",
  title = "Full-Stack & Systems Architect",
}: ResumeModalProps) {
  if (!isOpen || !resumePdfUrl) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
            <FileText className="size-5 shrink-0" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 font-heading">
              {name} — Curriculum Vitae
            </h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              {title}
            </span>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-xs">
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
            <FileText className="size-4 shrink-0 text-blue-500" />
            <span>Official Resume PDF &bull; {name}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={resumePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-2xs"
            >
              <ExternalLink className="size-3.5 shrink-0" />
              <span>Open in Tab</span>
            </a>
            <a
              href={resumePdfUrl}
              download="Tanathon-Chanapha-Resume.pdf"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
            >
              <FileDown className="size-3.5 shrink-0" />
              <span>Download PDF</span>
            </a>
          </div>
        </div>

        {/* Embedded PDF Viewer */}
        <div className="w-full h-[600px] sm:h-[720px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 shadow-inner">
          <iframe
            src={`${resumePdfUrl}#view=FitH`}
            title={`${name} Resume Document`}
            className="w-full h-full border-none"
          />
        </div>

        {/* Helper fallback text */}
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-1 pt-1">
          <span>B.Sc. Data Science & Software Innovation &bull; Ubon Ratchathani University</span>
          <a
            href={resumePdfUrl}
            download="Tanathon-Chanapha-Resume.pdf"
            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
          >
            <FileDown className="size-3" /> Direct File Download
          </a>
        </div>
      </div>
    </Modal>
  );
}
