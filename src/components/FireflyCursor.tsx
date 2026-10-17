"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";

/**
 * FireflyCursor Component
 *
 * Custom cursor with firefly image and golden glow effect.
 * - Desktop: Follows mouse movement with smooth interpolation
 * - Mobile: Hidden (uses native touch)
 *
 * Performance: Uses direct DOM manipulation via refs instead of
 * React state to avoid 60+ re-renders/second. Position is updated
 * with translate3d() to stay on the compositor layer.
 */
export function FireflyCursor() {
    const containerRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);
    const targetRef = useRef({ x: 0, y: 0 });
    const currentRef = useRef({ x: 0, y: 0 });
    const isVisibleRef = useRef(false);
    const isHoveringRef = useRef(false);

    // Smooth animation using requestAnimationFrame — no setState
    const animateCursor = useCallback(() => {
        const dx = targetRef.current.x - currentRef.current.x;
        const dy = targetRef.current.y - currentRef.current.y;

        // Smooth interpolation with easing
        currentRef.current.x += dx * 0.12;
        currentRef.current.y += dy * 0.12;

        if (containerRef.current) {
            containerRef.current.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0)`;
        }

        rafRef.current = requestAnimationFrame(animateCursor);
    }, []);

    // Handle mouse movement
    const handleMouseMove = useCallback((e: MouseEvent) => {
        targetRef.current = { x: e.clientX, y: e.clientY };
        if (!isVisibleRef.current && containerRef.current) {
            isVisibleRef.current = true;
            containerRef.current.style.opacity = "1";
        }
    }, []);

    // Handle mouse enter/leave on interactive elements
    const handleMouseEnter = useCallback(() => {
        isHoveringRef.current = true;
        if (glowRef.current) {
            glowRef.current.style.width = "960px";
            glowRef.current.style.height = "960px";
        }
        if (imageWrapperRef.current) {
            imageWrapperRef.current.style.transform = "scale(1.2)";
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        isHoveringRef.current = false;
        if (glowRef.current) {
            glowRef.current.style.width = "640px";
            glowRef.current.style.height = "640px";
        }
        if (imageWrapperRef.current) {
            imageWrapperRef.current.style.transform = "scale(1)";
        }
    }, []);

    // Handle page mouse leave
    const handlePageLeave = useCallback(() => {
        isVisibleRef.current = false;
        if (containerRef.current) {
            containerRef.current.style.opacity = "0";
        }
    }, []);

    useEffect(() => {
        // Check if device has fine pointer (mouse)
        const hasMouse = window.matchMedia("(pointer: fine)").matches;
        if (!hasMouse) return;

        // Hide default cursor
        document.body.style.cursor = "none";

        // Start animation loop
        rafRef.current = requestAnimationFrame(animateCursor);

        // Desktop events
        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handlePageLeave);

        // Interactive element hover effects
        const interactiveElements = document.querySelectorAll("a, button, [role='button']");
        interactiveElements.forEach((el) => {
            el.addEventListener("mouseenter", handleMouseEnter);
            el.addEventListener("mouseleave", handleMouseLeave);
        });

        return () => {
            document.body.style.cursor = "auto";
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handlePageLeave);

            interactiveElements.forEach((el) => {
                el.removeEventListener("mouseenter", handleMouseEnter);
                el.removeEventListener("mouseleave", handleMouseLeave);
            });
        };
    }, [animateCursor, handleMouseMove, handlePageLeave, handleMouseEnter, handleMouseLeave]);

    return (
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                left: 0,
                top: 0,
                transform: "translate3d(0px, 0px, 0)",
                pointerEvents: "none",
                zIndex: 10000,
                opacity: 0,
                transition: "opacity 300ms ease",
                willChange: "transform",
            }}
            aria-hidden="true"
        >
            {/* Golden Glow Effect - soft radial gradient (no blur filter) */}
            <div
                ref={glowRef}
                style={{
                    position: "absolute",
                    width: "640px",
                    height: "640px",
                    background: `radial-gradient(
                        circle,
                        rgba(255, 200, 50, 0.35) 0%,
                        rgba(255, 190, 30, 0.2) 25%,
                        rgba(255, 170, 0, 0.1) 50%,
                        rgba(255, 150, 0, 0.03) 75%,
                        transparent 100%
                    )`,
                    transform: "translate(-50%, -50%)",
                    transition: "width 300ms ease, height 300ms ease",
                    borderRadius: "50%",
                }}
            />

            {/* Firefly Image - 2x size */}
            <div
                ref={imageWrapperRef}
                style={{
                    transform: "scale(1)",
                    transition: "transform 200ms ease",
                    marginLeft: "-40px",
                    marginTop: "-40px",
                }}
            >
                <Image
                    src="/images/firefly-cursor.webp"
                    alt=""
                    width={80}
                    height={80}
                    style={{
                        filter: "drop-shadow(0 0 20px rgba(255, 200, 50, 0.6))",
                    }}
                    priority
                />
            </div>
        </div>
    );
}
