import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PieChart, ArrowLeftRight, Target, Settings, HelpCircle, LogOut, Bell, User } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const NavItem = ({ icon, label, path, isActive }) => (
        <Link
            to={path}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all 0.2s',
                marginBottom: '0.2rem',
                fontWeight: isActive ? 600 : 500
            }}
            onMouseOver={(e) => { if (!isActive) { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'rgba(0,0,0,0.05)' } }}
            onMouseOut={(e) => { if (!isActive) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' } }}
        >
            <div style={{ color: isActive ? 'var(--primary)' : 'inherit' }}>
                {icon}
            </div>
            <span>{label}</span>
        </Link>
    );

    const handleLogout = (e) => {
        e.preventDefault();
        sessionStorage.removeItem('isLoggedIn');
        window.dispatchEvent(new Event('auth-change'));
        // The Link will still navigate to '/' because we use the a tag or Link default behavior? Actually, preventDefault stops navigation.
    };

    return (
        <aside className="glass-panel" style={{
            width: '260px',
            height: 'calc(100vh - 80px)',
            position: 'sticky',
            top: '80px',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            borderLeft: 'none',
            borderRadius: '0 var(--radius) var(--radius) 0'
        }}>
            <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 600 }}>Main Menu</h4>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <NavItem icon={<LayoutDashboard size={20} />} label="Overview" path="/dashboard" isActive={currentPath === '/dashboard'} />
                <NavItem icon={<ArrowLeftRight size={20} />} label="Transactions" path="/dashboard/transactions" isActive={currentPath === '/dashboard/transactions'} />
                <NavItem icon={<Target size={20} />} label="Goals" path="/dashboard/goals" isActive={currentPath === '/dashboard/goals'} />
                <NavItem icon={<Bell size={20} />} label="Alerts" path="/dashboard/alerts" isActive={currentPath === '/dashboard/alerts'} />
                <NavItem icon={<User size={20} />} label="User Details" path="/dashboard/user-details" isActive={currentPath === '/dashboard/user-details'} />
            </nav>

            <div style={{ marginTop: 'auto' }}>
                <div style={{ marginBottom: '1rem', padding: '0 1rem' }}>
                    <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 600 }}>Preferences</h4>
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column' }}>
                    <NavItem icon={<Settings size={20} />} label="Settings" path="#" />
                    <NavItem icon={<HelpCircle size={20} />} label="Help Center" path="#" />
                    <Link
                        to="/"
                        onClick={(e) => {
                            sessionStorage.removeItem('isLoggedIn');
                            window.dispatchEvent(new Event('auth-change'));
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            padding: '0.8rem 1rem',
                            borderRadius: '8px',
                            color: 'var(--text-muted)',
                            background: 'transparent',
                            borderLeft: '3px solid transparent',
                            transition: 'all 0.2s',
                            marginBottom: '0.2rem',
                            fontWeight: 500
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'rgba(0,0,0,0.05)' }}
                        onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </Link>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
