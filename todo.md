# ARD Biotech Website Development Todo

> **Priority Focus**: Lottie Paddy Crop Animation (scroll-synced growth visualization)

---

## Phase 1: Foundation & Lottie Animation (HIGH PRIORITY)

### 🌾 Lottie Paddy Crop Animation (PRIORITY #1)
- [x] Source or create the paddy crop growth Lottie animation file
  - Stages: Seeding → Germination → Maturation → Harvest
  - Relocated to: `src/assets/animations/paddy-growth.json`
- [x] Implement scroll-synced animation controller
  - Set `autoplay: false` and `loop: false`
  - Use GSAP ScrollTrigger for frame-based progression
  - Formula: `targetFrame = totalFrames * scrollProgress`
- [x] Map scroll progress to growth stages:
  - 0-15%: Seeding (DNA/Plant molecule floating)
  - 15-45%: Germination (roots with neon-green vitality)
  - 45-85%: Maturation (paddy expanding)
  - 85-100%: Harvest (golden glow effect)
- [x] Integrate dynamic lighting with Firefly cursor
  - Background opacity 40% default → 75% on illumination
- [ ] Optimize Lottie-Light for rural 4G performance

---

### 🔧 Project Setup
- [x] Initialize Next.js 15+ project with App Router
- [x] Configure Turbopack for faster builds
- [x] Set up Tailwind CSS v4 with custom color palette:
  - Base: `#0A0A0A` (Rich Black)
  - Primary Accent: `#39FF14` (Neon Green)
  - Secondary Accent: `#FFD700` (Harvest Gold)
  - Border: `#1A1A1A`
- [x] Install and configure dependencies:
  - GSAP + ScrollTrigger
  - Lottie-Light (React-Lottie)
  - React Three Fiber + Three.js
- [x] Set up local font hosting for REMON typeface
- [x] Configure Inter/Montserrat via Next.js Font Optimization

---

## Phase 2: Core Visual Components

### ✨ Firefly Cursor System
- [x] Create cursor overlay with `pointer-events: none`
- [x] Implement JavaScript `mousemove` listener
- [x] Set up CSS custom properties (`--clientX`, `--clientY`)
- [x] Add radial-gradient spotlight with golden glow
- [x] Apply `filter: blur(1em) contrast(100)` for gooey effect
- [x] Create mobile touch-point centered version
- [x] Integrate firefly cursor PNG (`public/images/firefly-cursor.png`)

### 🧬 3D Hero Section
- [x] Build 3D Neon Blue DNA/Plant hybrid molecule
- [x] Use React Three Fiber with Drei helpers
- [x] Implement `frameloop="demand"` for GPU optimization
- [x] Add lazy loading and performance optimizations
- [ ] Test performance on rural 4G networks

### 🎨 Biotech Neon Aesthetic
- [ ] Implement dark mode base with Rich Black
- [ ] Create bento-grid container layouts
- [ ] Design neon gradient overlays and accents
- [ ] Add micro-animations for hover effects
- [ ] Style all CTAs with Neon Green highlights

---

## Phase 3: Homepage - The Conversion Engine

### 🏠 Hero Section
- [x] Headline: "Transforming Environmental Challenges into Agricultural Wealth"
- [x] Sub-headline: Farm Fort organic repellent messaging
- [x] Market Proof Ticker: "Sold 1,000+ units in 3 days post-launch"
- [x] Integrate 3D molecule visualization

### 💡 Problem/Solution Section
- [x] Title: "Chemicals leave residues; Farm Fort leaves results"
- [x] Content explaining 100% organic, 15-day guarantee
- [x] Visual comparison with chemical alternatives
- [x] Target pests grid (wild pigs, rats, rabbits, deer)

### 🔬 The Science Section
- [x] Scent-Based Defense explanation
- [x] Patented keratin hydrolysis process visualization
- [x] Ingredient showcase (chicken feathers, human hair, coconut coir)
- [x] Environmental impact stats

---

## Phase 4: Trust & Authority Page

### 👤 Founder Profiles
- [ ] **Annadasan P** - Founder & Chairman
  - Green Champion Award 2022 (Government of Tamil Nadu)
- [ ] **Rashilathi K** - Co-Founder & Director
  - Climate Change Warrior Award 2025
- [ ] **A R Dhilipan** - Co-Founder & CEO
  - Startup Mahakumbh 2025, Chennai Climate Summit 2025, AgriTech Expo 2024

### 📸 Social Proof Grid
- [ ] Masonry-style bento grid for farmer feedback
- [ ] Click-to-expand functionality for stories
- [ ] Include: farmer name, district, crop type, wildlife issue resolved
- [ ] Side-by-side crop health photos

---

## Phase 5: Product Pages

### 🛡️ Farm Fort Repellent Page
- [ ] Product details and mechanism explanation
- [ ] Application instructions
- [ ] 15-day guarantee highlight
- [ ] Target pests info (wild pigs, farm rats, rabbits)

### 🌱 Organic Liquid Fertilizer Page
- [ ] Keratin hydrolysis process explanation
- [ ] Benefits for soil and crop health
- [ ] Usage guides for different crops

---

## Phase 6: SEO & AI Readability

### 🔍 Schema Markup
- [ ] Product Schema for Farm Fort and Fertilizers
- [ ] Organization Schema for ARD Biotech LLP
- [ ] FAQ Schema for "How to stop wild pigs in farm?"
- [ ] Implement via Next.js Metadata API (JSON-LD)

### 📄 Semantic HTML
- [ ] Use `<article>` for product and science content
- [ ] Use `<section>` for page modules
- [ ] Use `<header>` for hero sections
- [ ] Clean accessible `<nav>` navigation

### 🎯 Metadata & Keywords
- [ ] Primary keyword: "Solution for wildlife crop destruction"
- [ ] Local SEO: "Best organic fertilizer in Coimbatore/Tamil Nadu"
- [ ] Page-specific title tags and meta descriptions

---

## Phase 7: Footer & Contact

### 📍 Company Information
- [ ] Company Name: ARD BIOTECH LLP
- [ ] Address: D.No 857, SMD Nagar, Kunnathur, Polur tk, Tiruvannamalai dt, Tamil Nadu - 606803
- [ ] Email: palaniannadasan@gmail.com
- [ ] Phone: 9345792477 / 8189812477

---

## Phase 8: Optimization & Testing

### ⚡ Performance
- [ ] Image optimization (AVIF/WebP via TinyPNG API or Gumlet)
- [ ] Lazy loading for 3D assets
- [ ] Lottie file compression
- [ ] Test on rural 4G network conditions

### 📱 Mobile Optimization
- [ ] Touch-point Firefly implementation
- [ ] Responsive bento-grid layouts
- [ ] Fast initial load (<3s on 4G)

### ✅ Final Checklist
- [ ] Visual Check: Rich Black contrast with Neon Green
- [ ] Typography Check: REMON headings, Inter/Montserrat body
- [ ] Motion Check: Firefly illumination (40% → 75%), scroll-synced animation
- [ ] Trust Check: Awards and founder profiles displayed
- [ ] SEO Check: All schemas implemented
- [ ] Mobile Check: Touch-point guide light working
- [ ] Performance Check: 3D hero optimized for rural networks

---

## Infrastructure

### 🌐 Deployment
- [ ] Set up Vercel hosting
- [ ] Configure Cloudflare CDN
- [ ] Set up Vercel Web Analytics or PostHog

### 📝 Content Management (Future)
- [ ] Evaluate Payload CMS or Strapi
- [ ] PostgreSQL database setup (Supabase/Prisma)
- [ ] Tamil/English localization support

---

**Goal**: Reaching 1 million Tamil Nadu farmers by 2027
