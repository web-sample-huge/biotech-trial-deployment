# 🔧 CRITICAL DESIGN CLARIFICATION
## From Lead Architect & Vibe Monitor

**Date:** 2026-02-05  
**Priority:** 🔴 MUST READ - Design requirements clarified

---

## 🚨 Key Clarifications (READ CAREFULLY)

### 1. Lottie Visibility Rules

| Section | Lottie Visible? | Behavior |
|---------|-----------------|----------|
| Hero Section | ❌ **NOT VISIBLE** | Hidden completely |
| After Hero (scroll sections) | ✅ Visible | Scroll-synced animation |

**Implementation:** The Lottie container should have `opacity: 0` during hero, then fade in when scroll passes hero threshold.

---

### 2. NO Dynamic Color Changes on Lottie

❌ **REMOVE all `hue-rotate` and `saturate` filters** from `LottieBackground.tsx`

The current code applies color filters to the Lottie:
```tsx
// ❌ REMOVE THIS - No color changes on Lottie
case "seeding":
    return { filter: "hue-rotate(180deg) saturate(1.2)", opacity: 0.35 };
```

**Correct approach:** Lottie plays at its **natural colors** — no filters applied.

---

### 3. Dynamic Colors are for CONTENT SECTIONS

The color progression (Blue → Green → Gold) applies to the **text/UI elements** placed ON TOP of the Lottie:
- Problem Section
- Science Section  
- Trust & Authority Page
- etc.

**NOT the Lottie background itself.**

---

### 4. Lottie Opacity Rules

| Context | Opacity |
|---------|---------|
| Lottie background (always) | **40%** |
| Near firefly cursor | **70%** (localized glow) |

The Lottie stays at 40% opacity globally. The firefly cursor creates a **localized illumination** that raises opacity to 70% in its vicinity.

---

### 5. Firefly Cursor Glow Effect

| Property | Value |
|----------|-------|
| Cursor position | **Center of glow** |
| Glow radius | **3x cursor size** (~120px if cursor is 40px) |
| Background effect | 40% → 70% opacity near cursor |

**Visual effect:** Firefly acts as a "torch" illuminating the dark Lottie background

---

## 📝 Required Code Changes

### LottieBackground.tsx

```tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import paddyAnimation from "@/assets/animations/paddy-growth.json";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function LottieBackground() {
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // Hidden during hero
    const totalFramesRef = useRef<number>(0);

    useEffect(() => {
        if (!lottieRef.current || !isLoaded) return;

        const animationItem = lottieRef.current;
        totalFramesRef.current = animationItem.getDuration(true) || 192;

        const scrollTrigger = ScrollTrigger.create({
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            onUpdate: (self) => {
                const heroOffset = 0.25; // Hero = first 25% of scroll
                
                // Show Lottie only after hero
                if (self.progress > heroOffset) {
                    setIsVisible(true);
                    const adjustedProgress = (self.progress - heroOffset) / (1 - heroOffset);
                    const targetFrame = Math.floor(adjustedProgress * totalFramesRef.current);
                    animationItem.goToAndStop(targetFrame, true);
                } else {
                    setIsVisible(false);
                    animationItem.goToAndStop(0, true);
                }
            },
        });

        animationItem.goToAndStop(0, true);

        return () => scrollTrigger.kill();
    }, [isLoaded]);

    const handleAnimationLoaded = useCallback(() => setIsLoaded(true), []);

    return (
        <div
            ref={containerRef}
            className="lottie-container"
            style={{
                opacity: isVisible ? 0.4 : 0, // 40% when visible, hidden during hero
                transition: "opacity 0.5s ease",
            }}
            aria-hidden="true"
        >
            <Lottie
                lottieRef={lottieRef}
                animationData={paddyAnimation}
                autoplay={false}
                loop={false}
                onDOMLoaded={handleAnimationLoaded}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
            />
        </div>
    );
}
```

---

### globals.css - Firefly Illumination Effect

Update the firefly overlay to create a **localized 70% opacity** area around the cursor:

```css
/* Firefly creates illumination zone on Lottie background */
.firefly-illumination {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 1; /* Above Lottie (z-index: -1), below content */
    background: radial-gradient(
        120px circle at var(--cursor-x) var(--cursor-y), /* 3x cursor size radius */
        transparent 0%,
        rgba(10, 10, 10, 0.3) 100%
    );
}
```

The effect is: Lottie is at 40% globally, but the firefly "punches through" the darkness to create a 70% visible zone around the cursor.

---

## ✅ Summary of Changes Required

| Component | Change |
|-----------|--------|
| `LottieBackground.tsx` | Hide during hero, remove color filters, static 40% opacity |
| `FireflyCursor.tsx` | Create 3x radius glow that illuminates Lottie |
| `globals.css` | Update firefly overlay for localized illumination |

---

## 🔥 Vibe Monitor Check

After implementing, the experience should be:
1. **Hero:** 3D DNA visible, Lottie hidden, Firefly cursor active
2. **Scroll past hero:** Lottie fades in at 40%
3. **Mouse movement:** Firefly illuminates Lottie to 70% in 120px radius around cursor
4. **Continue scroll:** Paddy animation progresses naturally (no color filters)

---

*— Lead Architect & Vibe Monitor*
