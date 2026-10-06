import { db } from "@/lib/db";
import { ShowcaseClient } from "@/components/public/showcase-client";
import { ProfileData, CategoryData, ProjectData, CertificateData } from "@/types";

export const revalidate = 60;

const fallbackProfile: ProfileData = {
  id: "default",
  name: "Tanathon Chanapha",
  title: "Software Engineer | .NET · Angular · React | AI Integration",
  bio: "Software engineer building full-stack web apps with .NET, Angular, React and TypeScript, and integrating LLM APIs (Gemini) into real workflows. Delivered an internal business app for Krones Australia and led 8 bilingual AI workshops.",
  avatarUrl: "/uploads/images/avatar.png",
  resumePdfUrl: "/uploads/documents/tanathon-chanapha-resume.pdf",
  availableForWork: true,
  availabilityText: "Available for full-time Software Engineer / AI Engineer roles",
  contactEmail: "chanapha.tanathon@gmail.com",
  githubUrl: "https://github.com/ZillerDX",
  linkedinUrl: "https://www.linkedin.com/in/tanathon-chanapha-452177427",
  twitterUrl: "https://th.jobsdb.com/th/profiles/tanathon-chanapha-R26rW062z5",
  location: "Bangkok, Thailand (UTC+7)",
  skillsJson: "[]",
};

export default async function HomePage() {
  let profile = fallbackProfile;
  let categories: CategoryData[] = [];
  let projects: ProjectData[] = [];
  let certificates: CertificateData[] = [];

  try {
    const dbProfile = await db.profile.findUnique({
      where: { id: "default" },
    });
    if (dbProfile) {
      profile = {
        ...fallbackProfile,
        ...dbProfile,
      } as unknown as ProfileData;
    }

    const [dbCategories, dbProjects, dbCertificates] = await Promise.all([
      db.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
          _count: {
            select: {
              projects: {
                where: { isPublished: true },
              },
            },
          },
        },
      }),
      db.project.findMany({
        where: { isPublished: true },
        orderBy: [
          { isFeatured: "desc" },
          { sortOrder: "asc" },
          { createdAt: "desc" },
        ],
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: "asc" },
          },
          links: true,
        },
      }),
      db.certificate.findMany({
        orderBy: [
          { sortOrder: "asc" },
          { createdAt: "desc" },
        ],
      }),
    ]);

    categories = dbCategories as unknown as CategoryData[];
    projects = dbProjects as unknown as ProjectData[];
    certificates = dbCertificates as unknown as CertificateData[];
  } catch (error) {
    console.error("Database query fallback engaged:", error);
  }

  return (
    <ShowcaseClient
      profile={profile}
      categories={categories}
      initialProjects={projects}
      certificates={certificates}
    />
  );
}
