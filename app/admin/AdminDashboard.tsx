"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProjectUploadForm from "./ProjectUploadForm";
import ProjectsList from "./ProjectsList";

export default function AdminDashboard() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <div className="fixed inset-0 bg-[#0f1117] flex flex-col overflow-hidden">

      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-8 py-5 border-b border-white/10 bg-[#0f1117]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-sm font-semibold text-white/90 tracking-wide">
            Studio Admin
          </span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="/"
            className="text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            ← Back to gallery
          </a>
          <button
            onClick={handleLogout}
            className="text-xs text-white/50 hover:text-red-400 transition-colors"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex min-h-0 overflow-hidden">

        {/* Left: Upload form */}
        <div className="flex-1 overflow-y-auto p-8 border-r border-white/10">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium mb-6">
            New Project
          </p>
          <ProjectUploadForm onSuccess={() => setRefreshKey((k) => k + 1)} />
        </div>

        {/* Right: Projects list */}
        <div className="w-[360px] xl:w-[420px] flex-shrink-0 p-6 flex flex-col min-h-0 bg-[#0c0e14]">
          <ProjectsList refreshKey={refreshKey} />
        </div>

      </div>
    </div>
  );
}
