"use client";

import { useState, useRef } from "react";

type FilePreview = { file: File; preview: string };

const CATEGORIES = ["wedding", "music", "commercial"] as const;
type Category = (typeof CATEGORIES)[number];

const inputClass =
  "w-full bg-white/[0.06] border border-white/15 rounded-lg px-4 py-3 text-white/90 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all";

const labelClass = "block text-xs font-medium text-white/60 mb-2";

export default function ProjectUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [category, setCategory] = useState<Category>("wedding");
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const dragIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const isInternalDrag = useRef(false);

  function addFiles(incoming: File[]) {
    const valid = incoming.filter((f) => f.type.startsWith("image/"));
    const previews: FilePreview[] = valid.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setFiles((prev) => [...prev, ...previews]);
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(e.currentTarget.files ?? []));
    e.currentTarget.value = "";
  }

  function handleZoneDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (isInternalDrag.current) return;
    addFiles(Array.from(e.dataTransfer.files));
  }

  function handleZoneDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!isInternalDrag.current) setIsDragOver(true);
  }

  function handleRemove(index: number) {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  function handleReorderDragStart(e: React.DragEvent, index: number) {
    isInternalDrag.current = true;
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
  }

  function handleReorderDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(index);
  }

  function handleReorderDrop(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.stopPropagation();
    const from = dragIndex.current;
    if (from !== null && from !== index) {
      setFiles((prev) => {
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        next.splice(index, 0, moved);
        return next;
      });
    }
    dragIndex.current = null;
    setDragOverIndex(null);
    isInternalDrag.current = false;
  }

  function handleReorderDragEnd() {
    dragIndex.current = null;
    setDragOverIndex(null);
    isInternalDrag.current = false;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (files.length === 0) {
      setStatus("error");
      setMessage("Add at least one image.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("category", category);
    formData.set("aspect", "portrait");
    files.forEach((fp) => formData.append("files", fp.file));

    try {
      const res = await fetch("/api/projects", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error ?? `Upload failed (${res.status}).`);
        return;
      }
      setStatus("success");
      setMessage("Project created successfully.");
      form.reset();
      files.forEach((fp) => URL.revokeObjectURL(fp.preview));
      setFiles([]);
      onSuccess();
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-xl">

      {/* Category */}
      <div>
        <p className={labelClass}>Category</p>
        <div className="flex gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`px-4 py-2 text-xs font-medium rounded-lg capitalize transition-all duration-200 ${
                category === c
                  ? "bg-white text-black shadow-sm"
                  : "bg-white/[0.06] border border-white/15 text-white/60 hover:text-white/90 hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className={labelClass}>Title</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="e.g. Sumit & Britannice"
          className={inputClass}
          disabled={status === "loading"}
        />
      </div>

      {/* Client + Location side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="client" className={labelClass}>Client</label>
          <input
            id="client"
            name="client"
            type="text"
            required
            placeholder="e.g. Marco & Brittney"
            className={inputClass}
            disabled={status === "loading"}
          />
        </div>
        <div>
          <label htmlFor="location" className={labelClass}>Location</label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g. Kathmandu"
            className={inputClass}
            disabled={status === "loading"}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Short project story…"
          className={`${inputClass} resize-none`}
          disabled={status === "loading"}
        />
      </div>

      {/* Drop zone */}
      <div>
        <p className={labelClass}>Images <span className="text-white/35 font-normal">(first image becomes cover)</span></p>
        <div
          onDrop={handleZoneDrop}
          onDragOver={handleZoneDragOver}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer select-none py-12 px-6 text-center ${
            isDragOver
              ? "border-white/50 bg-white/[0.06]"
              : "border-white/20 hover:border-white/35 hover:bg-white/[0.03]"
          }`}
        >
          <div className="text-3xl text-white/40">↑</div>
          <div>
            <p className="text-sm text-white/60">
              Drop images here or{" "}
              <span className="text-white underline underline-offset-2 font-medium">browse</span>
            </p>
            <p className="text-xs text-white/30 mt-1">JPG, PNG, WEBP supported</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>
      </div>

      {/* Image previews */}
      {files.length > 0 && (
        <div>
          <p className="text-xs font-medium text-white/60 mb-3">
            {files.length} image{files.length !== 1 ? "s" : ""} selected{" "}
            <span className="text-white/35 font-normal">— drag to reorder</span>
          </p>
          <div className="grid grid-cols-4 gap-2">
            {files.map((fp, i) => (
              <div
                key={fp.preview}
                draggable
                onDragStart={(e) => handleReorderDragStart(e, i)}
                onDragOver={(e) => handleReorderDragOver(e, i)}
                onDrop={(e) => handleReorderDrop(e, i)}
                onDragEnd={handleReorderDragEnd}
                className={`relative group cursor-grab active:cursor-grabbing rounded-lg overflow-hidden transition-all duration-150 ${
                  dragOverIndex === i && dragIndex.current !== i
                    ? "ring-2 ring-white/70 scale-105"
                    : dragIndex.current === i
                    ? "opacity-40 scale-95"
                    : ""
                }`}
              >
                <img
                  src={fp.preview}
                  alt={`preview ${i + 1}`}
                  className="w-full aspect-square object-cover"
                  draggable={false}
                />
                {i === 0 && (
                  <div className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[9px] tracking-wider px-2 py-0.5 rounded-md uppercase font-semibold">
                    Cover
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/80 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status message */}
      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
          status === "error"
            ? "bg-red-500/10 border border-red-500/30 text-red-400"
            : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
        }`}>
          {message}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading" || files.length === 0}
        className="w-full py-3.5 text-sm font-semibold rounded-lg transition-all duration-200 bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {status === "loading"
          ? `Uploading ${files.length} image${files.length !== 1 ? "s" : ""}…`
          : "Create Project"}
      </button>

    </form>
  );
}
