import React from 'react';

export const AlienUFO: React.FC<{ color: string }> = ({ color }) => (
    <group>
        {/* Saucer Body */}
        <mesh>
            <torusGeometry args={[0.7, 0.2, 16, 32]} />
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glass Dome */}
        <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.35, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#88ccff" opacity={0.6} transparent metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Lights */}
        {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[Math.sin(i * Math.PI / 2) * 0.6, 0, Math.cos(i * Math.PI / 2) * 0.6]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={1} />
            </mesh>
        ))}
    </group>
);

export const AlienSpike: React.FC<{ color: string }> = ({ color }) => (
    <group>
        {/* Core */}
        <mesh>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} />
        </mesh>
        {/* Spikes */}
        {[
            [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]
        ].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]} rotation={
                i < 2 ? [0, 0, i === 0 ? 0 : Math.PI] :
                    i < 4 ? [0, 0, i === 2 ? -Math.PI / 2 : Math.PI / 2] :
                        [i === 4 ? Math.PI / 2 : -Math.PI / 2, 0, 0]
            }>
                <coneGeometry args={[0.1, 0.8, 16]} />
                <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
            </mesh>
        ))}
    </group>
);

export const AlienDroid: React.FC<{ color: string }> = ({ color }) => (
    <group>
        {/* Head */}
        <mesh>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Eye */}
        <mesh position={[0, 0, 0.25]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={0.8} />
        </mesh>
        {/* Antenna */}
        <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4]} />
            <meshStandardMaterial color="silver" />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="red" emissive="red" emissiveIntensity={1} />
        </mesh>
    </group>
);

export const AlienTorusBot: React.FC<{ color: string }> = ({ color }) => (
    <group>
        <mesh>
            <torusKnotGeometry args={[0.3, 0.1, 64, 8]} />
            <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
        </mesh>
    </group>
);
