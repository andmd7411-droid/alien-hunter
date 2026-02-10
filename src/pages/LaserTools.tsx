import React from 'react';

const LaserTools: React.FC = () => {
    return (
        <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Laser Utilities</h2>
            <div className="glass-panel" style={{ padding: '3rem', borderRadius: '16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>This module is currently under construction.</p>
                <p>Features to implementation: Vector Conversion, G-Code Generation.</p>
            </div>
        </div>
    );
};

export default LaserTools;
