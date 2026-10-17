"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * LottieBackground Component
 *
 * Scroll-synced paddy crop growth animation that responds to user scroll.
 * Uses GSAP ScrollTrigger for frame-based scrubbing.
 *
 * Growth Stages (mapped to scroll progress):
 * - 0-15%: Seeding (DNA/Plant molecule floating)
 * - 15-45%: Germination (roots with neon-green vitality)
 * - 45-85%: Maturation (paddy crops expanding)
 * - 85-100%: Harvest (golden glow over fully grown crops)
 */
export function LottieBackground() {
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [animationData, setAnimationData] = useState<object | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const growthStageRef = useRef<string>("seeding");
    const opacityRef = useRef<HTMLDivElement>(null);
    const totalFramesRef = useRef<number>(0);

    // Load Lottie JSON asynchronously instead of bundling it
    useEffect(() => {
        let cancelled = false;
        fetch("/animations/paddy-growth.json")
            .then((res) => res.json())
            .then((data) => {
                if (!cancelled) setAnimationData(data);
            })
            .catch((err) => console.warn("Failed to load paddy animation:", err));
        return () => { cancelled = true; };
    }, []);

    // Determine growth stage based on ADJUSTED scroll progress
    // Hero (0-25%): Seeding (Hidden)
    // Statement (25-50%): Germination (Subtle)
    // Science (50-75%): Maturation (Visible)
    // CTA (75-100%): Harvest (Golden)
    const getGrowthStage = useCallback((adjustedProgress: number): string => {
        if (adjustedProgress <= 0) return "seeding";
        if (adjustedProgress < 0.33) return "germination";
        if (adjustedProgress < 0.66) return "maturation";
        return "harvest";
    }, []);

    // Map growth stage to opacity — update via DOM, not React state
    const getStageOpacity = useCallback((stage: string): number => {
        if (stage === "seeding") return 0;
        if (stage === "germination") return 0.15;
        if (stage === "maturation") return 0.25;
        return 0.4;
    }, []);

    // Initialize Lottie and set up scroll-synced animation
    useEffect(() => {
        if (!lottieRef.current || !isLoaded) return;

        const animationItem = lottieRef.current;
        totalFramesRef.current = animationItem.getDuration(true) || 192;
        const HERO_SCROLL_THRESHOLD = 0.25;

        const scrollTrigger = ScrollTrigger.create({
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 1, // Smoother scrubbing (increased from 0.5)
            onUpdate: (self) => {
                const rawProgress = self.progress;
                let adjustedProgress = 0;
                let targetFrame = 0;

                if (rawProgress > HERO_SCROLL_THRESHOLD) {
                    adjustedProgress = (rawProgress - HERO_SCROLL_THRESHOLD) / (1 - HERO_SCROLL_THRESHOLD);
                    targetFrame = Math.floor(adjustedProgress * totalFramesRef.current);
                }

                if (animationItem) {
                    animationItem.goToAndStop(targetFrame, true);
                }

                // Update opacity via DOM directly — no React re-render
                const newStage = getGrowthStage(adjustedProgress);
                if (newStage !== growthStageRef.current) {
                    growthStageRef.current = newStage;
                    if (opacityRef.current) {
                        opacityRef.current.style.opacity = String(getStageOpacity(newStage));
                    }
                }
            },
        });

        if (animationItem) {
            animationItem.goToAndStop(0, true);
        }

        return () => {
            scrollTrigger.kill();
        };
    }, [isLoaded, getGrowthStage, getStageOpacity]);

    const handleAnimationLoaded = useCallback(() => {
        setIsLoaded(true);
    }, []);

    if (!animationData) return null;

    return (
        <div
            ref={(el) => {
                containerRef.current = el;
                opacityRef.current = el;
            }}
            className="lottie-container mix-blend-screen"
            style={{
                opacity: 0,
                transition: "opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1)", // Long cinematic fade
            }}
            aria-hidden="true"
        >
            <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                autoplay={false}
                loop={false}
                onDOMLoaded={handleAnimationLoaded}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
                rendererSettings={{
                    preserveAspectRatio: "xMidYMid slice",
                }}
            />
        </div>
    );
}
