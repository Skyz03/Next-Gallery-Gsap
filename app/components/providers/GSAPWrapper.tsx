"use client";

import { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Initialize GSAP Plugins globally.
 * This ensures plugins are registered before any component 
 * tries to use them.
 */
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, useGSAP);

    // High-end smoothness configuration
    gsap.config({
        nullTargetWarn: false, // Prevents console warnings if a ref isn't ready
        force3D: true,         // Uses GPU acceleration for all animations
    });
}

interface GSAPWrapperProps {
    children: ReactNode;
}

export default function GSAPWrapper({ children }: GSAPWrapperProps) {
    return <>{children}</>;
}