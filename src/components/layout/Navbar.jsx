import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = () => {
            const storedData = localStorage.getItem('user');
            const isLoggedIn = sessionStorage.getItem('isLoggedIn');
            if (storedData && isLoggedIn === 'true') {
                setUser(JSON.parse(storedData));
            } else {
                setUser(null);
            }
        };

        checkUser();
        window.addEventListener('auth-change', checkUser);
        return () => window.removeEventListener('auth-change', checkUser);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('isLoggedIn');
        window.dispatchEvent(new Event('auth-change'));
        navigate('/');
    };

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <nav className="glass-panel main-nav" style={{ padding: '1rem 2rem', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0 0 var(--radius) var(--radius)', position: 'sticky', top: 0, zIndex: 100 }}>
            <div className="container flex-between">
                <Link to="/" className="flex-center" style={{ gap: '0.5rem' }} onClick={() => setIsMobileMenuOpen(false)}>
                    <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Wallet size={20} color="white" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.5px', lineHeight: '1.2' }}>FinX<span className="text-gradient">Manager</span></span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '-2px' }}>made by Piyush Garg</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="nav-links flex-center hidden-mobile" style={{ gap: '1.5rem' }}>
                    <Link to="/about" style={{ fontWeight: 500, color: 'var(--text-muted)', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--text-main)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>About Us</Link>
                    <Link to="/contact" style={{ fontWeight: 500, color: 'var(--text-muted)', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--text-main)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>Contact</Link>

                    {user ? (
                        <div className="flex-center" style={{ gap: '1rem' }}>
                            <Link to="/dashboard/user-details" title={user.name} className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', color: 'white', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 12px var(--primary-glow)', textDecoration: 'none' }}>
                                {getInitials(user.name)}
                            </Link>
                            <button onClick={handleLogout} className="flex-center" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s' }} title="Logout" onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}>
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex-center" style={{ gap: '1.5rem' }}>
                            <Link to="/login" style={{ fontWeight: 500, color: 'var(--text-muted)', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--text-main)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>Log in</Link>
                            <Link to="/signup" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Sign up</Link>
                        </div>
                    )}
                </div>

                {/* Hamburger Trigger for Mobile */}
                <button 
                    className="hidden-desktop flex-center" 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                    style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.03)', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Dropdown Drawer */}
            {isMobileMenuOpen && (
                <div className="hidden-desktop" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-card)',
                    borderBottom: '1px solid var(--border)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    zIndex: 99
                }}>
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 500, padding: '0.5rem 0' }}>About Us</Link>
                    <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 500, padding: '0.5rem 0' }}>Contact</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 600, padding: '0.5rem 0', color: 'var(--primary)' }}>Go to Dashboard</Link>
                            <Link to="/dashboard/user-details" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 500, padding: '0.5rem 0' }}>Profile ({user.name})</Link>
                            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex-center" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.8rem', borderRadius: '8px', width: '100%', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 500, textAlign: 'center', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}>Log in</Link>
                            <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary" style={{ textAlign: 'center', padding: '0.8rem' }}>Sign up</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
