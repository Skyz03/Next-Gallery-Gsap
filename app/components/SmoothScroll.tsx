"use client";
import Lenis from "lenis";
import { useEffect, useRef } from "react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAutoScrolling = useRef(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(raf);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const startAutoScroll = () => {
      if (isAutoScrolling.current) return;
      isAutoScrolling.current = true;
      const target = window.scrollY + 3000;
      lenis.scrollTo(target, {
        duration: 40,
        easing: (t) => t,
        onComplete: () => { isAutoScrolling.current = false; }
      });
    };

    const stopAutoScroll = () => {
      if (isAutoScrolling.current) {
        isAutoScrolling.current = false;
        // Snap Lenis to the current position — this cancels the active scrollTo animation
        lenis.scrollTo(window.scrollY, { immediate: true });
      }
    };

    let lastMove = 0;
    const handleUserInteraction = (e: Event) => {
      if (e.type === "mousemove") {
        const now = Date.now();
        if (now - lastMove < 100) return;
        lastMove = now;
      }
      stopAutoScroll();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(startAutoScroll, 5000);
    };

    const events = ["mousedown", "wheel", "touchstart", "keydown", "mousemove"];
    events.forEach(e => window.addEventListener(e, handleUserInteraction, { passive: true }));

    handleUserInteraction(new Event("init"));

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(e => window.removeEventListener(e, handleUserInteraction));
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
