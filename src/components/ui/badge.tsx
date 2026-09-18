import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "accent";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-medium transition-colors select-none";

  const variantStyles = {
    default:
      "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900",
    secondary:
      "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/60",
    outline:
      "text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800 bg-transparent",
    success:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
    warning:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
    accent:
      "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 rounded-full gap-1",
    md: "text-xs px-2.5 py-1 rounded-full gap-1.5",
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}
