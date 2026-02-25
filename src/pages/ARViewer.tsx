import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import AnimatedShape, { type ShapeType } from '../components/AnimatedShape';
import CameraFeed from '../components/CameraFeed';
import { Trophy, Clock, Target, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { soundManager } from '../utils/SoundManager';
import { Explosion } from '../components/Explosion';

const ARViewer: React.FC = () => {
    const navigate = useNavigate();
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [explosions, setExplosions] = useState<{ id: number, position: [number, number, number], color: string }[]>([]);

    // Load High Score
    useEffect(() => {
        const saved = localStorage.getItem('ar-high-score');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    // Save High Score on Win/Loss
    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('ar-high-score', score.toString());
        }
    }, [score, highScore]);

    // Generate aliens based on level
    const generateAliens = (lvl: number) => {
        const count = 3 + lvl * 2; // Level 1: 5, Level 2: 7, etc.
        const newShapes = [];
        // New complex types
        const types: ShapeType[] = ['ufo', 'spike', 'droid', 'torusbot'];
        const colors = ['#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#f97316', '#eab308', '#ec4899'];

        for (let i = 0; i < count; i++) {
            // Spherical coordinates for 360 distribution
            // Level 1: Front 180 degrees (-PI/2 to PI/2)
            // Level 2+: Full 360 degrees (0 to 2PI)
            const angleParams = lvl === 1
                ? { min: -Math.PI / 2, max: Math.PI / 2 }
                : { min: 0, max: Math.PI * 2 };

            const angle = Math.random() * (angleParams.max - angleParams.min) + angleParams.min;

            // Radius increases slightly with level to make them harder to find
            const radius = 4 + Math.random() * (2 + lvl);

            const x = Math.sin(angle) * radius;
            const z = -Math.cos(angle) * radius; // Negative Z is "forward" usually
            const y = (Math.random() * 3) - 0.5; // Height: -0.5 to 2.5 (eye level-ish)

            newShapes.push({
                id: Date.now() + i, // unique ID
                name: `Alien ${i + 1}`,
                type: types[Math.floor(Math.random() * types.length)],
                color: colors[Math.floor(Math.random() * colors.length)],
                position: [x, y, z]
            });
        }
        return newShapes;
    };

    const [shapes, setShapes] = useState<any[]>([]);

    // Init Level
    useEffect(() => {
        setShapes(generateAliens(level));
        setTimeLeft(60); // Reset timer per level
        setGameState('playing');
    }, [level]);

    // Timer Logic
    useEffect(() => {
        if (gameState !== 'playing') return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameState('lost');
                    soundManager.playGameOverSound();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState]);

    // Check Win Condition
    useEffect(() => {
        if (shapes.length === 0 && gameState === 'playing' && score > 0) { // check score to avoid initial trigger
            // Level Complete
            setGameState('won');
            soundManager.playLevelUpSound();
        }
    }, [shapes, gameState, score]);

    const handleCapture = (id: number, position: [number, number, number], color: string) => {
        if (gameState !== 'playing') return;
        setScore(prev => prev + 100 * level); // More points for higher levels
        setShapes(prev => prev.filter(shape => shape.id !== id));

        // Trigger Explosion
        setExplosions(prev => [...prev, { id: Date.now(), position, color }]);
    };

    const nextLevel = () => {
        setLevel(prev => prev + 1);
    };

    const restartGame = () => {
        setLevel(1);
        setScore(0);
        setGameState('playing');
        setShapes(generateAliens(1));
        setTimeLeft(60);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', background: 'transparent', zIndex: 1000, margin: 0, padding: 0 }}>

            {/* 1. Camera Feed Layer (Background) */}
            <CameraFeed />

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                style={{
                    position: 'absolute',
                    top: 'max(20px, env(safe-area-inset-top))',
                    left: 'max(20px, env(safe-area-inset-left))',
                    zIndex: 9999, // Super high z-index
                    background: 'rgba(255, 255, 255, 0.4)',
                    border: '2px solid rgba(255,255,255,0.8)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    backdropFilter: 'blur(8px)',
                    cursor: 'pointer'
                }}
            >
                <ArrowLeft size={28} />
            </button>

            {/* 2. HUD Overlay */}
            <div style={{
                position: 'absolute',
                top: 'max(80px, env(safe-area-inset-top))', // well below the back button and notch
                left: 'max(20px, env(safe-area-inset-left))',
                zIndex: 9999, // Make sure it's above everything
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start', // Align left like the old UI
                gap: '12px',
                pointerEvents: 'none' // Let clicks pass through to Canvas
            }}>
                <div style={{ background: 'rgba(0, 0, 0, 0.8)', padding: '10px 20px', borderRadius: '12px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '12px', border: '2px solid #4ade80', fontSize: '1.2rem', fontFamily: 'monospace' }}>
                    <Trophy size={20} color="#4ade80" />
                    <span style={{ fontWeight: 'bold' }}>SCORE: {score.toString().padStart(6, '0')}</span>
                    <span style={{ fontSize: '0.9rem', color: '#86efac' }}>(HI: {highScore.toString().padStart(6, '0')})</span>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.8)', padding: '10px 20px', borderRadius: '12px', color: timeLeft < 10 ? '#ef4444' : '#60a5fa', display: 'flex', alignItems: 'center', gap: '12px', border: `2px solid ${timeLeft < 10 ? '#ef4444' : '#60a5fa'}`, fontSize: '1.2rem', fontFamily: 'monospace' }}>
                    <Clock size={20} />
                    <span style={{ fontWeight: 'bold' }}>TIME: {timeLeft}s</span>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.8)', padding: '10px 20px', borderRadius: '12px', color: '#facc15', display: 'flex', alignItems: 'center', gap: '12px', border: '2px solid #facc15', fontSize: '1.2rem', fontFamily: 'monospace' }}>
                    <Target size={20} />
                    <span style={{ fontWeight: 'bold' }}>LEVEL: {level}</span>
                </div>
            </div>

            {/* 3. Game State Overlays */}
            {gameState === 'won' && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'white', backdropFilter: 'blur(5px)'
                }}>
                    <h2 style={{ fontSize: '3rem', margin: 0, textShadow: '0 0 20px #22c55e' }}>Level Complete!</h2>
                    <p style={{ fontSize: '1.2rem', margin: '1rem 0 2rem' }}>Ready for a bigger challenge?</p>
                    <button onClick={nextLevel} style={{
                        padding: '12px 32px', fontSize: '1.1rem', fontWeight: 600,
                        background: '#22c55e', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer'
                    }}>
                        Start Level {level + 1}
                    </button>
                </div>
            )}

            {gameState === 'lost' && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.85)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'white', backdropFilter: 'blur(5px)'
                }}>
                    <h2 style={{ fontSize: '3rem', margin: 0, color: '#ef4444' }}>Mission Failed</h2>
                    <p style={{ fontSize: '1.2rem', margin: '1rem 0 2rem' }}>The aliens escaped!</p>
                    <div style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Final Score: {score}</div>
                    <button onClick={restartGame} style={{
                        padding: '12px 32px', fontSize: '1.1rem', fontWeight: 600,
                        background: 'white', color: 'black', borderRadius: '8px', border: 'none', cursor: 'pointer'
                    }}>
                        Try Again
                    </button>
                </div>
            )}

            {/* 4. 3D Scene Layer */}
            {/* Note: gl={{ alpha: true }} ensures canvas background is transparent so video shows through */}
            <Canvas camera={{ position: [0, 3, 8], fov: 50 }} gl={{ alpha: true }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'transparent', zIndex: 10 }}>
                <Suspense fallback={null}>
                    {/* ... lights ... */}
                    <ambientLight intensity={0.4} />
                    <spotLight position={[10, 10, 10]} angle={0.25} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

                    <group position={[0, -1, 0]}>
                        {shapes.map((shape) => (
                            <AnimatedShape
                                key={shape.id}
                                name={shape.name}
                                type={shape.type}
                                color={shape.color}
                                position={shape.position as [number, number, number]}
                                isStealth={level >= 3} // Stealth mode enabled from Level 3
                                onClick={() => handleCapture(shape.id, shape.position, shape.color)}
                            />
                        ))}

                        {/* Explosions */}
                        {explosions.map(exp => (
                            <Explosion
                                key={exp.id}
                                position={exp.position}
                                color={exp.color}
                                onComplete={() => setExplosions(prev => prev.filter(e => e.id !== exp.id))}
                            />
                        ))}

                        <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
                    </group>

                    <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} autoRotate={false} enableZoom={false} enablePan={true} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default ARViewer;
