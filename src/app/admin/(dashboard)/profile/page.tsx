"use client";

import React, { useState, useEffect } from "react";
import { ProfileData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import {
  Upload,
  FileText,
  Trash2,
  Check,
  User,
  ShieldCheck,
  MapPin,
  Mail,
  Github,
  Linkedin,
  Code2,
} from "lucide-react";
import { JobsdbIcon } from "@/components/ui/jobsdb-icon";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [availableForWork, setAvailableForWork] = useState(true);
  const [availabilityText, setAvailabilityText] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [resumePdfUrl, setResumePdfUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [skillsJson, setSkillsJson] = useState("");

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setName(data.name || "");
        setTitle(data.title || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
        setContactEmail(data.contactEmail || "");
        setAvailableForWork(data.availableForWork ?? true);
        setAvailabilityText(data.availabilityText || "");
        setAvatarUrl(data.avatarUrl || "");
        setResumePdfUrl(data.resumePdfUrl || "");
        setGithubUrl(data.githubUrl || "");
        setLinkedinUrl(data.linkedinUrl || "");
        setTwitterUrl(data.twitterUrl || "");
        setSkillsJson(
          typeof data.skillsJson === "string"
            ? data.skillsJson
            : JSON.stringify(data.skillsJson, null, 2)
        );
      })
      .catch((err) => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleFileUpload = async (file: File, type: "avatar" | "resume") => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      if (type === "avatar") setUploadingAvatar(true);
      if (type === "resume") setUploadingResume(true);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (type === "avatar") setAvatarUrl(data.url);
      if (type === "resume") setResumePdfUrl(data.url);
    } catch (err: any) {
      alert(err.message || "Failed to upload file");
    } finally {
      if (type === "avatar") setUploadingAvatar(false);
      if (type === "resume") setUploadingResume(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      // Validate JSON if present
      let formattedSkills = skillsJson;
      try {
        JSON.parse(skillsJson || "[]");
      } catch {
        throw new Error("Skills JSON is not valid JSON format");
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          title,
          bio,
          location,
          contactEmail,
          availableForWork,
          availabilityText,
          avatarUrl,
          resumePdfUrl,
          githubUrl,
          linkedinUrl,
          twitterUrl,
          skillsJson: formattedSkills,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save profile");

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-zinc-500">
        Loading profile settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Profile & Technical Stack Settings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Configure how your public profile, resume, and technical competencies appear.
          </p>
        </div>

        <Button type="submit" variant="primary" size="sm" loading={saving}>
          <Check className="size-3.5 shrink-0" />
          <span>Save Changes</span>
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-3 text-xs rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <Check className="size-4 shrink-0" />
          <span>Profile configuration saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Card 1: Avatar & Personal Info */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-6">
        <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Personal Information & Avatar
        </h2>

        {/* Avatar Upload */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative size-20 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shrink-0">
            <img
              src={avatarUrl || "/uploads/images/avatar.svg"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Upload className="size-3.5 shrink-0" />
              <span>{uploadingAvatar ? "Uploading..." : "Upload New Avatar"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "avatar");
                }}
                disabled={uploadingAvatar}
              />
            </label>
            <Input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="/uploads/images/avatar.png"
              className="text-xs font-mono w-72"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Full Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Chen"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Professional Title / Role
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Senior Full-Stack & UI Systems Architect"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Bangkok, Thailand (UTC+7)"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Contact Email
            </label>
            <Input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="alex.chen.architect@example.com"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Biography
            </label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="A brief executive summary of your background and engineering focus..."
            />
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            <input
              type="checkbox"
              checked={availableForWork}
              onChange={(e) => setAvailableForWork(e.target.checked)}
              className="rounded border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500"
            />
            <span>Show &ldquo;Available for work&rdquo; status badge on showcase</span>
          </label>

          <Input
            value={availabilityText}
            onChange={(e) => setAvailabilityText(e.target.value)}
            placeholder="Available for contract & high-impact roles"
            className="text-xs"
          />
        </div>
      </div>

      {/* Card 2: Resume PDF Upload & Social Links */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-6">
        <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Resume Document & Social Profiles
        </h2>

        {/* Resume PDF */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Resume / Curriculum Vitae (PDF)
          </label>

          {resumePdfUrl ? (
            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <FileText className="size-4 shrink-0 text-blue-500" />
                <span className="text-xs font-mono text-zinc-800 dark:text-zinc-200 truncate">
                  {resumePdfUrl}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={resumePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View
                </a>
                <button
                  type="button"
                  onClick={() => setResumePdfUrl("")}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Upload className="size-3.5 shrink-0" />
              <span>{uploadingResume ? "Uploading..." : "Upload Resume (PDF)"}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "resume");
                }}
                disabled={uploadingResume}
              />
            </label>
          )}
        </div>

        {/* Social URLs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Github className="size-3.5 shrink-0" />
              <span>GitHub Profile</span>
            </label>
            <Input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Linkedin className="size-3.5 shrink-0" />
              <span>LinkedIn Profile</span>
            </label>
            <Input
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <JobsdbIcon className="size-3.5 shrink-0" />
              <span>Jobsdb Profile</span>
            </label>
            <Input
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              placeholder="https://th.jobsdb.com/th/profiles/..."
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Card 3: Skills JSON Editor */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Code2 className="size-4 shrink-0 text-blue-500" />
              <span>Technical Skills JSON Configuration</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Define skill categories and competency pills shown in the Tech Stack section.
            </p>
          </div>
        </div>

        <Textarea
          value={skillsJson}
          onChange={(e) => setSkillsJson(e.target.value)}
          rows={10}
          className="font-mono text-xs leading-relaxed"
          placeholder='[{"category": "Frontend", "skills": [{"name": "React"}]}]'
        />
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <Button type="submit" variant="primary" loading={saving}>
          <Check className="size-4 shrink-0" />
          <span>Save Profile Changes</span>
        </Button>
      </div>
    </form>
  );
}
