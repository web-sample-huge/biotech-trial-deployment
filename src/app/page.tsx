"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import MetallicPaint from "@/components/MetallicPaint";
import PillNav from "@/components/PillNav";
import TiltedCard from "@/components/TiltedCard";
import ShinyText from "@/components/ShinyText";
import DecryptedText from "@/components/DecryptedText";
import LazyWebGL from "@/components/LazyWebGL";
import dynamic from "next/dynamic";

// Dynamic import for Antigravity to avoid SSR issues with Three.js
const Antigravity = dynamic(() => import("@/components/Antigravity"), {
    ssr: false,
    loading: () => <div style={{ width: '100%', height: '400px', background: '#000' }} />
});

// Dynamic import for CircularGallery to avoid SSR issues with OGL
const CircularGallery = dynamic(() => import("@/components/CircularGallery"), {
    ssr: false,
    loading: () => <div style={{ width: '100%', height: '600px', background: '#000' }} />
});

// Dynamic import for AnimatedShaderBackground
const AnimatedShaderBackground = dynamic(() => import("@/components/AnimatedShaderBackground"), {
    ssr: false,
    loading: () => <div style={{ position: 'absolute', inset: 0, background: 'transparent' }} />
});

// Dynamic import for InfiniteMenu to avoid SSR issues with WebGL
const InfiniteMenu = dynamic(() => import("@/components/InfiniteMenu"), {
    ssr: false,
    loading: () => <div style={{ width: '100%', height: '600px', background: '#000' }} />
});

/* ============================================
   ANIMATION VARIANTS
   ============================================ */
const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
};

/* ============================================
   HOME PAGE COMPONENT
   ============================================ */
export default function Home() {
    return (
        <>
            {/* Navigation */}
            <PillNav
                logo="/images/ard-biotech-logo.webp"
                logoAlt="ARD Biotech"
                items={[
                    { label: 'ABOUT', href: '#about' },
                    { label: 'PRODUCTS', href: '#products' },
                    { label: 'SCIENCE', href: '#science' },
                    { label: 'TRUST', href: '#trust' },
                    { label: 'CONTACT', href: '#contact' }
                ]}
                baseColor="rgba(25, 20, 45, 0.85)"
                pillColor="transparent"
                hoveredPillTextColor="#FFF"
                pillTextColor="#F9E27E"
                initialLoadAnimation
            />

            <style dangerouslySetInnerHTML={{__html: `
                .practice-card {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(212, 175, 55, 0.3);
                    border-radius: 12px;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    backdrop-filter: blur(12px);
                    transition: all 0.3s ease;
                }
                .practice-card:hover {
                    border-color: rgba(255, 215, 0, 0.8);
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
                }
                .practice-icon {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 1;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                }
                .practice-card h4 {
                    color: #D4AF37;
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }
                .practice-card p {
                    color: #D4AF37;
                    font-size: 0.8rem;
                    margin: 0;
                    margin-top: auto;
                    letter-spacing: 1px;
                }
                .timeline-container {
                    position: relative;
                    width: 100%;
                    padding: 1rem 0;
                }
                .timeline-line {
                    position: absolute;
                    top: 50%;
                    left: 5%;
                    right: 5%;
                    height: 1px;
                    background: rgba(255, 215, 0, 0.3);
                    z-index: 1;
                }
                .timeline-nodes {
                    display: flex;
                    justify-content: space-between;
                    position: relative;
                    z-index: 2;
                }
                .timeline-node {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    text-align: center;
                }
                .node-circle {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 2px solid #D4AF37;
                    background: #000;
                }
                .timeline-node span {
                    color: #D4AF37;
                    font-size: 0.85rem;
                    letter-spacing: 1px;
                }
                .gold-outline-btn {
                    padding: 10px 30px;
                    background: #D4AF37;
                    border: none;
                    color: #050505;
                    border-radius: 50px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-size: 0.9rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .gold-outline-btn:hover {
                    background: #F9E27E;
                    color: #050505;
                    box-shadow: 0 0 20px #D4AF37;
                }
            `}} />

            {/* ============================================
                SECTION 1: HERO
                ============================================ */}
            <section className="section hero-section" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                {/* Static Background Image */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 1
                }}>
                    <Image
                        src="/images/landing-page-background.webp"
                        alt="Hero Background"
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        priority
                    />
                    {/* Add a subtle overlay to ensure text readability */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.7) 100%)' }} />
                    
                    {/* Meteor Shower Shader - Restricted to top half */}
                    <div style={{ 
                        position: 'absolute', 
                        inset: 0,
                        maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 60%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 60%, transparent 100%)'
                    }}>
                        <AnimatedShaderBackground />
                    </div>
                </div>

                {/* Hero Content - Split Layout */}
                <div style={{
                    position: 'relative',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    maxWidth: '1800px',
                    margin: '0 auto',
                    padding: '0 4rem',
                    paddingTop: '4rem',
                    gap: '4rem'
                }}>
                    {/* Left Half - Quote & Text */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            flex: '1',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            maxWidth: '700px'
                        }}
                    >
                        <h1 style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 'clamp(2.5rem, 4vw, 5rem)',
                            fontWeight: 700,
                            color: '#D4AF37',
                            lineHeight: 1.1,
                            margin: '0 0 1.5rem 0',
                            textTransform: 'uppercase',
                            textShadow: '0 4px 12px rgba(0,0,0,0.6)'
                        }}>
                            WE TRANSFORM<br />
                            ENVIRONMENTAL<br />
                            CHALLENGES INTO<br />
                            AGRICULTURAL<br />
                            WEALTH
                        </h1>
                        <p style={{
                            fontSize: 'clamp(1.1rem, 1.3vw, 1.5rem)',
                            color: '#F0F0F0',
                            maxWidth: '600px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                            lineHeight: 1.6
                        }}>
                            From waste to wonder: Sustainable biotechnology for a thriving planet.
                        </p>
                    </motion.div>

                    {/* Right Half - Core Practices and Timeline */}
                    <motion.div 
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            flex: '1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            maxWidth: '800px'
                        }}
                    >
                        {/* Interactive Logo area */}
                        <div style={{ width: '400px', height: '250px', position: 'relative', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                                <MetallicPaint
                                    imageSrc="/images/ard-biotech-logo.webp"
                                    seed={42}
                                    scale={2.2}
                                    patternSharpness={1.5}
                                    noiseScale={0.3}
                                    speed={0.2}
                                    liquid={0.8}
                                    mouseAnimation={true}
                                    brightness={3.0}
                                    contrast={0.6}
                                    refraction={0.05}
                                    blur={0.01}
                                    chromaticSpread={1}
                                    fresnel={1.2}
                                    angle={0}
                                    waveAmplitude={1.2}
                                    distortion={0.8}
                                    contour={0.3}
                                    lightColor="#FFF5B8"
                                    darkColor="#3B2600"
                                    tintColor="#D4AF37"
                                />
                            </div>
                            <button className="gold-outline-btn" style={{ position: 'absolute', bottom: '-10px', zIndex: 20 }}>
                                LEARN MORE
                            </button>
                        </div>

                        {/* Core Practices Section */}
                        <div style={{ width: '100%', marginBottom: '2.5rem' }}>
                            <h3 style={{
                                color: '#D4AF37',
                                fontSize: '1.3rem',
                                marginBottom: '1rem',
                                paddingLeft: '0.5rem',
                                fontWeight: 400
                            }}>
                                Core Practices
                            </h3>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                                {/* Card 1 */}
                                <div className="practice-card">
                                    <div className="practice-icon">
                                        <Image src="/images/icons/soil-bioremediation.webp" alt="Soil" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <h4>Soil Bioremediation</h4>
                                    <p>OUR SCIENCE &gt;</p>
                                </div>
                                {/* Card 2 */}
                                <div className="practice-card">
                                    <div className="practice-icon">
                                        <Image src="/images/icons/waste-fertilizer.webp" alt="Waste" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <h4>Waste-to-Fertilizer</h4>
                                    <p>PROCESS &gt;</p>
                                </div>
                                {/* Card 3 */}
                                <div className="practice-card">
                                    <div className="practice-icon">
                                        <Image src="/images/icons/crop-enhancement.webp" alt="Crop" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <h4>Crop Enhancement</h4>
                                    <p>BENEFITS &gt;</p>
                                </div>
                            </div>
                        </div>

                        {/* Transformation Journey Timeline */}
                        <div style={{ width: '100%' }}>
                            <h3 style={{
                                color: '#D4AF37',
                                fontSize: '1.1rem',
                                marginBottom: '1rem',
                                textAlign: 'center',
                                fontWeight: 400
                            }}>
                                Transformation Journey
                            </h3>
                            <div className="timeline-container">
                                <div className="timeline-line"></div>
                                <div className="timeline-nodes">
                                    <div className="timeline-node">
                                        <div className="node-circle"></div>
                                        <span>Visualization<br/>Journey</span>
                                    </div>
                                    <div className="timeline-node">
                                        <div className="node-circle"></div>
                                        <span>Transformation<br/>Journey</span>
                                    </div>
                                    <div className="timeline-node">
                                        <div className="node-circle"></div>
                                        <span>Transformation<br/>Journey</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="scroll-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    style={{ left: '5%', bottom: '2rem', right: 'auto', transform: 'none', alignItems: 'flex-start' }}
                >
                    <span className="text-small" style={{ color: '#D4AF37', letterSpacing: '2px', marginBottom: '0.5rem' }}>SCROLL</span>
                    <div className="scroll-line" style={{ background: 'linear-gradient(to bottom, transparent, #D4AF37)', height: '60px', width: '1px', marginLeft: '1.5rem' }}></div>
                </motion.div>
            </section>

            {/* ============================================
                SECTION 2: INTRODUCTION
                ============================================ */}
            <section id="about" className="section">
                <div className="container">
                    <div className="grid grid-2" style={{ alignItems: 'start' }}>
                        {/* Left: Large Headline */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <h2 className="text-display">
                                TRANSFORMING
                                <br />
                                <span className="text-green">WASTE</span>
                                <br />
                                INTO
                                <br />
                                <span className="text-gold">WEALTH</span>
                            </h2>
                        </motion.div>

                        {/* Right: Body Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: "-100px" }}
                            style={{ paddingTop: 'var(--space-md)' }}
                        >
                            <p className="text-body mb-md">
                                Founded in Tamil Nadu, ARD Biotech transforms environmental
                                challenges into agricultural solutions. Our patented keratin
                                hydrolysis technology converts waste into wealth.
                            </p>
                            <p className="text-body">
                                Farm Fort, our flagship product, provides 100% organic
                                wildlife protection. No chemicals. No compromises.
                                Just nature-inspired innovation.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================
                SECTION 3: PRODUCTS
                ============================================ */}
            <section id="products" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-md"
                    >
                        <span className="text-small text-muted">Our Products</span>
                        <h2 className="text-display mt-sm">
                            PRODUCT <span className="text-green">ECOSYSTEM</span>
                        </h2>
                    </motion.div>
                </div>

                {/* Circular Gallery with Products - 3 visible, Farm Fort centered */}
                <LazyWebGL style={{ height: '700px', position: 'relative', width: '100%' }}>
                    <CircularGallery
                        items={[
                            { image: '/images/products/groundnut.webp', text: 'GROUNDNUT CROP | Organic liquid fertilizer specially formulated for groundnut crop. Enhances root nodulation and boosts overall yield.' },
                            { image: '/images/products/coconut.webp', text: 'COCONUT TREE | Organic liquid fertilizer for coconut trees. Strengthens trunk health and promotes consistent nut production.' },
                            { image: '/images/products/paddy.webp', text: 'PADDY CROP | Organic liquid fertilizer for paddy crop. Improves tillering, grain filling, and disease resistance.' },
                            { image: '/images/products/farm-fort.webp', text: 'FARM FORT | Our flagship bio-repellent for wild pig, rabbit, farm rat & porcupine. 100% organic crop protection.' },
                            { image: '/images/products/banana.webp', text: 'BANANA CROP | Organic liquid fertilizer for banana crop. Accelerates bunch development and improves fruit quality.' },
                            { image: '/images/products/sugarcane.webp', text: 'SUGARCANE CROP | Organic liquid fertilizer for sugarcane. Enhances sucrose content and promotes robust cane growth.' },
                            { image: '/images/products/vegetable.webp', text: 'VEGETABLE GARDENS | Organic liquid fertilizer for ornamental & vegetable gardens. Versatile all-purpose formula.' }
                        ]}
                        bend={0}
                        textColor="#ffffff"
                        borderRadius={0.05}
                        scrollSpeed={2}
                        scrollEase={0.05}
                        initialIndex={3}
                        autoScrollDelay={5000}
                        autoScrollInterval={2000}
                    />
                </LazyWebGL>
            </section>

            {/* ============================================
                SECTION: PILOT TRIALS
                ============================================ */}
            <section className="section" style={{ minHeight: '80vh' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-md"
                    >
                        <span className="text-small text-muted">Field Success Stories</span>
                        <h2 className="text-display mt-sm">
                            <span className="text-green">PILOT</span> TRIALS
                        </h2>
                    </motion.div>

                    <LazyWebGL style={{ width: '100%', aspectRatio: '4 / 3', maxHeight: '75vh', position: 'relative' }}>
                        <InfiniteMenu
                            items={[
                                { image: '/images/pilots/groundnut crop.webp', title: 'Groundnut Crop' },
                                { image: '/images/pilots/paddy crop.webp', title: 'Paddy Crop' },
                                { image: '/images/pilots/rose flower.webp', title: 'Rose Flower' },
                                { image: '/images/pilots/Kanthari Milagai (Thai Chili).webp', title: 'Kanthari Milagai (Thai Chili)' },
                                { image: '/images/pilots/groundnut field.webp', title: 'Groundnut Field' },
                                { image: '/images/pilots/pumpkin.webp', title: 'Pumpkin' },
                                { image: '/images/pilots/dragon fruit.webp', title: 'Dragon Fruit' },
                                { image: '/images/pilots/Kambu Ottu Pullu (Elephant grass).webp', title: 'Kambu Ottu Pullu (Elephant Grass)' },
                                { image: '/images/pilots/Cabbage.webp', title: 'Cabbage' },
                                { image: '/images/pilots/papaya .webp', title: 'Papaya' },
                                { image: '/images/pilots/Kozhi Kondai Poo (Cockscomb).webp', title: 'Kozhi Kondai Poo (Cockscomb)' },
                                { image: '/images/pilots/paddy field.webp', title: 'Paddy Field' },
                                { image: '/images/pilots/Sambangi Flower (tuberose).webp', title: 'Sambangi Flower (Tuberose)' }
                            ]}
                            scale={1}
                        />
                    </LazyWebGL>
                </div>
            </section>

            {/* ============================================
                SECTION 4: THE SCIENCE
                ============================================ */}
            <section id="science" className="section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-lg"
                    >
                        <span className="text-small text-muted">How It Works</span>
                        <h2 className="text-display mt-sm">
                            THE <span className="text-blue">SCIENCE</span>
                        </h2>
                    </motion.div>

                    {/* Three Step Process */}
                    <div className="grid grid-2" style={{ gap: 'var(--space-lg)', maxWidth: '1000px', margin: '0 auto' }}>
                        {/* Step 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: "-50px" }}
                            style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-md)' }}
                        >
                            <span className="text-small text-green">01</span>
                            <h3 className="text-heading mt-sm">COLLECT</h3>
                            <p className="text-body mt-sm">
                                Repurposing keratin waste from local sources—chicken feathers,
                                human hair, and coconut coir.
                            </p>
                        </motion.div>

                        {/* Step 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: "-50px" }}
                            style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-md)' }}
                        >
                            <span className="text-small text-blue">02</span>
                            <h3 className="text-heading mt-sm">TRANSFORM</h3>
                            <p className="text-body mt-sm">
                                Patented hydrolysis process breaks down proteins into
                                bio-available amino acids and nutrients.
                            </p>
                        </motion.div>

                        {/* Step 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: "-50px" }}
                            style={{ gridColumn: '1 / -1', textAlign: 'center', paddingTop: 'var(--space-md)' }}
                        >
                            <span className="text-small text-gold">03</span>
                            <h3 className="text-heading mt-sm">PROTECT</h3>
                            <p className="text-body mt-sm" style={{ maxWidth: '500px', margin: '0 auto' }}>
                                Scent-based barrier that wildlife cannot adapt to—
                                protecting crops without harming the ecosystem.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================
                SECTION 5: TRUST & AUTHORITY
                ============================================ */}
            <section id="trust" className="section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-lg"
                    >
                        <span className="text-small text-muted">Leadership</span>
                        <h2 className="text-display mt-sm">
                            TRUST & <span className="text-gold">AUTHORITY</span>
                        </h2>
                    </motion.div>

                    {/* Founders Grid with TiltedCards */}
                    <div className="grid founders-grid" style={{
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 'var(--space-lg)',
                        justifyItems: 'center'
                    }}>
                        {/* Founder 1 - Annadasan P */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: "-50px" }}
                            style={{ textAlign: 'center' }}
                        >
                            <TiltedCard
                                imageSrc="/images/founders/Annadasan P.webp"
                                altText="Annadasan P - Founder & Chairman"
                                containerHeight="320px"
                                containerWidth="280px"
                                imageHeight="280px"
                                imageWidth="280px"
                                rotateAmplitude={12}
                                scaleOnHover={1.05}
                                showMobileWarning={false}
                                showTooltip={false}
                            />
                            <div style={{ marginTop: 'var(--space-md)' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                    <ShinyText
                                        text="ANNADASAN P"
                                        color="#d4af37"
                                        shineColor="#fff8dc"
                                        speed={3}
                                    />
                                </h3>
                                <div style={{ color: 'var(--color-muted)', fontSize: '1rem' }}>
                                    <DecryptedText
                                        text="Founder & Chairman"
                                        animateOn="view"
                                        speed={40}
                                        maxIterations={15}
                                    />
                                </div>
                                <p className="text-body mt-sm" style={{ fontSize: 'var(--text-small)' }}>
                                    🏆 Green Champion Award 2022
                                    <br />
                                    Government of Tamil Nadu
                                </p>
                            </div>
                        </motion.div>

                        {/* Founder 2 - Rashilathi K */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: "-50px" }}
                            style={{ textAlign: 'center' }}
                        >
                            <TiltedCard
                                imageSrc="/images/founders/Rashilathi K.webp"
                                altText="Rashilathi K - Co-Founder & Director"
                                containerHeight="320px"
                                containerWidth="280px"
                                imageHeight="280px"
                                imageWidth="280px"
                                rotateAmplitude={12}
                                scaleOnHover={1.05}
                                showMobileWarning={false}
                                showTooltip={false}
                            />
                            <div style={{ marginTop: 'var(--space-md)' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                    <ShinyText
                                        text="RASHILATHI K"
                                        color="#d4af37"
                                        shineColor="#fff8dc"
                                        speed={3}
                                        delay={0.5}
                                    />
                                </h3>
                                <div style={{ color: 'var(--color-muted)', fontSize: '1rem' }}>
                                    <DecryptedText
                                        text="Co-Founder & Director"
                                        animateOn="view"
                                        speed={40}
                                        maxIterations={15}
                                    />
                                </div>
                                <p className="text-body mt-sm" style={{ fontSize: 'var(--text-small)' }}>
                                    🏆 Climate Change Warrior Award 2025
                                </p>
                            </div>
                        </motion.div>

                        {/* Founder 3 - A R Dhilipan */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: "-50px" }}
                            style={{ textAlign: 'center' }}
                        >
                            <TiltedCard
                                imageSrc="/images/founders/A R Dhilipan.webp"
                                altText="A R Dhilipan - Co-Founder & CEO"
                                containerHeight="320px"
                                containerWidth="280px"
                                imageHeight="280px"
                                imageWidth="280px"
                                rotateAmplitude={12}
                                scaleOnHover={1.05}
                                showMobileWarning={false}
                                showTooltip={false}
                            />
                            <div style={{ marginTop: 'var(--space-md)' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                    <ShinyText
                                        text="A R DHILIPAN"
                                        color="#d4af37"
                                        shineColor="#fff8dc"
                                        speed={3}
                                        delay={1}
                                    />
                                </h3>
                                <div style={{ color: 'var(--color-muted)', fontSize: '1rem' }}>
                                    <DecryptedText
                                        text="Co-Founder & CEO"
                                        animateOn="view"
                                        speed={40}
                                        maxIterations={15}
                                    />
                                </div>
                                <p className="text-body mt-sm" style={{ fontSize: 'var(--text-small)' }}>
                                    🎤 Startup Mahakumbh 2025
                                    <br />
                                    Chennai Climate Summit 2025
                                    <br />
                                    TN Global Startup Summit 2025
                                    <br />
                                    Startup-to-Govt Demo Forum 2026
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Social Proof Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="text-center mt-lg"
                        style={{
                            border: '1px solid var(--color-border)',
                            padding: 'var(--space-md)',
                            borderRadius: '8px'
                        }}
                    >
                        <h3 className="text-heading text-green">1,000+ UNITS SOLD</h3>
                        <p className="text-body">in just 3 days post-launch</p>
                    </motion.div>
                </div>
            </section>

            {/* ============================================
                SECTION 6: CALL TO ACTION
                ============================================ */}
            <section className="section">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center"
                >
                    <h2 className="text-display">
                        READY TO
                        <br />
                        <span className="text-gold">PROTECT</span>
                        <br />
                        YOUR HARVEST?
                    </h2>

                    <motion.div
                        className="mt-lg"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <a href="#contact" className="btn btn-accent">
                            Get Started
                        </a>
                    </motion.div>
                </motion.div>
            </section>

            {/* ============================================
                FOOTER & CONTACT
                ============================================ */}
            <footer id="contact" className="section" style={{ minHeight: 'auto', padding: 'var(--space-lg) var(--gutter)' }}>
                <div className="container">
                    <div className="grid grid-2" style={{ gap: 'var(--space-lg)', alignItems: 'start' }}>
                        {/* Contact Info */}
                        <div>
                            <h3 className="text-heading mb-md">CONTACT</h3>
                            <p className="text-body">
                                <strong>ARD Biotech LLP</strong><br />
                                Kunnathur, Polur tk<br />
                                Tiruvannamalai, Tamil Nadu<br /><br />
                                📞 9345792477 / 8189812477<br />
                                📧 dhilip@ardbiotech.in
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-heading mb-md">QUICK LINKS</h3>
                            <ul className="text-body" style={{ listStyle: 'none' }}>
                                <li><a href="#about" style={{ color: 'var(--color-text-dim)', textDecoration: 'none' }}>About Us</a></li>
                                <li><a href="#products" style={{ color: 'var(--color-text-dim)', textDecoration: 'none' }}>Products</a></li>
                                <li><a href="#science" style={{ color: 'var(--color-text-dim)', textDecoration: 'none' }}>The Science</a></li>
                                <li><a href="#trust" style={{ color: 'var(--color-text-dim)', textDecoration: 'none' }}>Trust & Authority</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="text-center mt-lg" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)' }}>
                        <p className="text-small text-muted">
                            © 2025 ARD Biotech LLP. All rights reserved.
                            <br />
                            Transforming Environmental Challenges into Agricultural Wealth
                        </p>
                    </div>
                </div>
            </footer>

            {/* ============================================
                DEAD END: ANTIGRAVITY EFFECT
                ============================================ */}
            <section className="section" style={{ position: 'relative', overflow: 'hidden', background: '#000' }}>
                <LazyWebGL style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1
                }}>
                    <Antigravity
                        count={300}
                        magnetRadius={6}
                        ringRadius={7}
                        waveSpeed={0.4}
                        waveAmplitude={1}
                        particleSize={1.5}
                        lerpSpeed={0.05}
                        color="#00D4FF"
                        autoAnimate
                        particleVariance={1}
                        rotationSpeed={0}
                        depthFactor={1}
                        pulseSpeed={3}
                        particleShape="capsule"
                        fieldStrength={10}
                    />
                </LazyWebGL>

                {/* Minimal overlay content for dead end */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="text-center"
                    style={{ position: 'relative', zIndex: 10 }}
                >
                    <p className="text-small text-muted">You&apos;ve reached the end</p>
                </motion.div>
            </section>
        </>
    );
}
