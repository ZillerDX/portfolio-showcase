import path from "path";
import fs from "fs";
import os from "os";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = path.join(os.tmpdir(), "dev.db");
    const sourceDb = path.resolve(process.cwd(), "prisma", "dev.db");

    if (fs.existsSync(sourceDb)) {
      let needsCopy = !fs.existsSync(tmpDbPath);
      if (!needsCopy) {
        try {
          const srcStat = fs.statSync(sourceDb);
          const tmpStat = fs.statSync(tmpDbPath);
          if (srcStat.mtimeMs > tmpStat.mtimeMs || srcStat.size !== tmpStat.size) {
            needsCopy = true;
          }
        } catch {
          needsCopy = true;
        }
      }

      if (needsCopy) {
        try {
          fs.copyFileSync(sourceDb, tmpDbPath);
        } catch (e) {
          console.warn("Could not copy sqlite db to temp dir:", e);
        }
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }

  const localDb = path.resolve(process.cwd(), "prisma", "dev.db");
  return `file:${localDb}`;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
