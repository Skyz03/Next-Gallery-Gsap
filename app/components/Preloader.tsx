"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    const tensRef = useRef<HTMLDivElement>(null);
    const onesRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const counter = { value: 0 };

        const tl = gsap.timeline({
            onComplete: () => onComplete(),
        });

        gsap.set([textRef.current, lineRef.current], { opacity: 0 });

        // Rolling number animation
        gsap.to(counter, {
            value: 100,
            duration: 3.2,
            ease: "power2.out",
            onUpdate: () => {
                const num = Math.floor(counter.value);

                const tens = Math.floor(num / 10);
                const ones = num % 10;

                gsap.to(tensRef.current, {
                    y: -tens * 20,
                    duration: 0.3,
                    ease: "power2.out",
                });

                gsap.to(onesRef.current, {
                    y: -ones * 20,
                    duration: 0.3,
                    ease: "power2.out",
                });
            },
        });

        tl.to(containerRef.current, {
            opacity: 1,
            duration: 0.2,
        })
            .to(textRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: "power3.out",
                startAt: { y: 20 },
            })
            .to(
                lineRef.current,
                {
                    opacity: 1,
                    width: "60px",
                    duration: 1,
                    ease: "expo.inOut",
                },
                "-=0.5"
            )
            .to({}, { duration: 0.5 })
            .to(containerRef.current, {
                yPercent: -100,
                duration: 1.2,
                ease: "expo.inOut",
            });
    }, { scope: containerRef });

    const numbers = Array.from({ length: 10 }, (_, i) => i);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-[#0a0a0a] text-white"
        >
            {/* Center Content */}
            <div className="overflow-hidden flex flex-col items-center">
                <h1
                    ref={textRef}
                    className="font-serif italic text-3xl md:text-5xl tracking-widest lowercase"
                >
                    Namaste Studio
                </h1>

                <div ref={lineRef} className="h-[1px] bg-white/30 mt-6 w-0" />
            </div>

            {/* Rolling Counter */}
            <div className="absolute bottom-6 left-6 flex items-end font-mono text-sm tracking-widest text-white/70 overflow-hidden h-[20px]">
                {/* Tens */}
                <div className="overflow-hidden h-[20px]">
                    <div ref={tensRef}>
                        {numbers.map((n) => (
                            <div key={n} className="h-[20px]">
                                {n}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ones */}
                <div className="overflow-hidden h-[20px]">
                    <div ref={onesRef}>
                        {numbers.map((n) => (
                            <div key={n} className="h-[20px]">
                                {n}
                            </div>
                        ))}
                    </div>
                </div>

                <span>%</span>
            </div>
        </div>
    );
}