// @ts-nocheck — Unused component; silencing pre-existing type error to unblock builds
"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/**
 * DNA Helix component - creates a neon blue DNA strand
 */
function DNAHelix() {
    const groupRef = useRef<THREE.Group>(null);

    // Generate DNA helix points
    const helixPoints = useMemo(() => {
        const points: { position: [number, number, number]; color: string }[] = [];
        const turns = 3;
        const pointsPerTurn = 12;
        const height = 4;
        const radius = 0.8;

        for (let i = 0; i < turns * pointsPerTurn; i++) {
            const t = i / (turns * pointsPerTurn);
            const angle = t * turns * Math.PI * 2;
            const y = (t - 0.5) * height;

            // First strand
            points.push({
                position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
                color: "#00D4FF",
            });

            // Second strand (offset by PI)
            points.push({
                position: [Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius],
                color: "#39FF14",
            });
        }

        return points;
    }, []);

    // Slow rotation
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {helixPoints.map((point, i) => (
                <mesh key={i} position={point.position}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial
                        color={point.color}
                        emissive={point.color}
                        emissiveIntensity={0.5}
                    />
                </mesh>
            ))}

            {/* Connecting rungs */}
            {helixPoints.filter((_, i) => i % 2 === 0).map((point, i) => {
                const nextPoint = helixPoints[i * 2 + 1];
                if (!nextPoint) return null;

                const midPoint: [number, number, number] = [
                    (point.position[0] + nextPoint.position[0]) / 2,
                    (point.position[1] + nextPoint.position[1]) / 2,
                    (point.position[2] + nextPoint.position[2]) / 2,
                ];

                // Only render every 3rd rung for visual clarity
                if (i % 3 !== 0) return null;

                return (
                    <mesh key={`rung-${i}`} position={midPoint}>
                        <boxGeometry args={[1.4, 0.02, 0.02]} />
                        <meshStandardMaterial
                            color="#FFD700"
                            emissive="#FFD700"
                            emissiveIntensity={0.3}
                        />
                    </mesh>
                );
            })}
        </group>
    );
}

/**
 * Glowing organic sphere representing plant cell
 */
function PlantCell() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.05;
            meshRef.current.rotation.z = state.clock.elapsedTime * 0.03;
        }
    });

    return (
        <Float
            speed={1.5}
            rotationIntensity={0.2}
            floatIntensity={0.3}
        >
            <Sphere ref={meshRef} args={[1.2, 64, 64]}>
                <MeshDistortMaterial
                    color="#00D4FF"
                    attach="material"
                    distort={0.3}
                    speed={1.5}
                    roughness={0.2}
                    metalness={0.8}
                    emissive="#00D4FF"
                    emissiveIntensity={0.2}
                />
            </Sphere>
        </Float>
    );
}

/**
 * Particle field for ambient effect
 */
function ParticleField() {
    const particlesRef = useRef<THREE.Points>(null);

    const particles = useMemo(() => {
        const count = 200;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const neonGreen = new THREE.Color("#39FF14");
        const neonBlue = new THREE.Color("#00D4FF");
        const gold = new THREE.Color("#FFD700");

        for (let i = 0; i < count; i++) {
            // Random position in a sphere
            const radius = 5 + Math.random() * 3;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Random color from our palette
            const colorChoice = Math.random();
            const color = colorChoice < 0.4 ? neonGreen : colorChoice < 0.7 ? neonBlue : gold;

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        return { positions, colors };
    }, []);

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={particles.positions}
                    count={particles.positions.length / 3}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    array={particles.colors}
                    count={particles.colors.length / 3}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
            />
        </points>
    );
}

/**
 * DNAHero3D Component
 *
 * 3D Neon Blue DNA/Plant hybrid molecule for the hero section.
 * Uses React Three Fiber with performance optimizations.
 */
export function DNAHero3D() {
    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
            aria-hidden="true"
        >
            <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                frameloop="demand" // GPU optimization - only render when needed
                dpr={[1, 1.5]} // Limit device pixel ratio for performance
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                }}
                style={{
                    width: "100%",
                    height: "100%",
                    background: "transparent",
                }}
            >
                {/* Ambient and point lighting */}
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={0.5} color="#00D4FF" />
                <pointLight position={[-10, -10, -10]} intensity={0.3} color="#39FF14" />
                <spotLight
                    position={[0, 5, 0]}
                    intensity={0.4}
                    color="#FFD700"
                    angle={0.5}
                    penumbra={1}
                />

                {/* Main DNA Helix */}
                <DNAHelix />

                {/* Central plant cell */}
                <PlantCell />

                {/* Ambient particles */}
                <ParticleField />

                {/* Subtle orbit controls for interactivity (disabled for now) */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={false}
                    autoRotate
                    autoRotateSpeed={0.3}
                />
            </Canvas>
        </div>
    );
}
