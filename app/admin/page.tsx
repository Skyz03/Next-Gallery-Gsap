import Link from "next/link";
import ProjectUploadForm from "./ProjectUploadForm";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium text-[#1a1a1a]">Admin</h1>
            <p className="mt-1 text-sm text-black/60">
              Create a new project. It will appear on the main gallery.
            </p>
          </div>
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-wider text-black/60 hover:text-[#1a1a1a]"
          >
            ← Back to gallery
          </Link>
        </div>

        <section className="rounded-lg border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-black/70">
            New project
          </h2>
          <ProjectUploadForm />
        </section>
      </div>
    </div>
  );
}
