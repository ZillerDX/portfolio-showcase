import React from "react";

export function OfficialYoutubeIcon({ className = "w-6 h-4.5 shrink-0" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 20" className={className} fill="none" aria-hidden="true">
      <path
        d="M27.414 3.067a3.518 3.518 0 0 0-2.476-2.492C22.755 0 14 0 14 0S5.245 0 3.062.575A3.518 3.518 0 0 0 .586 3.067C0 5.264 0 9.85 0 9.85s0 4.586.586 6.783a3.518 3.518 0 0 0 2.476 2.492C5.245 19.7 14 19.7 14 19.7s8.755 0 10.938-.575a3.518 3.518 0 0 0 2.476-2.492C28 14.436 28 9.85 28 9.85s0-4.586-.586-6.783z"
        fill="#FF0000"
      />
      <polygon points="11.2 14.1 18.2 9.85 11.2 5.6" fill="#FFFFFF" />
    </svg>
  );
}
