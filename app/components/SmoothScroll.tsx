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
      // Prevents conflicts with touch-specific momentum
      touchMultiplier: 1.5, 
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const startAutoScroll = () => {
      if (isAutoScrolling.current) return;
      
      isAutoScrolling.current = true;
      // Calculate a distant point to scroll toward slowly
      const target = window.scrollY + 3000; 
      
      lenis.scrollTo(target, {
        duration: 40, // Much slower for cinematic feel
        easing: (t) => t, // Linear
        onComplete: () => { isAutoScrolling.current = false; }
      });
    };

    const stopAutoScroll = () => {
      if (isAutoScrolling.current) {
        // Gently stop the programmatic scroll so touch can take over
        lenis.stop();
        lenis.start();
        isAutoScrolling.current = false;
      }
    };

    const handleUserInteraction = () => {
      stopAutoScroll();

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(() => {
        // Only start auto-scroll if the user isn't currently touching/scrolling
        startAutoScroll();
      }, 5000);
    };

    // Events to watch
    const events = ['mousedown', 'wheel', 'touchstart', 'keydown', 'mousemove'];
    events.forEach(e => window.addEventListener(e, handleUserInteraction, { passive: true }));

    handleUserInteraction();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(e => window.removeEventListener(e, handleUserInteraction));
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}