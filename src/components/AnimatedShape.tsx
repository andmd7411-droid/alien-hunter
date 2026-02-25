import React, { useRef, useState, useEffect } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AlienUFO, AlienSpike, AlienDroid, AlienTorusBot } from './ComplexAliens';
import { soundManager } from '../utils/SoundManager';

export type ShapeType = 'ufo' | 'spike' | 'droid' | 'torusbot' | 'cube';

interface AnimatedShapeProps {
    type: ShapeType;
    color: string;
    position: [number, number, number];
    name: string;
    onClick: () => void;
    isStealth?: boolean;
}

const AnimatedShape: React.FC<AnimatedShapeProps> = ({ type, color, position, name, onClick, isStealth }) => {
    const meshRef = useRef<THREE.Group>(null);
    const geometryRef = useRef<THREE.Group>(null); // Ref for the visible geometry group
    const [active, setActive] = useState(false);
    const [scale, setScale] = useState(1);

    // Random rotation speed and direction for uniqueness
    const [rotationSpeed, setRotationSpeed] = useState({ x: 0, y: 0 });
    const [floatPhase, setFloatPhase] = useState(0);

    useEffect(() => {
        setRotationSpeed({
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
        });
        setFloatPhase(Math.random() * Math.PI * 2);
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Rotation
        meshRef.current.rotation.x += rotationSpeed.x;
        meshRef.current.rotation.y += rotationSpeed.y;

        // Floating (Sin wave on Y axis)
        const time = state.clock.getElapsedTime();
        meshRef.current.position.y = position[1] + Math.sin(time * 2 + floatPhase) * 0.2;

        // Stealth Animation (Direct Ref Manipulation to avoid re-renders)
        if (geometryRef.current) {
            if (isStealth && !active) {
                // Determine visibility based on noise
                // A value > threshold means visible. 
                // We want it mostly invisible (translucent-ish) but R3F opacity is hard to flicker cheaply without materials.
                // Flickering "visible" prop is a cheap valid stealth effect (like a cloaking device failing).
                // "Visible" 10% of the time randomly, effectively creating a glitchy ghost effect
                geometryRef.current.visible = Math.random() > 0.85;
            } else {
                geometryRef.current.visible = true;
            }
        }

        // Scale animation on click
        if (scale < 1 && scale > 0.01) {
            setScale(prev => prev - 0.1);
        } else if (scale <= 0.01) {
            // Unmount handled by parent removing from list usually
        }
    });

    const handleClick = (e: ThreeEvent<any>) => {
        e.stopPropagation();
        if (active) return; // prevent double clicks

        // Play sound
        soundManager.playCaptureSound();

        setActive(true);
        setScale(0.9);
        onClick();
    };

    const renderGeometry = () => {
        const props = { color: color };
        switch (type) {
            case 'ufo': return <AlienUFO {...props} />;
            case 'spike': return <AlienSpike {...props} />;
            case 'droid': return <AlienDroid {...props} />;
            case 'torusbot': return <AlienTorusBot {...props} />;
            default: return (
                <mesh>
                    <dodecahedronGeometry args={[0.5, 0]} />
                    <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
                </mesh>
            );
        }
    };

    return (
        <group position={[position[0], 0, position[2]]}>
            <group
                ref={meshRef} // Apply ref to group for rotation/position
                position={[0, position[1], 0]}
                onClick={handleClick}
                onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; }}
                scale={scale}
            >
                {/* 
                   Inner group for visibility toggling. 
                   We separate this so the hit-box (outer group) *might* still be clickable if we wanted,
                   but here we hide the visual representation.
                   Actually, if visible=false, raycast might fail. That's good for stealth (hard to click).
                */}
                <group ref={geometryRef}>
                    {renderGeometry()}
                </group>

                {/* Stealth Wireframe Overlay (Mental image of where it might be) */}
                {isStealth && !active && (
                    <mesh>
                        <sphereGeometry args={[0.6, 8, 8]} />
                        <meshBasicMaterial color="white" transparent opacity={0.1} wireframe={true} />
                    </mesh>
                )}
            </group>

            {/* Label */}
            <Html position={[0, position[1] + 1.5, 0]} center>
                <div style={{
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                    border: '1px solid rgba(255,255,255,0.2)',
                    pointerEvents: 'none',
                    opacity: isStealth ? 0 : scale, // Hide label in stealth mode
                    transition: 'opacity 0.2s',
                    display: (isStealth && !active) ? 'none' : 'block' // Ensure it's gone in stealth
                }}>
                    {name}
                </div>
            </Html>
        </group>
    );
};

export default AnimatedShape;
