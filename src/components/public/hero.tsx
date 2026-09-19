"use client";

import React, { useState } from "react";
import { ProfileData } from "@/types";
import {
  ExternalLink,
  Mail,
  MapPin,
  Github,
  Linkedin,
  BadgeCheck,
  Briefcase,
  Check,
  Cpu,
  ShieldCheck,
  Zap,
  Sparkles,
  Copy,
} from "lucide-react";
import { JobsdbIcon } from "@/components/ui/jobsdb-icon";
import { OfficialYoutubeIcon } from "@/components/ui/youtube-icon";
import { Modal } from "@/components/ui/modal";

export function PublicHero({ profile }: { profile: ProfileData }) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const contactEmail = profile.contactEmail || "chanapha.tanathon@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <section className="pt-2 pb-8 animate-fade-in-up">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Executive Profile Card */}
        <div className="relative rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/80 overflow-hidden shadow-sm card-hover-glow transition-all duration-300">
          
          {/* Top Decorative Tech Mesh Banner */}
          <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-gradient-to-r from-slate-950 via-zinc-900 to-indigo-950">
            <img
              src="/uploads/images/profile-banner.svg"
              alt="Profile Cover Banner"
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
            />
            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
            
            {/* Subtle top-right badge */}
            <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-mono text-zinc-300">
              <span className="size-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>Bangkok, TH</span>
            </div>
          </div>

          {/* Profile Body with Avatar Overlap */}
          <div className="px-6 sm:px-10 pb-8 pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
              {/* Overlapping Avatar with Halo Ring */}
              <div className="relative group">
                <div className="relative size-28 sm:size-36 rounded-2xl overflow-hidden border-4 border-white dark:border-zinc-900 bg-zinc-950 shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]">
                  <img
                    src={profile.avatarUrl || "/uploads/images/avatar.svg"}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Action Buttons Top Right */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 sm:pt-0">
                {/* YouTube Intro Video Link Button with Description (Matching h-11 Height) */}
                <a
                  href="https://youtube.com/shorts/Z694PCDvAs4"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="See my introduce short video"
                  title="See my introduce short video"
                  className="inline-flex items-center gap-2.5 px-3.5 h-11 rounded-xl border border-red-200/90 dark:border-red-900/50 bg-red-50/70 dark:bg-red-950/30 text-zinc-900 dark:text-zinc-100 hover:bg-red-100/80 dark:hover:bg-red-900/40 hover:border-red-300 dark:hover:border-red-800 transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <OfficialYoutubeIcon className="w-6 h-[16px] shrink-0 group-hover:scale-110 transition-transform drop-shadow-xs" />
                  <div className="flex flex-col text-left justify-center">
                    <span className="text-xs font-bold leading-tight flex items-center gap-1">
                      <span>Intro Video</span>
                      <ExternalLink className="size-3 text-red-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <span className="text-[10.5px] text-zinc-500 dark:text-zinc-400 leading-tight">
                      See my introduce short video
                    </span>
                  </div>
                </a>

                {/* Get in Touch Button (Matching h-11 Height with Interactive Email Modal) */}
                {contactEmail && (
                  <button
                    type="button"
                    onClick={() => setIsContactOpen(true)}
                    className="inline-flex items-center gap-2 px-4 h-11 text-xs sm:text-sm font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-[0.98] transition-all shadow-2xs cursor-pointer"
                  >
                    <Mail className="size-4 shrink-0 text-zinc-500" />
                    <span>Get in Touch</span>
                  </button>
                )}

                {/* Social Icons (Matching size-11) */}
                <div className="flex items-center gap-1.5 ml-1">
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="size-11 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                    >
                      <Github className="size-4 shrink-0" />
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      title="LinkedIn Profile"
                      className="size-11 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                    >
                      <Linkedin className="size-4 shrink-0 text-blue-500" />
                    </a>
                  )}
                  {(profile.jobsdbUrl || profile.twitterUrl) && (
                    <a
                      href={profile.jobsdbUrl || profile.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Jobsdb"
                      title="Jobsdb Profile"
                      className="size-11 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                    >
                      <JobsdbIcon className="size-4 shrink-0" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Information Header */}
            <div className="space-y-4">
              {/* Availability pill */}
              {profile.availableForWork && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                  <span className="relative flex size-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
                  </span>
                  <span>{profile.availabilityText || "Available for contract & high-impact full-time roles"}</span>
                </div>
              )}

              {/* Name & Title */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-heading">
                    {profile.name}
                  </h1>
                  <BadgeCheck className="size-7 shrink-0 text-blue-500 drop-shadow-xs" />
                </div>
                <p className="text-base sm:text-xl font-semibold text-zinc-700 dark:text-zinc-300 font-heading leading-snug">
                  {profile.title}
                </p>
              </div>

              {/* Bio description */}
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
                {profile.bio}
              </p>

              {/* Location & Metadata Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                {profile.location && (
                  <div className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5 shrink-0 text-blue-500" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="inline-flex items-center gap-1.5">
                  <Briefcase className="size-3.5 shrink-0 text-emerald-500" />
                  <span>Principal Systems & Design Architecture</span>
                </div>
              </div>

              {/* Engineering Status & Roadmap Dispatch Notes */}
              <div className="pt-2">
                <div className="p-3.5 sm:p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-950/40 backdrop-blur-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex size-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex rounded-full size-2 bg-blue-500" />
                    </span>
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Engineering Status & Roadmap
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 dark:text-blue-400 mt-0.5 shrink-0 font-bold">•</span>
                      <span>
                        <strong className="font-semibold text-zinc-900 dark:text-zinc-100">Local-First Development:</strong> More active projects and systems are being developed locally in spare time, queued for upcoming deployment.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 dark:text-blue-400 mt-0.5 shrink-0 font-bold">•</span>
                      <span>
                        <strong className="font-semibold text-zinc-900 dark:text-zinc-100">.NET 10 LTS Migration:</strong> .NET 9 codebases are scheduled for migration to .NET 10 soon; actively researching and preparing the upgrade roadmap.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 dark:text-blue-400 mt-0.5 shrink-0 font-bold">•</span>
                      <span>
                        <strong className="font-semibold text-zinc-900 dark:text-zinc-100">Continuous Growth:</strong> Continuously assimilating new technologies, eager to share architectural ideas, and always welcoming constructive feedback.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 dark:text-blue-400 mt-0.5 shrink-0 font-bold">•</span>
                      <span>
                        <strong className="font-semibold text-zinc-900 dark:text-zinc-100">Ongoing Showcase Updates:</strong> Fresh live deployments, interactive case studies, and engineering updates will be added to this site regularly.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Engineering Mindset & Workflow */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-amber-400/50 transition-colors group">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="size-3.5 shrink-0 text-amber-500" />
                    <span>01 &bull; Learn</span>
                  </div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1 font-heading">
                    Fast Learner
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Rapid Tech Mastery
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-emerald-400/50 transition-colors group">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="size-3.5 shrink-0 text-emerald-500" />
                    <span>02 &bull; Think</span>
                  </div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1 font-heading">
                    Systems Mindset
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Scalable Architecture
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-blue-400/50 transition-colors group">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 shrink-0 text-blue-500" />
                    <span>03 &bull; Craft</span>
                  </div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1 font-heading">
                    Disciplined Code
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Robust & Clean Standards
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-purple-400/50 transition-colors group">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="size-3.5 shrink-0 text-purple-500" />
                    <span>04 &bull; Deliver</span>
                  </div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1 font-heading">
                    Production Impact
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Measurable Value Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Email Modal Popup */}
      <Modal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        maxWidth="md"
        title={
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Mail className="size-5 shrink-0" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 font-heading">
                Get in Touch
              </h3>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                Direct Contact & Inquiries
              </span>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Interested in discussing software architecture, engineering roles, or high-impact projects? Reach out directly via email:
          </p>

          {/* Email Address Container Card */}
          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
              Email Address
            </div>
            
            <div className="flex items-center justify-between gap-2 p-3 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 select-all break-all shadow-2xs">
              <span className="font-semibold text-blue-600 dark:text-blue-400 select-all">{contactEmail}</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="size-4 shrink-0 text-emerald-400 dark:text-emerald-600" />
                    <span>Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-4 shrink-0" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
}
