'use client';

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef, useState } from 'react';

import './CircularGallery.css';

function debounce(func: (...args: unknown[]) => void, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function (this: unknown, ...args: unknown[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function lerp(p1: number, p2: number, t: number) {
    return p1 + (p2 - p1) * t;
}

function autoBind(instance: object) {
    const proto = Object.getPrototypeOf(instance);
    Object.getOwnPropertyNames(proto).forEach(key => {
        if (key !== 'constructor' && typeof (instance as Record<string, unknown>)[key] === 'function') {
            (instance as Record<string, unknown>)[key] = ((instance as Record<string, unknown>)[key] as Function).bind(instance);
        }
    });
}
// Helper function to wrap text into multiple lines
function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = context.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) {
        lines.push(currentLine);
    }
    return lines;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createTextTexture(gl: any, text: string, _font = 'bold 24px sans-serif', color = 'white') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;

    // Parse text - check if it has name | description format
    const parts = text.split(' | ');
    const productName = parts[0] || text;
    const description = parts[1] || '';

    const scale = 3; // Higher resolution for clarity
    const nameFont = `bold ${36 * scale}px sans-serif`;
    const descFont = `${26 * scale}px sans-serif`;
    const maxTextWidth = 500 * scale; // Max width for word wrapping
    const lineHeight = 32 * scale;

    // Measure product name
    context.font = nameFont;
    const nameWidth = context.measureText(productName).width;

    // Wrap description into multiple lines
    context.font = descFont;
    const descLines = description ? wrapText(context, description, maxTextWidth) : [];

    // Calculate canvas size
    let maxLineWidth = nameWidth;
    for (const line of descLines) {
        const lineWidth = context.measureText(line).width;
        if (lineWidth > maxLineWidth) maxLineWidth = lineWidth;
    }

    const padding = 80 * scale;
    canvas.width = Math.max(maxLineWidth + padding, 600 * scale);

    // Height: name + gap + (description lines * lineHeight)
    const nameHeight = 45 * scale;
    const gapAfterName = 20 * scale;
    const descHeight = descLines.length * lineHeight;
    canvas.height = nameHeight + gapAfterName + descHeight + (40 * scale);

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw product name (bold, larger, bright white)
    context.font = nameFont;
    context.fillStyle = color;
    context.textBaseline = 'top';
    context.textAlign = 'center';
    context.fillText(productName, canvas.width / 2, 10 * scale);

    // Draw description lines (slightly dimmer, multiple lines)
    if (descLines.length > 0) {
        context.font = descFont;
        context.fillStyle = 'rgba(220, 220, 220, 0.95)';

        let yPos = nameHeight + gapAfterName;
        for (const line of descLines) {
            context.fillText(line, canvas.width / 2, yPos);
            yPos += lineHeight;
        }
    }

    const texture = new Texture(gl, { generateMipmaps: false });
    texture.image = canvas;
    return { texture, width: canvas.width, height: canvas.height };
}

class Title {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gl: any;
    plane: Mesh;
    renderer: Renderer;
    text: string;
    textColor: string;
    font: string;
    mesh!: Mesh;

    constructor({ gl, plane, renderer, text, textColor = '#545050', font = '30px sans-serif' }: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        gl: any;
        plane: Mesh;
        renderer: Renderer;
        text: string;
        textColor?: string;
        font?: string;
    }) {
        autoBind(this);
        this.gl = gl;
        this.plane = plane;
        this.renderer = renderer;
        this.text = text;
        this.textColor = textColor;
        this.font = font;
        this.createMesh();
    }

    createMesh() {
        const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
        const geometry = new Plane(this.gl);
        const program = new Program(this.gl, {
            vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
            uniforms: { tMap: { value: texture } },
            transparent: true
        });
        this.mesh = new Mesh(this.gl, { geometry, program });
        const aspect = width / height;
        // Increased text height for better visibility
        const textHeight = this.plane.scale.y * 0.35;
        const textWidth = textHeight * aspect;
        this.mesh.scale.set(textWidth, textHeight, 1);
        // Position text below the product image
        this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.15;
        this.mesh.setParent(this.plane);
    }
}

interface MediaProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    geometry: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gl: any;
    image: string;
    index: number;
    length: number;
    renderer: Renderer;
    scene: Transform;
    screen: { width: number; height: number };
    text: string;
    viewport: { width: number; height: number };
    bend: number;
    textColor: string;
    borderRadius: number;
    font: string;
}

class Media {
    extra = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    geometry: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gl: any;
    image: string;
    index: number;
    length: number;
    renderer: Renderer;
    scene: Transform;
    screen: { width: number; height: number };
    text: string;
    viewport: { width: number; height: number };
    bend: number;
    textColor: string;
    borderRadius: number;
    font: string;
    program!: Program;
    plane!: Mesh;
    title!: Title;
    scale = 1;
    padding = 2;
    width = 0;
    widthTotal = 0;
    x = 0;
    speed = 0;
    isBefore = false;
    isAfter = false;

    constructor(props: MediaProps) {
        this.geometry = props.geometry;
        this.gl = props.gl;
        this.image = props.image;
        this.index = props.index;
        this.length = props.length;
        this.renderer = props.renderer;
        this.scene = props.scene;
        this.screen = props.screen;
        this.text = props.text;
        this.viewport = props.viewport;
        this.bend = props.bend;
        this.textColor = props.textColor;
        this.borderRadius = props.borderRadius;
        this.font = props.font;
        this.createShader();
        this.createMesh();
        this.createTitle();
        this.onResize();
    }

    createShader() {
        const texture = new Texture(this.gl, { generateMipmaps: true });
        this.program = new Program(this.gl, {
            depthTest: false,
            depthWrite: false,
            vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
            fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
            uniforms: {
                tMap: { value: texture },
                uPlaneSizes: { value: [0, 0] },
                uImageSizes: { value: [0, 0] },
                uSpeed: { value: 0 },
                uTime: { value: 100 * Math.random() },
                uBorderRadius: { value: this.borderRadius }
            },
            transparent: true
        });
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = this.image;
        img.onload = () => {
            texture.image = img;
            this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
        };
    }

    createMesh() {
        this.plane = new Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program
        });
        this.plane.setParent(this.scene);
    }

    createTitle() {
        this.title = new Title({
            gl: this.gl,
            plane: this.plane,
            renderer: this.renderer,
            text: this.text,
            textColor: this.textColor,
            font: this.font
        });
    }

    update(scroll: { current: number; last: number }, direction: string) {
        this.plane.position.x = this.x - scroll.current - this.extra;

        const x = this.plane.position.x;
        const H = this.viewport.width / 2;

        if (this.bend === 0) {
            this.plane.position.y = 0;
            this.plane.rotation.z = 0;
        } else {
            const B_abs = Math.abs(this.bend);
            const R = (H * H + B_abs * B_abs) / (2 * B_abs);
            const effectiveX = Math.min(Math.abs(x), H);

            const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
            if (this.bend > 0) {
                this.plane.position.y = -arc;
                this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
            } else {
                this.plane.position.y = arc;
                this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
            }
        }

        this.speed = scroll.current - scroll.last;
        this.program.uniforms.uTime.value += 0.04;
        this.program.uniforms.uSpeed.value = this.speed;

        const planeOffset = this.plane.scale.x / 2;
        const viewportOffset = this.viewport.width / 2;
        this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
        this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
        if (direction === 'right' && this.isBefore) {
            this.extra -= this.widthTotal;
            this.isBefore = this.isAfter = false;
        }
        if (direction === 'left' && this.isAfter) {
            this.extra += this.widthTotal;
            this.isBefore = this.isAfter = false;
        }
    }

    onResize({ screen, viewport }: { screen?: { width: number; height: number }; viewport?: { width: number; height: number } } = {}) {
        if (screen) this.screen = screen;
        if (viewport) {
            this.viewport = viewport;
        }
        this.scale = this.screen.height / 1500;
        // Larger cards so only ~3 are visible at a time
        this.plane.scale.y = (this.viewport.height * (1200 * this.scale)) / this.screen.height;
        this.plane.scale.x = (this.viewport.width * (1400 * this.scale)) / this.screen.width;
        this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
        this.padding = 0.6;
        this.width = this.plane.scale.x + this.padding;
        this.widthTotal = this.width * this.length;
        this.x = this.width * this.index;
    }
}

interface GalleryItem {
    image: string;
    text: string;
}

interface AppOptions {
    items?: GalleryItem[];
    bend?: number;
    textColor?: string;
    borderRadius?: number;
    font?: string;
    scrollSpeed?: number;
    scrollEase?: number;
    initialIndex?: number;
    autoScrollDelay?: number;
    autoScrollInterval?: number;
    onIndexChange?: (index: number) => void;
}

class App {
    container: HTMLElement;
    scrollSpeed: number;
    scroll: { ease: number; current: number; target: number; last: number; position?: number };
    onCheckDebounce: (...args: unknown[]) => void;
    renderer!: Renderer;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gl!: any;
    camera!: Camera;
    scene!: Transform;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    planeGeometry!: any;
    mediasImages: GalleryItem[] = [];
    medias: Media[] = [];
    screen = { width: 0, height: 0 };
    viewport = { width: 0, height: 0 };
    isDown = false;
    start = 0;
    raf = 0;
    boundOnResize!: () => void;
    boundOnWheel!: (e: WheelEvent) => void;
    boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
    boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
    boundOnTouchUp!: () => void;

    // Auto-scroll properties
    initialIndex: number;
    autoScrollDelay: number;
    autoScrollInterval: number;
    lastInteractionTime = 0;
    autoScrollTimer: ReturnType<typeof setInterval> | null = null;
    autoScrollStartTimer: ReturnType<typeof setTimeout> | null = null;
    onIndexChange: ((index: number) => void) | null = null;
    currentIndex = 0;
    originalItemCount = 0;

    constructor(
        container: HTMLElement,
        {
            items,
            bend = 1,
            textColor = '#ffffff',
            borderRadius = 0,
            font = 'bold 30px Figtree',
            scrollSpeed = 2,
            scrollEase = 0.05,
            initialIndex = 0,
            autoScrollDelay = 5000,
            autoScrollInterval = 2000,
            onIndexChange
        }: AppOptions = {}
    ) {
        document.documentElement.classList.remove('no-js');
        this.container = container;
        this.scrollSpeed = scrollSpeed;
        this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
        this.initialIndex = initialIndex;
        this.autoScrollDelay = autoScrollDelay;
        this.autoScrollInterval = autoScrollInterval;
        this.onIndexChange = onIndexChange || null;
        this.originalItemCount = items?.length || 0;
        this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
        this.createRenderer();
        this.createCamera();
        this.createScene();
        this.onResize();
        this.createGeometry();
        this.createMedias(items, bend, textColor, borderRadius, font);
        this.update();
        this.addEventListeners();

        // Scroll to initial index after a small delay
        if (initialIndex > 0 && this.medias.length > 0) {
            const width = this.medias[0].width;
            this.scroll.target = width * initialIndex;
            this.scroll.current = width * initialIndex;
        }

        // Start auto-scroll
        this.startAutoScroll();
    }

    createRenderer() {
        this.renderer = new Renderer({
            alpha: true,
            antialias: true,
            dpr: Math.min(window.devicePixelRatio || 1, 2)
        });
        this.gl = this.renderer.gl;
        this.gl.clearColor(0, 0, 0, 0);
        this.container.appendChild(this.gl.canvas as HTMLCanvasElement);
    }

    createCamera() {
        this.camera = new Camera(this.gl);
        this.camera.fov = 45;
        this.camera.position.z = 20;
    }

    createScene() {
        this.scene = new Transform();
    }

    createGeometry() {
        this.planeGeometry = new Plane(this.gl, {
            heightSegments: 50,
            widthSegments: 100
        });
    }

    createMedias(items: GalleryItem[] | undefined, bend = 1, textColor: string, borderRadius: number, font: string) {
        const defaultItems: GalleryItem[] = [
            { image: `https://picsum.photos/seed/1/800/600?grayscale`, text: 'Bridge' },
            { image: `https://picsum.photos/seed/2/800/600?grayscale`, text: 'Desk Setup' }
        ];
        const galleryItems = items && items.length ? items : defaultItems;
        this.mediasImages = galleryItems.concat(galleryItems);
        this.medias = this.mediasImages.map((data, index) => {
            return new Media({
                geometry: this.planeGeometry,
                gl: this.gl,
                image: data.image,
                index,
                length: this.mediasImages.length,
                renderer: this.renderer,
                scene: this.scene,
                screen: this.screen,
                text: data.text,
                viewport: this.viewport,
                bend,
                textColor,
                borderRadius,
                font
            });
        });
    }

    onTouchDown(e: MouseEvent | TouchEvent) {
        this.isDown = true;
        this.scroll.position = this.scroll.current;
        this.start = 'touches' in e ? e.touches[0].clientX : e.clientX;
        this.recordInteraction();
    }

    onTouchMove(e: MouseEvent | TouchEvent) {
        if (!this.isDown) return;
        const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const distance = (this.start - x) * (this.scrollSpeed * 0.025);
        this.scroll.target = (this.scroll.position || 0) + distance;
    }

    onTouchUp() {
        this.isDown = false;
        this.onCheck();
    }

    onWheel(e: WheelEvent) {
        const delta = e.deltaY;
        this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
        this.onCheckDebounce();
        this.recordInteraction();
    }

    onCheck() {
        if (!this.medias || !this.medias[0]) return;
        const width = this.medias[0].width;
        const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
        const item = width * itemIndex;
        this.scroll.target = this.scroll.target < 0 ? -item : item;

        // Update current index and notify
        if (this.originalItemCount > 0) {
            this.currentIndex = itemIndex % this.originalItemCount;
            if (this.onIndexChange) {
                this.onIndexChange(this.currentIndex);
            }
        }
    }

    // Auto-scroll methods
    recordInteraction() {
        this.lastInteractionTime = Date.now();
        this.stopAutoScroll();
        this.startAutoScroll();
    }

    startAutoScroll() {
        this.stopAutoScroll();
        this.autoScrollStartTimer = setTimeout(() => {
            this.autoScrollTimer = setInterval(() => {
                if (Date.now() - this.lastInteractionTime >= this.autoScrollDelay) {
                    this.scrollToNext();
                }
            }, this.autoScrollInterval);
        }, this.autoScrollDelay);
    }

    stopAutoScroll() {
        if (this.autoScrollStartTimer) clearTimeout(this.autoScrollStartTimer);
        if (this.autoScrollTimer) clearInterval(this.autoScrollTimer);
        this.autoScrollStartTimer = null;
        this.autoScrollTimer = null;
    }

    scrollToNext() {
        if (!this.medias || !this.medias[0]) return;
        const width = this.medias[0].width;
        this.scroll.target += width;
        this.onCheck();
    }

    scrollToPrev() {
        if (!this.medias || !this.medias[0]) return;
        const width = this.medias[0].width;
        this.scroll.target -= width;
        this.onCheck();
    }

    scrollToItem(index: number) {
        if (!this.medias || !this.medias[0]) return;
        const width = this.medias[0].width;
        this.scroll.target = width * index;
        this.onCheck();
    }

    onResize() {
        this.screen = {
            width: this.container.clientWidth,
            height: this.container.clientHeight
        };
        this.renderer.setSize(this.screen.width, this.screen.height);
        this.camera.perspective({
            aspect: this.screen.width / this.screen.height
        });
        const fov = (this.camera.fov * Math.PI) / 180;
        const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
        const width = height * this.camera.aspect;
        this.viewport = { width, height };
        if (this.medias) {
            this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
        }
    }

    update() {
        this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
        const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
        if (this.medias) {
            this.medias.forEach(media => media.update(this.scroll, direction));
        }
        this.renderer.render({ scene: this.scene, camera: this.camera });
        this.scroll.last = this.scroll.current;
        this.raf = window.requestAnimationFrame(this.update.bind(this));
    }

    addEventListeners() {
        this.boundOnResize = this.onResize.bind(this);
        this.boundOnWheel = this.onWheel.bind(this);
        this.boundOnTouchDown = this.onTouchDown.bind(this);
        this.boundOnTouchMove = this.onTouchMove.bind(this);
        this.boundOnTouchUp = this.onTouchUp.bind(this);
        window.addEventListener('resize', this.boundOnResize);
        window.addEventListener('mousewheel', this.boundOnWheel as EventListener);
        window.addEventListener('wheel', this.boundOnWheel);
        window.addEventListener('mousedown', this.boundOnTouchDown as EventListener);
        window.addEventListener('mousemove', this.boundOnTouchMove as EventListener);
        window.addEventListener('mouseup', this.boundOnTouchUp);
        window.addEventListener('touchstart', this.boundOnTouchDown as EventListener);
        window.addEventListener('touchmove', this.boundOnTouchMove as EventListener);
        window.addEventListener('touchend', this.boundOnTouchUp);
    }

    destroy() {
        this.stopAutoScroll();
        window.cancelAnimationFrame(this.raf);
        window.removeEventListener('resize', this.boundOnResize);
        window.removeEventListener('mousewheel', this.boundOnWheel as EventListener);
        window.removeEventListener('wheel', this.boundOnWheel);
        window.removeEventListener('mousedown', this.boundOnTouchDown as EventListener);
        window.removeEventListener('mousemove', this.boundOnTouchMove as EventListener);
        window.removeEventListener('mouseup', this.boundOnTouchUp);
        window.removeEventListener('touchstart', this.boundOnTouchDown as EventListener);
        window.removeEventListener('touchmove', this.boundOnTouchMove as EventListener);
        window.removeEventListener('touchend', this.boundOnTouchUp);
        if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
            this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas as Node);
        }
    }
}

interface CircularGalleryProps {
    items?: GalleryItem[];
    bend?: number;
    textColor?: string;
    borderRadius?: number;
    font?: string;
    scrollSpeed?: number;
    scrollEase?: number;
    initialIndex?: number;
    autoScrollDelay?: number;
    autoScrollInterval?: number;
}

export default function CircularGallery({
    items,
    bend = 3,
    textColor = '#ffffff',
    borderRadius = 0.05,
    font = 'bold 30px Figtree',
    scrollSpeed = 2,
    scrollEase = 0.05,
    initialIndex = 0,
    autoScrollDelay = 5000,
    autoScrollInterval = 2000
}: CircularGalleryProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<App | null>(null);
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const totalItems = items?.length || 0;

    useEffect(() => {
        if (!containerRef.current) return;
        const app = new App(containerRef.current, {
            items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase,
            initialIndex,
            autoScrollDelay,
            autoScrollInterval,
            onIndexChange: (index: number) => setActiveIndex(index)
        });
        appRef.current = app;
        return () => {
            app.destroy();
            appRef.current = null;
        };
    }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, initialIndex, autoScrollDelay, autoScrollInterval]);

    const goToNext = () => {
        appRef.current?.scrollToNext();
        appRef.current?.recordInteraction();
    };

    const goToPrev = () => {
        appRef.current?.scrollToPrev();
        appRef.current?.recordInteraction();
    };

    const goToItem = (index: number) => {
        appRef.current?.scrollToItem(index);
        appRef.current?.recordInteraction();
    };

    return (
        <div className="circular-gallery-wrapper">
            <div className="circular-gallery" ref={containerRef} />

            {/* Navigation arrows */}
            <button className="cg-arrow cg-arrow-left" onClick={goToPrev} aria-label="Previous product">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>
            <button className="cg-arrow cg-arrow-right" onClick={goToNext} aria-label="Next product">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            {/* Dot indicators */}
            {totalItems > 0 && (
                <div className="cg-dots">
                    {Array.from({ length: totalItems }).map((_, index) => (
                        <button
                            key={index}
                            className={`cg-dot ${index === activeIndex ? 'cg-dot-active' : ''}`}
                            onClick={() => goToItem(index)}
                            aria-label={`Go to product ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
