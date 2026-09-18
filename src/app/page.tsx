import { db } from "@/lib/db";
import { ShowcaseClient } from "@/components/public/showcase-client";
import { ProfileData, CategoryData, ProjectData, CertificateData } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let profile = await db.profile.findUnique({
    where: { id: "default" },
  });

  if (!profile) {
    profile = await db.profile.create({
      data: {
        id: "default",
        name: "Tanathon Chanapha",
        title: "Full-Stack & Systems Architect | Software Engineer",
        bio: "Engineering high-performance enterprise systems, autonomous AI agents, digital twin platforms, and modern web architectures with disciplined software craft.",
        avatarUrl: "/uploads/images/avatar.png",
        resumePdfUrl: "/uploads/documents/tanathon-chanapha-resume.pdf",
        availableForWork: true,
        availabilityText: "Open to high-impact software engineering & architecture opportunities",
        contactEmail: "bostziller03x@gmail.com",
        githubUrl: "https://github.com/ZillerDX",
        linkedinUrl: "https://www.linkedin.com/in/tanathon-chanapha-452177427",
        twitterUrl: "https://th.jobsdb.com/th/profiles/tanathon-chanapha-R26rW062z5",
        location: "Bangkok, Thailand (UTC+7)",
        skillsJson: JSON.stringify([]),
      },
    });
  }

  const [categories, projects, certificates] = await Promise.all([
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

  return (
    <ShowcaseClient
      profile={profile as unknown as ProfileData}
      categories={categories as unknown as CategoryData[]}
      initialProjects={projects as unknown as ProjectData[]}
      certificates={certificates as unknown as CertificateData[]}
    />
  );
}
