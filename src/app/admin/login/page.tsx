"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, KeyRound, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background text-foreground">
      <div className="w-full max-w-sm space-y-6">
        {/* Prominent Back Link to User Showcase */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-xs transition-colors"
        >
          <ArrowLeft className="size-4 shrink-0 text-blue-500" />
          <span>&larr; Back to Portfolio (Live Preview)</span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-6 shadow-xl space-y-5">
          <div className="space-y-1 text-center">
            <div className="size-10 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Lock className="size-5 shrink-0" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Admin Access
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Enter your master administrative key to manage projects and profile data.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
              <ShieldAlert className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider"
              >
                Admin Secret Password
              </label>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-3 size-4 text-zinc-400 pointer-events-none shrink-0" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="pl-9"
                  autoFocus
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-center">
            <p className="text-[11px] text-zinc-400 font-mono">
              Default demo key: <code className="text-zinc-700 dark:text-zinc-300 font-bold">admin</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
