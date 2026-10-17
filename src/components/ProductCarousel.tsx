'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import './ProductCarousel.css';

interface ProductItem {
    image: string;
    name: string;
    description: string;
}

interface ProductCarouselProps {
    items: ProductItem[];
    initialIndex?: number;
    autoScrollDelay?: number;  // ms before auto-scroll starts (default 5000)
    autoScrollInterval?: number; // ms between auto-scroll steps (default 2000)
}

export function ProductCarousel({
    items,
    initialIndex = 0,
    autoScrollDelay = 5000,
    autoScrollInterval = 2000,
}: ProductCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const lastInteractionRef = useRef(0);
    const autoScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const totalItems = items.length;

    // Scroll to a specific index
    const scrollToIndex = useCallback((index: number) => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const cards = container.querySelectorAll('.product-card');
        if (cards[index]) {
            const card = cards[index] as HTMLElement;
            const containerWidth = container.clientWidth;
            const cardLeft = card.offsetLeft;
            const cardWidth = card.offsetWidth;
            // Center the card in the container
            const scrollLeft = cardLeft - (containerWidth / 2) + (cardWidth / 2);
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }, []);

    // Go to next item (wraps around)
    const goToNext = useCallback(() => {
        setActiveIndex(prev => {
            const next = (prev + 1) % totalItems;
            return next;
        });
    }, [totalItems]);

    // Go to previous item
    const goToPrev = useCallback(() => {
        setActiveIndex(prev => {
            const next = (prev - 1 + totalItems) % totalItems;
            return next;
        });
    }, [totalItems]);

    // Scroll to active index when it changes
    useEffect(() => {
        scrollToIndex(activeIndex);
    }, [activeIndex, scrollToIndex]);

    // Record user interaction
    const recordInteraction = useCallback(() => {
        lastInteractionRef.current = Date.now();
    }, []);

    // Auto-scroll logic
    useEffect(() => {
        const startAutoScroll = () => {
            // Clear any existing timers
            if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);

            autoScrollTimerRef.current = setTimeout(() => {
                // Start interval-based scrolling
                intervalRef.current = setInterval(() => {
                    const timeSinceInteraction = Date.now() - lastInteractionRef.current;
                    if (timeSinceInteraction >= autoScrollDelay) {
                        goToNext();
                    }
                }, autoScrollInterval);
            }, autoScrollDelay);
        };

        startAutoScroll();

        return () => {
            if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [autoScrollDelay, autoScrollInterval, goToNext]);

    // Reset auto-scroll on user interaction
    const handleUserInteraction = useCallback(() => {
        recordInteraction();
        // Reset timers
        if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);

        // Restart auto-scroll countdown
        autoScrollTimerRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                const timeSinceInteraction = Date.now() - lastInteractionRef.current;
                if (timeSinceInteraction >= autoScrollDelay) {
                    goToNext();
                }
            }, autoScrollInterval);
        }, autoScrollDelay);
    }, [recordInteraction, autoScrollDelay, autoScrollInterval, goToNext]);

    // Handle manual scroll detection
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let scrollTimeout: ReturnType<typeof setTimeout>;
        const handleScroll = () => {
            handleUserInteraction();
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // After scroll ends, find the closest card
                const containerWidth = container.clientWidth;
                const scrollCenter = container.scrollLeft + containerWidth / 2;
                const cards = container.querySelectorAll('.product-card');
                let closestIndex = 0;
                let closestDist = Infinity;
                cards.forEach((card, idx) => {
                    const el = card as HTMLElement;
                    const cardCenter = el.offsetLeft + el.offsetWidth / 2;
                    const dist = Math.abs(cardCenter - scrollCenter);
                    if (dist < closestDist) {
                        closestDist = dist;
                        closestIndex = idx;
                    }
                });
                setActiveIndex(closestIndex);
            }, 150);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [handleUserInteraction]);

    // Initial scroll to centered item
    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => scrollToIndex(initialIndex), 100);
        return () => clearTimeout(timer);
    }, [initialIndex, scrollToIndex]);

    return (
        <div className="product-carousel">
            {/* Navigation arrows */}
            <button
                className="carousel-arrow carousel-arrow-left"
                onClick={() => { goToPrev(); handleUserInteraction(); }}
                aria-label="Previous product"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>
            <button
                className="carousel-arrow carousel-arrow-right"
                onClick={() => { goToNext(); handleUserInteraction(); }}
                aria-label="Next product"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            {/* Scrollable card track */}
            <div className="product-carousel-track" ref={scrollContainerRef}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`product-card ${index === activeIndex ? 'product-card-active' : ''}`}
                        onClick={() => { setActiveIndex(index); handleUserInteraction(); }}
                    >
                        <div className="product-card-image-wrapper">
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={400}
                                height={400}
                                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                            />
                        </div>
                        <div className="product-card-content">
                            <h3 className="product-card-name">{item.name}</h3>
                            <p className="product-card-description">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dot indicators */}
            <div className="carousel-dots">
                {items.map((_, index) => (
                    <button
                        key={index}
                        className={`carousel-dot ${index === activeIndex ? 'carousel-dot-active' : ''}`}
                        onClick={() => { setActiveIndex(index); handleUserInteraction(); }}
                        aria-label={`Go to product ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
