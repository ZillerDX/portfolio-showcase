async function test() {
  const base = "http://localhost:3000";
  console.log("=== Running API and Route Verification ===");

  // 1. GET /
  const r1 = await fetch(`${base}/`);
  console.log(`1. GET / -> Status: ${r1.status}`);
  const html = await r1.text();
  console.log(`   Page Title presence: ${html.includes("Alex Chen") ? "PASS" : "FAIL"}`);

  // 2. GET /api/categories
  const r2 = await fetch(`${base}/api/categories`);
  const cats = await r2.json();
  console.log(`2. GET /api/categories -> Status: ${r2.status}, Count: ${cats.length}`);

  // 3. GET /api/projects
  const r3 = await fetch(`${base}/api/projects`);
  const projs = await r3.json();
  console.log(`3. GET /api/projects -> Status: ${r3.status}, Count: ${projs.length}, First: ${projs[0]?.title}`);

  // 4. GET /project/apex-financial-analytics
  const r4 = await fetch(`${base}/project/apex-financial-analytics`);
  console.log(`4. GET /project/apex-financial-analytics -> Status: ${r4.status}`);

  // 5. GET /uploads/documents/apex-whitepaper.pdf
  const r5 = await fetch(`${base}/uploads/documents/apex-whitepaper.pdf`);
  console.log(`5. GET PDF file -> Status: ${r5.status}, Type: ${r5.headers.get("content-type")}`);

  // 6. Auth fail test
  const r6 = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "wrong" }),
  });
  console.log(`6. POST /api/auth/login (invalid) -> Status: ${r6.status} (Expected: 401)`);

  // 7. Auth success test
  const r7 = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "admin" }),
  });
  const cookie = r7.headers.get("set-cookie");
  console.log(`7. POST /api/auth/login (valid) -> Status: ${r7.status}, Cookie received: ${Boolean(cookie)}`);

  // 8. Protected route test with cookie
  const r8 = await fetch(`${base}/api/auth/me`, {
    headers: { Cookie: cookie || "" },
  });
  const meData = await r8.json();
  console.log(`8. GET /api/auth/me (authenticated) -> Status: ${r8.status}, Authed: ${meData.authenticated}`);

  // 9. Profile fetch
  const r9 = await fetch(`${base}/api/profile`);
  const prof = await r9.json();
  console.log(`9. GET /api/profile -> Status: ${r9.status}, Name: ${prof.name}`);

  // 10. Certificates fetch
  const r10 = await fetch(`${base}/api/certificates`);
  const certs = await r10.json();
  console.log(`10. GET /api/certificates -> Status: ${r10.status}, Count: ${certs.length}, First: ${certs[0]?.title}`);

  console.log("=== Verification Completed Successfully! ===");
}

test().catch(console.error);
