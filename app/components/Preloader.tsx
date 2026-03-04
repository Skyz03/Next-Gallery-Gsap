"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            onComplete: () => onComplete(),
        });

        // 1. Set initial states
        gsap.set([textRef.current, lineRef.current], { opacity: 0 });

        tl.to(containerRef.current, {
            opacity: 1,
            duration: 0.2,
        })
            // 2. Reveal "Namaste" elegantly
            .to(textRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: "power3.out",
                startAt: { y: 20 },
            })
            // 3. Draw the minimalist accent line
            .to(lineRef.current, {
                opacity: 1,
                width: "60px",
                duration: 1,
                ease: "expo.inOut",
            }, "-=0.5")
            // 4. Hold for a moment of "quiet"
            .to({}, { duration: 0.5 })
            // 5. Exit: The curtain lift
            .to(containerRef.current, {
                yPercent: -100,
                duration: 1.2,
                ease: "expo.inOut",
            });
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-[#0a0a0a] text-white"
        >
            <div className="overflow-hidden flex flex-col items-center">
                <h1
                    ref={textRef}
                    className="font-serif italic text-3xl md:text-5xl tracking-widest lowercase"
                >
                    Namaste Studio
                </h1>
                <div
                    ref={lineRef}
                    className="h-[1px] bg-white/30 mt-6 w-0"
                />
            </div>
        </div>
    );
}