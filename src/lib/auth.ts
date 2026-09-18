import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "portfolio_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

function getSecretKey(): string {
  return process.env.SESSION_SECRET || "default-portfolio-secret-key-minimum-32-chars-long";
}

export function createSessionToken(): string {
  const issuedAt = Date.now();
  const payload = JSON.stringify({ admin: true, iat: issuedAt });
  const payloadBase64 = Buffer.from(payload).toString("base64url");
  
  const hmac = crypto.createHmac("sha256", getSecretKey());
  hmac.update(payloadBase64);
  const signature = hmac.digest("base64url");
  
  return `${payloadBase64}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    
    const [payloadBase64, signature] = parts;
    const hmac = crypto.createHmac("sha256", getSecretKey());
    hmac.update(payloadBase64);
    const expectedSignature = hmac.digest("base64url");
    
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length) return false;
    
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return false;
    }
    
    const payloadJson = Buffer.from(payloadBase64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);
    
    // Check expiration (7 days)
    const elapsed = Date.now() - payload.iat;
    if (elapsed > SESSION_MAX_AGE * 1000) {
      return false;
    }
    
    return payload.admin === true;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get(COOKIE_NAME);
  if (!tokenCookie || !tokenCookie.value) {
    return false;
  }
  return verifySessionToken(tokenCookie.value);
}

export async function setAdminSession(): Promise<string> {
  const token = createSessionToken();
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return token;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function verifyAdminPassword(password: string): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD || "admin";
  return password === expectedPassword;
}
