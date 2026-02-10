import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Scan, ArrowRight, Activity, Cpu } from 'lucide-react';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const tools = [
        {
            id: 'laser',
            title: 'Laser Utilities',
            description: 'Convert vectors, optimize paths, and prepare files for laser engraving.',
            icon: <Box size={32} strokeWidth={1.5} />,
            color: 'var(--accent-primary)',
            path: '/laser',
            status: 'Ready'
        },
        {
            id: 'ar',
            title: 'AR Viewer',
            description: 'Visualize 3D models in augmented reality. Test spatial interactions.',
            icon: <Scan size={32} strokeWidth={1.5} />,
            color: 'var(--accent-secondary)',
            path: '/ar-viewer',
            status: 'Coming Soon'
        }
    ];

    return (
        <div>
            <header style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Welcome back, <span className="text-gradient">User</span>
                </h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>
                    Your central command center for all utility applications. Select a tool to get started.
                </p>
            </header>

            {/* Stats / Quick View */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                        <Activity size={18} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>System Status</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>Operational</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                        <Cpu size={18} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Active Modules</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>2 Loaded</div>
                </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Available Tools</h3>

            {/* Tools Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                {tools.map((tool) => (
                    <div
                        key={tool.id}
                        className="glass-panel"
                        onClick={() => navigate(tool.path)}
                        style={{
                            padding: '2rem',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: 'var(--transition-normal)',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.borderColor = tool.color;
                            e.currentTarget.style.boxShadow = `0 10px 40px -10px ${tool.color}33`; // 33 is ~20% opacity
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'var(--glass-border)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '12px',
                            backgroundColor: `${tool.color}22`, // ~13% opacity
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: tool.color
                        }}>
                            {tool.icon}
                        </div>

                        <div>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{tool.title}</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                {tool.description}
                            </p>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 'auto',
                            paddingTop: '1rem',
                            borderTop: '1px solid var(--border-subtle)'
                        }}>
                            <span style={{
                                fontSize: '0.8rem',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                backgroundColor: 'var(--bg-app)',
                                color: tool.status === 'Ready' ? '#22c55e' : 'var(--text-muted)',
                                border: '1px solid var(--border-subtle)'
                            }}>
                                {tool.status}
                            </span>
                            <ArrowRight size={20} color="var(--text-muted)" />
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder */}
                <div
                    className="glass-panel"
                    style={{
                        padding: '2rem',
                        borderRadius: '16px',
                        borderStyle: 'dashed',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        gap: '1rem',
                        minHeight: '280px',
                        opacity: 0.6
                    }}
                >
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '2rem', fontWeight: 200 }}>+</span>
                    </div>
                    <p>Add New Tool</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
