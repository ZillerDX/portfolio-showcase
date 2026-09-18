import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function runVerification() {
  console.log("==================================================");
  console.log("  WATERFALL SDLC: AUTOMATED VERIFICATION SUITE");
  console.log("==================================================");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] Test ${totalTests}: ${message}`);
      passedTests++;
    } else {
      console.error(`[FAIL] Test ${totalTests}: ${message}`);
      process.exitCode = 1;
    }
  }

  try {
    // 1. Profile Verification
    console.log("\n--- Suite 1: Profile & Executive Credentials ---");
    const profile = await prisma.profile.findUnique({ where: { id: "default" } });
    assert(profile !== null, "Profile record 'default' exists in SQLite database");
    assert(profile.name.length > 0, `Profile name is populated: '${profile.name}'`);
    assert(profile.resumePdfUrl.endsWith(".pdf"), `Resume PDF path is valid: '${profile.resumePdfUrl}'`);
    assert(profile.contactEmail.includes("@"), `Contact email is formatted: '${profile.contactEmail}'`);

    // 2. Category & Project Relational Verification
    console.log("\n--- Suite 2: Categories & Relational Projects ---");
    const categories = await prisma.category.findMany({ include: { projects: true } });
    assert(categories.length >= 4, `At least 4 project categories configured (Found: ${categories.length})`);

    const projects = await prisma.project.findMany({
      include: { category: true, images: true, links: true }
    });
    assert(projects.length >= 4, `At least 4 showcase projects exist (Found: ${projects.length})`);

    const featuredProjects = projects.filter(p => p.isFeatured);
    assert(featuredProjects.length > 0, `Featured projects filter functional (Found: ${featuredProjects.length})`);

    for (const project of projects) {
      assert(project.category !== null, `Project '${project.title}' is linked to valid category`);
      assert(project.coverImage.length > 0, `Project '${project.title}' has cover image`);
      if (project.pdfFile) {
        assert(project.pdfFile.endsWith(".pdf"), `Project '${project.title}' has valid PDF path`);
      }
    }

    // 3. Storage Integrity Verification
    console.log("\n--- Suite 3: Local Storage & Asset Integrity ---");
    const publicDir = path.join(process.cwd(), "public");
    
    // Check resume
    const resumePath = path.join(publicDir, profile.resumePdfUrl);
    assert(fs.existsSync(resumePath), `Resume PDF exists on disk: ${profile.resumePdfUrl}`);

    // Check project covers and PDFs
    for (const project of projects) {
      const coverPath = path.join(publicDir, project.coverImage);
      assert(fs.existsSync(coverPath), `Cover image exists on disk for: ${project.slug}`);
      if (project.pdfFile) {
        const pdfPath = path.join(publicDir, project.pdfFile);
        assert(fs.existsSync(pdfPath), `PDF dossier exists on disk for: ${project.slug}`);
      }
    }

    // 4. Admin CRUD Lifecycle Verification
    console.log("\n--- Suite 4: Admin CRUD Lifecycle Simulation ---");
    const testSlug = `automated-test-${Date.now()}`;
    const testProject = await prisma.project.create({
      data: {
        title: "Automated Integration Test Project",
        slug: testSlug,
        summary: "Created during Waterfall SDLC Phase 5 automated verification.",
        contentMarkdown: "## Verification Test\nValidating CRUD pipeline.",
        coverImage: "/uploads/images/project-apex.svg",
        pdfFile: "/uploads/documents/apex-whitepaper.pdf",
        categoryId: categories[0].id,
        tagsJson: JSON.stringify(["Test", "TypeScript", "Prisma"]),
        isPublished: true,
        isFeatured: false,
        links: {
          create: [{ label: "Test Link", url: "https://example.com", type: "external" }]
        },
        images: {
          create: [{ imageUrl: "/uploads/images/project-apex.svg", caption: "Test Caption" }]
        }
      },
      include: { links: true, images: true }
    });

    assert(testProject.id.length > 0, "Created test project via Prisma ORM");
    assert(testProject.links.length === 1, "Persisted relational links on test project");
    assert(testProject.images.length === 1, "Persisted relational gallery images on test project");

    // Clean up
    await prisma.projectLink.deleteMany({ where: { projectId: testProject.id } });
    await prisma.projectImage.deleteMany({ where: { projectId: testProject.id } });
    await prisma.project.delete({ where: { id: testProject.id } });
    const deletedCheck = await prisma.project.findUnique({ where: { id: testProject.id } });
    assert(deletedCheck === null, "Successfully deleted test project (clean teardown)");

    // 5. Certifications Verification
    console.log("\n--- Suite 5: Verified Credentials & Certifications ---");
    const certificates = await prisma.certificate.findMany();
    assert(certificates.length >= 3, `Certificates stored in database (Found: ${certificates.length})`);
    for (const cert of certificates) {
      if (cert.fileUrl) {
        const certPath = path.join(publicDir, cert.fileUrl);
        assert(fs.existsSync(certPath), `Certificate PDF exists on disk: ${cert.fileUrl}`);
      }
    }

    console.log("\n==================================================");
    console.log(`  VERIFICATION RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
    console.log("==================================================");

  } catch (error) {
    console.error("Verification failed with runtime error:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

runVerification();
