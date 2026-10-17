Technical Stack document
1. Frontend Architecture
To achieve the "Biotech Neon" aesthetic while maintaining elite performance for rural 4G networks, the frontend will leverage a modern React-based framework optimized for speed.
Core Framework: Next.js 15+ (React 19).
Rationale: Provides the best balance of Server-Side Rendering (SSR) and Incremental Static Regeneration (ISR), which are critical for SEO ranking and fast initial load times on unpredictable mobile networks.
Features: Utilizing the App Router for optimized routing and Turbopack for faster build performance.
Styling & UI: Tailwind CSS v4.
Rationale: A utility-first approach that allows for rapid development of the bento-grid layouts and custom neon gradients (#39FF14, #FFD700) without the overhead of heavy CSS libraries.
Typography Implementation:
Headings: REMON (Local font hosting for maximum performance).
Body: Inter or Montserrat via Next.js Font Optimization to prevent Layout Shift (CLS).
2. Motion & 3D Interactive Layer
The high-motion requirements (scroll-synced growth and firefly interaction) require specialized animation engines that do not compromise the browser's main thread.
Animation Orchestration: GSAP (GreenSock Animation Platform) with ScrollTrigger.
Application: Controls the frame-based scrubbing of the paddy growth Lottie animation and manages complex transitions between sections.
Vector Animations: Lottie-Light (React-Lottie).
Application: Renders the paddy crop growth cycle. The "light" version of the library is preferred to minimize the JavaScript bundle size for rural users.
3D Visuals: React Three Fiber (R3F) & Three.js.
Application: Powers the "3D Neon Blue DNA/Plant hybrid molecule" in the hero section.
Optimization: Use Drei helpers for lazy loading models and frameloop="demand" to reduce GPU usage when the user is idle.
Interactive Cursor: Vanilla JavaScript + CSS Custom Properties.
Implementation: Captures coordinates via mousemove (desktop) or touchmove (mobile) to update --clientX and --clientY variables, driving the radial-gradient "Firefly" spotlight.
3. Content & Data Management
A headless CMS approach is required to manage the product catalog (Farm Fort, fertilizers) and scientific research articles while ensuring AI-readability.
Headless CMS: Payload CMS or Strapi.
Rationale: Developer-first, open-source platforms that provide full control over data models and native TypeScript support.
Features: Enables localized content (Tamil/English) and manages the "Social Proof" grid of thousands of farmer feedback images.
Database: PostgreSQL (via Supabase or Prisma ORM).
Rationale: High-performance relational data storage for managing FPO contacts and pilot trial results.
4. Infrastructure & Delivery
Performance in rural Tamil Nadu is the primary constraint. The mission to reach 1 million farmers by 2027 depends on edge-first architecture.
Hosting: Vercel.
Rationale: Built-in optimization for Next.js and high-speed delivery via its global Edge Network, reducing cold starts to approximately 100ms.
Content Delivery Network (CDN): Cloudflare.
Rationale: Cloudflare has a massive presence in India, ensuring that high-resolution biological assets are cached geographically close to the user.
Asset Optimization:
Images: TinyPNG API or Gumlet for real-time AI-based image compression.
Formats: Serving images in AVIF and WebP to reduce file weights by up to 80% compared to JPEG/PNG.
5. SEO & AI Authority Engineering
To rank #1 for "wildlife crop destruction prevention," the technical stack must provide structured data that AI chatbots and search engines can digest instantly.
Structured Data: JSON-LD integrated via Next.js Metadata API.
Schemas: Product Schema (Farm Fort), FAQ Schema (pest queries), and Organization Schema (founder accolades like the Green Champion Award 2022).
AI Readability: Semantic HTML5 architecture.
Application: Strict use of <article> for scientific process pages and <section> for bento-grid modules.
Analytics: Vercel Web Analytics or PostHog.
Rationale: Privacy-conscious and lightweight tracking to monitor conversion funnels for farmers and FPOs without adding bulk to the page load.
6. Development Timeline & Deliverables
Stack Component	Implementation Focus	Phase
Next.js & Tailwind	Baseline "Biotech Neon" visual structure and bento containers.	Phase 1
GSAP & Lottie	Frame-synced plant growth and Firefly cursor logic.	Phase 2
Payload CMS	Product catalog, Trust Grid, and Award documentation.	Phase 3
Vercel & SEO	Schema markup, image compression, and rural speed testing.	Phase 4

