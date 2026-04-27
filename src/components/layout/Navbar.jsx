import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, LogOut } from 'lucide-react';

const Navbar = () => {
    const [user, setUser] = useState(null);
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
        <nav className="glass-panel" style={{ padding: '1rem 2rem', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0 0 var(--radius) var(--radius)', position: 'sticky', top: 0, zIndex: 50 }}>
            <div className="container flex-between">
                <Link to="/" className="flex-center" style={{ gap: '0.5rem' }}>
                    <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Wallet size={20} color="white" />
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.5px' }}>FinX<span className="text-gradient">Manager</span></span>
                </Link>
                <div className="nav-links flex-center" style={{ gap: '1.5rem' }}>
                    <Link to="/about" style={{ fontWeight: 500, color: 'var(--text-muted)', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--text-main)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>About Us</Link>
                    <Link to="/contact" style={{ fontWeight: 500, color: 'var(--text-muted)', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--text-main)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>Contact</Link>

                    {user ? (
                        <div className="flex-center" style={{ gap: '1rem' }}>
                            <div title={user.name} className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%)', color: 'white', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3)' }}>
                                {getInitials(user.name)}
                            </div>
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
            </div>
        </nav>
    );
};

export default Navbar;
