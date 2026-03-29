"use client";

import { useSyncExternalStore } from "react";

import {
  getViewerModeSnapshot,
  setViewerMode,
  subscribeToViewerMode,
} from "@/lib/viewer-mode";

export default function ViewerModeToggle() {
  const viewerMode = useSyncExternalStore(
    subscribeToViewerMode,
    getViewerModeSnapshot,
    () => "user",
  );

  const adminModeEnabled = viewerMode === "admin";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-[var(--foreground)]">Viewer mode</span>

      <div
        className="inline-flex rounded-full border border-[#b7aea0] bg-[#f4efe6] p-1"
        role="group"
        aria-label="Select viewer mode"
      >
        <button
          type="button"
          onClick={() => setViewerMode("user")}
          className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4f4a] focus-visible:ring-offset-1 focus-visible:ring-offset-[#f4efe6] ${
            adminModeEnabled
              ? "text-[#4f4a41]"
              : "bg-[#1f4f4a] text-white shadow-sm"
          }`}
          aria-pressed={!adminModeEnabled}
        >
          User
        </button>

        <button
          type="button"
          onClick={() => setViewerMode("admin")}
          className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4f4a] focus-visible:ring-offset-1 focus-visible:ring-offset-[#f4efe6] ${
            adminModeEnabled
              ? "bg-[#1f4f4a] text-white shadow-sm"
              : "text-[#4f4a41]"
          }`}
          aria-pressed={adminModeEnabled}
        >
          Admin
        </button>
      </div>
    </div>
  );
}
