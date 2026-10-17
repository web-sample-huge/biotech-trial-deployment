"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface LazyWebGLProps {
    children: ReactNode;
    fallback?: ReactNode;
    rootMargin?: string; // default "200px" — start loading slightly before visible
    className?: string;
    style?: React.CSSProperties;
}

/**
 * LazyWebGL
 *
 * Wrapper that uses IntersectionObserver to conditionally mount/unmount
 * its children based on viewport visibility. Ideal for deferring expensive
 * WebGL or canvas-based components until the user scrolls near them.
 */
export default function LazyWebGL({
    children,
    fallback,
    rootMargin = "200px",
    className,
    style,
}: LazyWebGLProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [rootMargin]);

    return (
        <div ref={ref} className={className} style={style}>
            {isVisible ? children : fallback || null}
        </div>
    );
}
