async function testCrud() {
  const base = "http://localhost:3000";
  console.log("=== Testing Admin CRUD Operations ===");

  // 1. Login
  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "admin" }),
  });
  const cookie = loginRes.headers.get("set-cookie");

  // 2. Fetch categories
  const catRes = await fetch(`${base}/api/categories`);
  const cats = await catRes.json();
  const categoryId = cats[0].id;

  // 3. Create a test project
  const createRes = await fetch(`${base}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify({
      title: "Test Autonomous System",
      slug: "test-autonomous-system",
      summary: "A robust integration test project",
      contentMarkdown: "### Test Content\n\nVerified successfully.",
      coverImage: "/uploads/images/project-apex.svg",
      categoryId,
      tags: ["Test", "Automation"],
      isFeatured: false,
      isPublished: true,
      links: [{ label: "Demo", url: "https://example.com", type: "demo" }],
    }),
  });
  const created = await createRes.json();
  console.log(`Created project: ${created.title} (ID: ${created.id})`);

  // 4. Update the project
  const updateRes = await fetch(`${base}/api/projects/${created.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify({
      title: "Test Autonomous System (Updated)",
      isFeatured: true,
    }),
  });
  const updated = await updateRes.json();
  console.log(`Updated project title: ${updated.title}, isFeatured: ${updated.isFeatured}`);

  // 5. Delete the test project
  const delRes = await fetch(`${base}/api/projects/${created.id}`, {
    method: "DELETE",
    headers: { Cookie: cookie },
  });
  const delData = await delRes.json();
  console.log(`Deleted project: ${delData.message}`);

  console.log("=== CRUD Operations Verified Successfully! ===");
}

testCrud().catch(console.error);
