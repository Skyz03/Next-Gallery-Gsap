"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ProjectRow = {
  id: string;
  title: string;
  client: string;
  category: string;
  cover_image: string;
  created_at: string;
};

const TABS = ["all", "wedding", "music", "commercial"] as const;
type Tab = (typeof TABS)[number];

const categoryBadge: Record<string, string> = {
  wedding: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  music: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  commercial: "bg-sky-500/15 text-sky-400 border-sky-500/25",
};

export default function ProjectsList({ refreshKey }: { refreshKey: number }) {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("projects")
      .select("id, title, client, category, cover_image, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProjects((data as ProjectRow[]) ?? []);
        setLoading(false);
      });
  }, [refreshKey]);

  async function handleDelete(id: string) {
    setDeleting(id);
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
    setDeleting(null);
    setConfirmId(null);
  }

  const filtered = tab === "all" ? projects : projects.filter((p) => p.category === tab);

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-white/80">
          Projects{" "}
          <span className="text-white/35 font-normal text-xs ml-1">({projects.length})</span>
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
              tab === t
                ? "bg-white/10 text-white/90"
                : "text-white/40 hover:text-white/70 hover:bg-white/[0.05]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 rounded-full border-2 border-white/15 border-t-white/60 animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="text-white/15 text-4xl">○</div>
            <p className="text-sm text-white/30">No projects yet</p>
          </div>
        )}

        {!loading && filtered.map((p) => (
          <div
            key={p.id}
            className="group flex items-center gap-3 rounded-xl p-3 border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
              {p.cover_image ? (
                <img
                  src={p.cover_image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">?</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/85 truncate leading-snug">{p.title}</p>
              <p className="text-xs text-white/45 truncate mt-0.5">{p.client}</p>
              <span className={`inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize ${categoryBadge[p.category] ?? "bg-white/10 text-white/40 border-white/15"}`}>
                {p.category}
              </span>
            </div>

            {/* Delete */}
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {confirmId === p.id ? (
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded border border-red-500/30 hover:border-red-400/60 w-full"
                  >
                    {deleting === p.id ? "…" : "Delete"}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="text-xs text-white/35 hover:text-white/60 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(p.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all text-base"
                  title="Delete project"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
