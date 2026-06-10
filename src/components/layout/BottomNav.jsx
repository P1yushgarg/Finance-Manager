import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, Target, BellRing, User } from 'lucide-react';

const BottomNav = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { icon: <Home size={20} />, label: 'Overview', path: '/dashboard' },
        { icon: <CreditCard size={20} />, label: 'Payments', path: '/dashboard/transactions' },
        { icon: <Target size={20} />, label: 'Goals', path: '/dashboard/goals' },
        { icon: <BellRing size={20} />, label: 'Alerts', path: '/dashboard/alerts' },
        { icon: <User size={20} />, label: 'Profile', path: '/dashboard/user-details' }
    ];

    return (
        <nav className="glass-panel hidden-desktop" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70px',
            background: 'rgba(17, 21, 32, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderTop: '1px solid var(--border)',
            borderBottom: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            borderRadius: 'var(--radius) var(--radius) 0 0',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0 0.5rem',
            zIndex: 1000,
            boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.05)'
        }}>
            {navItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            textDecoration: 'none',
                            fontSize: '0.75rem',
                            fontWeight: isActive ? 600 : 500,
                            flex: 1,
                            height: '100%',
                            transition: 'color 0.3s ease'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            background: isActive 
                                ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.25) 0%, rgba(234, 88, 12, 0.1) 100%)' 
                                : 'transparent',
                            border: isActive ? '1px solid rgba(249, 115, 22, 0.25)' : '1px solid transparent',
                            transform: isActive ? 'scale(1.12)' : 'scale(1)',
                            boxShadow: isActive ? '0 4px 12px rgba(249, 115, 22, 0.15)' : 'none',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}>
                            {item.icon}
                        </div>
                        <span style={{ fontSize: '0.68rem', opacity: isActive ? 1 : 0.8 }}>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default BottomNav;
