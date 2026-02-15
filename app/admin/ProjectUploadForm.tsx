"use client";

import { useState } from "react";

const labelClass = "block text-xs font-medium uppercase tracking-wider text-black/60 mb-1.5";
const inputClass =
  "w-full max-w-md rounded border border-black/10 bg-white px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-black/35 focus:border-black/25 focus:outline-none focus:ring-1 focus:ring-black/10";

export default function ProjectUploadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const files = formData.getAll("files") as File[];
    if (files.length === 0 || (files.length === 1 && files[0].size === 0)) {
      setStatus("error");
      setMessage("Please select at least one image.");
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error ?? `Upload failed (${res.status}).`);
        return;
      }

      setStatus("success");
      setMessage("Project created successfully.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
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

      <div>
        <label htmlFor="client" className={labelClass}>
          Client
        </label>
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
        <label htmlFor="location" className={labelClass}>
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="e.g. Thamel, Kathmandu"
          className={inputClass}
          disabled={status === "loading"}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Short project story..."
          className={inputClass}
          disabled={status === "loading"}
        />
      </div>

      <div>
        <label htmlFor="aspect" className={labelClass}>
          Aspect
        </label>
        <select
          id="aspect"
          name="aspect"
          className={inputClass}
          disabled={status === "loading"}
          defaultValue="portrait"
        >
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </div>

      <div>
        <label htmlFor="files" className={labelClass}>
          Images (first = cover)
        </label>
        <input
          id="files"
          name="files"
          type="file"
          accept="image/*"
          multiple
          required
          className="w-full max-w-md text-sm text-black/70 file:mr-3 file:rounded file:border-0 file:bg-black/10 file:px-3 file:py-2 file:text-xs file:font-medium file:text-[#1a1a1a] hover:file:bg-black/15"
          disabled={status === "loading"}
        />
        <p className="mt-1 text-[11px] text-black/50">
          Select one or more images. The first image is used as the cover.
        </p>
      </div>

      {message && (
        <p
          className={
            status === "error"
              ? "text-sm text-red-600"
              : "text-sm text-emerald-700"
          }
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded border border-black/20 bg-[#1a1a1a] px-4 py-2 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-black disabled:opacity-50"
      >
        {status === "loading" ? "Uploading…" : "Create project"}
      </button>
    </form>
  );
}
