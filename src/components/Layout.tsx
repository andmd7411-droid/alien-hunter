import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Zap, Box, Scan } from 'lucide-react';

const Layout: React.FC = () => {
    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            {/* Sidebar - Persistent Navigation */}
            <aside style={{
                width: '260px',
                backgroundColor: 'var(--bg-sidebar)',
                borderRight: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                justifyContent: 'space-between'
            }}>
                {/* Header / Logo */}
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '3rem',
                        color: 'var(--text-primary)',
                        gap: '0.75rem'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 15px var(--accent-glow)'
                        }}>
                            <Zap size={18} color="white" fill="white" />
                        </div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
                            Helper<span className="text-gradient">Hub</span>
                        </h1>
                    </div>

                    {/* Navigation Links */}
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <NavLink
                            to="/"
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                                backgroundColor: isActive ? 'var(--bg-card-hover)' : 'transparent',
                                fontWeight: isActive ? 600 : 500,
                                fontSize: '0.95rem',
                                transition: 'var(--transition-fast)'
                            })}
                        >
                            <LayoutDashboard size={20} />
                            Dashboard
                        </NavLink>

                        {/* Future Tools - Placeholders */}
                        <NavLink
                            to="/laser"
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                                backgroundColor: isActive ? 'var(--bg-card-hover)' : 'transparent',
                                fontWeight: isActive ? 600 : 500,
                                fontSize: '0.95rem',
                                transition: 'var(--transition-fast)'
                            })}
                        >
                            <Box size={20} />
                            Laser Utils
                        </NavLink>

                        <NavLink
                            to="/ar-viewer"
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                                backgroundColor: isActive ? 'var(--bg-card-hover)' : 'transparent',
                                fontWeight: isActive ? 600 : 500,
                                fontSize: '0.95rem',
                                transition: 'var(--transition-fast)'
                            })}
                        >
                            <Scan size={20} />
                            AR Viewer
                        </NavLink>
                    </nav>
                </div>

                {/* Footer / Status */}
                <div style={{
                    padding: '1rem 0',
                    borderTop: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#22c55e',
                        boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)'
                    }} />
                    System Online
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{
                flex: 1,
                backgroundColor: 'var(--bg-app)',
                overflowY: 'auto',
                position: 'relative'
            }}>
                {/* Decorative Background Glow */}
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />

                <div style={{ padding: '2rem', position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
