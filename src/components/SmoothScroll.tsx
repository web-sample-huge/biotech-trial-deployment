"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const rafId = useRef<number>(0);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            rafId.current = requestAnimationFrame(raf);
        }

        rafId.current = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId.current);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
