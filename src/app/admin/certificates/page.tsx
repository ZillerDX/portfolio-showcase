"use client";

import React, { useState, useEffect } from "react";
import { CertificateData } from "@/types";
import {
  Award,
  Plus,
  Search,
  ExternalLink,
  FileText,
  Trash2,
  Edit,
  CheckCircle2,
  Calendar,
  Building2,
  Upload,
  X,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateData | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
    credentialUrl: "",
    description: "",
    skillsInput: "",
    fileUrl: "",
    sortOrder: 0,
    isFeatured: true,
  });

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/certificates");
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const openCreateModal = () => {
    setEditingCert(null);
    setFormData({
      title: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
      description: "",
      skillsInput: "",
      fileUrl: "",
      sortOrder: (certificates.length + 1) * 10,
      isFeatured: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cert: CertificateData) => {
    setEditingCert(cert);
    let skillsArr: string[] = [];
    try {
      skillsArr = JSON.parse(cert.skillsJson || "[]");
    } catch {}
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate || "",
      credentialId: cert.credentialId || "",
      credentialUrl: cert.credentialUrl || "",
      description: cert.description,
      skillsInput: skillsArr.join(", "),
      fileUrl: cert.fileUrl || "",
      sortOrder: cert.sortOrder,
      isFeatured: cert.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/certificates/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCertificates((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete certificate.");
      }
    } catch {
      alert("Error deleting certificate.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {
      setUploading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (res.ok && json.url) {
        setFormData((prev) => ({ ...prev, fileUrl: json.url }));
      } else {
        alert(json.error || "File upload failed");
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.issuer || !formData.issueDate || !formData.description) {
      alert("Please fill in all required fields (Title, Issuer, Issue Date, Description).");
      return;
    }

    const skills = formData.skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title,
      issuer: formData.issuer,
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate || null,
      credentialId: formData.credentialId || null,
      credentialUrl: formData.credentialUrl || null,
      description: formData.description,
      skills,
      fileUrl: formData.fileUrl || null,
      sortOrder: Number(formData.sortOrder) || 0,
      isFeatured: Boolean(formData.isFeatured),
    };

    try {
      if (editingCert) {
        const res = await fetch(`/api/certificates/${editingCert.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchCertificates();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to update certificate");
        }
      } else {
        const res = await fetch("/api/certificates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchCertificates();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to create certificate");
        }
      }
    } catch {
      alert("An error occurred while saving.");
    }
  };

  const filteredCerts = certificates.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.issuer.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.skillsJson.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono mb-1">
            <Award className="size-3.5 shrink-0" />
            <span>Credentials Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-heading">
            Certificates & Licenses
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Store professional accreditations, verified license credentials, and comprehensive competency descriptions.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 active:scale-[0.98] transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus className="size-4 shrink-0" />
          <span>Add Certificate</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex items-center w-full max-w-sm">
          <Search className="absolute left-3.5 size-4 text-zinc-400 pointer-events-none shrink-0" />
          <input
            type="text"
            placeholder="Search certificates, issuers, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 shadow-xs"
          />
        </div>
        <div className="text-xs text-zinc-400 font-mono">
          {filteredCerts.length} record{filteredCerts.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Certificates Table */}
      <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4">Certificate & Issuer</th>
                <th className="p-4">Timeline</th>
                <th className="p-4">Credential ID</th>
                <th className="p-4">Description Preview</th>
                <th className="p-4">PDF Dossier</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-400">
                    Loading credentials...
                  </td>
                </tr>
              ) : filteredCerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-400">
                    No certificates found. Click &quot;Add Certificate&quot; to create your first record.
                  </td>
                </tr>
              ) : (
                filteredCerts.map((cert) => {
                  return (
                    <tr
                      key={cert.id}
                      className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="size-9 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Award className="size-4 shrink-0" />
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900 dark:text-zinc-100 font-heading">
                              {cert.title}
                            </div>
                            <div className="text-zinc-500 dark:text-zinc-400 font-medium text-[11px] flex items-center gap-1 mt-0.5">
                              <Building2 className="size-3 shrink-0" />
                              <span>{cert.issuer}</span>
                              {cert.isFeatured && (
                                <Badge variant="warning" size="sm" className="ml-1 text-[10px] px-1.5 py-0">
                                  <Sparkles className="size-2.5 shrink-0" />
                                  <span>Featured</span>
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
                        <div>Issued: {cert.issueDate}</div>
                        {cert.expiryDate && (
                          <div className="text-zinc-400">Exp: {cert.expiryDate}</div>
                        )}
                      </td>
                      <td className="p-4">
                        {cert.credentialId ? (
                          <div className="space-y-1">
                            <span className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                              {cert.credentialId}
                            </span>
                            {cert.credentialUrl && (
                              <div>
                                <a
                                  href={cert.credentialUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  <span>Verify</span>
                                  <ExternalLink className="size-2.5 shrink-0" />
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-zinc-400">&mdash;</span>
                        )}
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className="line-clamp-2 text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                          {cert.description}
                        </p>
                      </td>
                      <td className="p-4">
                        {cert.fileUrl ? (
                          <a
                            href={cert.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-mono"
                          >
                            <FileText className="size-3.5 shrink-0" />
                            <span>PDF Attached</span>
                          </a>
                        ) : (
                          <span className="text-zinc-400 font-mono text-[11px]">&mdash;</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(cert)}
                            className="p-2 rounded-lg text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Edit Certificate"
                          >
                            <Edit className="size-4 shrink-0" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cert.id, cert.title)}
                            className="p-2 rounded-lg text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Certificate"
                          >
                            <Trash2 className="size-4 shrink-0" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="2xl"
        title={
          <div className="flex items-center gap-2">
            <Award className="size-5 shrink-0 text-blue-500" />
            <span className="font-bold text-zinc-900 dark:text-zinc-100 font-heading">
              {editingCert ? "Edit Certificate Record" : "Add New Certificate"}
            </span>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                Certificate Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AWS Certified Solutions Architect - Professional"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                Issuing Organization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Amazon Web Services (AWS)"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                Credential ID
              </label>
              <input
                type="text"
                placeholder="e.g. AWS-PSA-982410"
                value={formData.credentialId}
                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                Issue Date <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 2024-03 or March 2024"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                Expiration Date
              </label>
              <input
                type="text"
                placeholder="e.g. 2027-03 or Lifetime Validity"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                Verification URL
              </label>
              <input
                type="url"
                placeholder="https://aws.amazon.com/verification"
                value={formData.credentialUrl}
                onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                Description & Competencies Tested <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Detail what this certification validates: architecture principles, systems tested, security domains..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 outline-none leading-relaxed"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                Skills & Covered Technologies (Comma separated)
              </label>
              <input
                type="text"
                placeholder="Cloud Architecture, AWS, Multi-Region VPC, Security"
                value={formData.skillsInput}
                onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                Certificate PDF or Image Attachment
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="/uploads/documents/certificate.pdf"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 outline-none font-mono text-xs"
                />
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold">
                  <Upload className="size-3.5 shrink-0" />
                  <span>{uploading ? "Uploading..." : "Upload File"}</span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-6 sm:col-span-2 pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 size-4"
                />
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Highlight as Featured Credential
                </span>
              </label>

              <div className="flex items-center gap-2">
                <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Sort Order:
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className="w-20 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold hover:opacity-90 shadow-xs"
            >
              {editingCert ? "Save Changes" : "Create Certificate"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
