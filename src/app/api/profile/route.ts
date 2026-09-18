import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
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
          resumePdfUrl: "/uploads/documents/alex-chen-resume.pdf",
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

    return NextResponse.json(profile);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const updated = await db.profile.upsert({
      where: { id: "default" },
      update: {
        name: body.name,
        title: body.title,
        bio: body.bio,
        avatarUrl: body.avatarUrl,
        resumePdfUrl: body.resumePdfUrl,
        availableForWork: Boolean(body.availableForWork),
        availabilityText: body.availabilityText,
        contactEmail: body.contactEmail,
        githubUrl: body.githubUrl,
        linkedinUrl: body.linkedinUrl,
        twitterUrl: body.twitterUrl,
        location: body.location,
        skillsJson: typeof body.skillsJson === "string" ? body.skillsJson : JSON.stringify(body.skillsJson || []),
      },
      create: {
        id: "default",
        name: body.name || "Alex Chen",
        title: body.title || "Senior Full-Stack Architect",
        bio: body.bio || "",
        avatarUrl: body.avatarUrl || "/uploads/images/avatar.svg",
        resumePdfUrl: body.resumePdfUrl || "",
        availableForWork: Boolean(body.availableForWork),
        availabilityText: body.availabilityText || "Available for projects",
        contactEmail: body.contactEmail || "",
        githubUrl: body.githubUrl || "",
        linkedinUrl: body.linkedinUrl || "",
        twitterUrl: body.twitterUrl || "",
        location: body.location || "",
        skillsJson: typeof body.skillsJson === "string" ? body.skillsJson : JSON.stringify(body.skillsJson || []),
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
