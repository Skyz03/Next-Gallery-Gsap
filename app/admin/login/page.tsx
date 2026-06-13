"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [shake, setShake] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const password = inputRef.current?.value ?? "";
    if (!password) return;

    setStatus("loading");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.replace("/admin");
    } else {
      setStatus("error");
      setShake(true);
      if (inputRef.current) inputRef.current.value = "";
      setTimeout(() => setShake(false), 600);
    }
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-full max-w-sm px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-white/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <div className="h-px w-8 bg-white/20" />
          </div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 font-medium">
            Studio Admin
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className={`transition-transform ${shake ? "animate-[shake_0.4s_ease]" : ""}`}>
            <input
              ref={inputRef}
              type="password"
              placeholder="Password"
              autoFocus
              autoComplete="current-password"
              disabled={status === "loading"}
              className="w-full bg-transparent border-b border-white/15 pb-3 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors tracking-widest"
            />
            {status === "error" && (
              <p className="mt-2 text-[11px] text-red-400/80 tracking-wider">
                Incorrect password.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 text-[10px] tracking-[0.4em] uppercase font-medium text-white/60 hover:text-white/90 border border-white/10 hover:border-white/25 rounded transition-all duration-300 disabled:opacity-30"
          >
            {status === "loading" ? "Verifying…" : "Enter"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
