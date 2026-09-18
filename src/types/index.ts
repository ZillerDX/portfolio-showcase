export interface ProfileData {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  resumePdfUrl: string;
  availableForWork: boolean;
  availabilityText: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl?: string;
  jobsdbUrl?: string;
  location: string;
  skillsJson: string; // JSON: SkillCategory[]
}

export interface SkillCategory {
  category: string;
  skills: { name: string; level?: string; icon?: string }[];
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  _count?: {
    projects: number;
  };
}

export interface ProjectLinkData {
  id?: string;
  label: string;
  url: string;
  type: "demo" | "github" | "article" | "external";
}

export interface ProjectImageData {
  id?: string;
  imageUrl: string;
  caption?: string | null;
  sortOrder: number;
}

export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  summary: string;
  contentMarkdown: string;
  coverImage: string;
  pdfFile: string | null;
  categoryId: string;
  category?: CategoryData;
  tagsJson: string; // JSON string array
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  projectDate: string | null;
  images: ProjectImageData[];
  links: ProjectLinkData[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CertificateData {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  description: string;
  skillsJson: string; // JSON string array
  fileUrl?: string | null;
  sortOrder: number;
  isFeatured: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

