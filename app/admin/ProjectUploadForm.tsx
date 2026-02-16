"use client";

import { useState } from "react";

const labelClass = "block text-xs font-medium uppercase tracking-wider text-black/60 mb-1.5";
const inputClass =
  "w-full max-w-md rounded border border-black/10 bg-white px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-black/35 focus:border-black/25 focus:outline-none focus:ring-1 focus:ring-black/10";

type FilePreview = {
  file: File;
  preview: string;
};

export default function ProjectUploadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.currentTarget.files || []);
    const newFiles: FilePreview[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedFiles(newFiles);
  }

  function handleRemoveFile(index: number) {
    setSelectedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Clean up object URL for removed file
      URL.revokeObjectURL(prev[index].preview);
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (selectedFiles.length === 0) {
      setStatus("error");
      setMessage("Please select at least one image.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Add selected files to formData
    selectedFiles.forEach((filePreview) => {
      formData.append("files", filePreview.file);
    });

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
      setSelectedFiles([]);
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
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="w-full max-w-md text-sm text-black/70 file:mr-3 file:rounded file:border-0 file:bg-black/10 file:px-3 file:py-2 file:text-xs file:font-medium file:text-[#1a1a1a] hover:file:bg-black/15"
          disabled={status === "loading"}
        />
        <p className="mt-1 text-[11px] text-black/50">
          Select one or more images. The first image is used as the cover.
        </p>

        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-black/60">
              Selected: {selectedFiles.length} image{selectedFiles.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {selectedFiles.map((filePreview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={filePreview.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded border border-black/10"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded transition-colors flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Cover
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
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
