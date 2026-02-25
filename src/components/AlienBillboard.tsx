import React, { useRef } from 'react';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

interface AlienBillboardProps {
    imagePath: string;
    position: [number, number, number];
    name: string;
}

const AlienBillboard: React.FC<AlienBillboardProps> = ({ imagePath, position, name }) => {
    const texture = useTexture(imagePath);
    const meshRef = useRef<THREE.Mesh>(null);

    // Optional: Make the billboard always face the camera (if desired)
    // useFrame(({ camera }) => {
    //   if (meshRef.current) {
    //     meshRef.current.lookAt(camera.position);
    //   }
    // });

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                {/* Plane Geometry sized based on texture aspect ratio could be advanced, 
            but for now we use a square or fixed ratio */}
                <planeGeometry args={[2, 2]} />
                <meshStandardMaterial
                    map={texture}
                    transparent={true}
                    alphaTest={0.5}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Floating Label */}
            <Html position={[0, 1.2, 0]} center>
                <div style={{
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    {name}
                </div>
            </Html>
        </group>
    );
};

export default AlienBillboard;
