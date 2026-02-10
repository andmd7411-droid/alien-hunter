import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ExplosionProps {
    position: [number, number, number];
    color: string;
    onComplete: () => void;
}

const PARTICLE_COUNT = 20;

export const Explosion: React.FC<ExplosionProps> = ({ position, color, onComplete }) => {
    const groupRef = useRef<THREE.Group>(null);
    const particles = useMemo(() => {
        return new Array(PARTICLE_COUNT).fill(0).map(() => ({
            velocity: [
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
            ],
            scale: Math.random() * 0.5 + 0.2,
        }));
    }, []);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        let activeParticles = false;

        groupRef.current.children.forEach((child, i) => {
            const mesh = child as THREE.Mesh;
            const particle = particles[i];

            // Move
            mesh.position.x += particle.velocity[0];
            mesh.position.y += particle.velocity[1];
            mesh.position.z += particle.velocity[2];

            // Shrink
            if (mesh.scale.x > 0) {
                mesh.scale.x -= delta * 2;
                mesh.scale.y -= delta * 2;
                mesh.scale.z -= delta * 2;
                activeParticles = true;
            } else {
                mesh.scale.set(0, 0, 0);
            }
        });

        if (!activeParticles) {
            onComplete();
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {particles.map((_, i) => (
                <mesh key={i} position={[0, 0, 0]}>
                    <dodecahedronGeometry args={[0.2, 0]} />
                    <meshBasicMaterial color={color} transparent opacity={0.8} />
                </mesh>
            ))}
        </group>
    );
};
