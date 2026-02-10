import React, { useEffect, useRef, useState } from 'react';

const CameraFeed: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment', // Prefer back camera on mobile
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    // Explicitly play to satisfy some mobile browsers
                    videoRef.current.play().catch(e => console.error("Play error:", e));
                }
            } catch (err: any) {
                console.error("Error accessing camera:", err);
                setError(`Camera Error: ${err.message || err.name}. Please ensure you allowed permissions and are using HTTPS or Localhost.`);
            }
        };

        startCamera();

        // Cleanup function to stop tracks when component unmounts
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    if (error) {
        return (
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000',
                color: '#ff4444',
                zIndex: 100 // Ensure it's on top of everything
            }}>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h3>Camera Issue</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover', // Fill the screen
                zIndex: 0, // Base layer
                // transform: 'scaleX(-1)' // Mirror disabled for rear camera (AR mode)
            }}
        />
    );
};

export default CameraFeed;
