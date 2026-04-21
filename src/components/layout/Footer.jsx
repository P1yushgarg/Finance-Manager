import { Link } from 'react-router-dom';
import { Wallet, Twitter, Github, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="glass-panel" style={{ marginTop: 'auto', borderRadius: 'var(--radius) var(--radius) 0 0', borderBottom: 'none', borderLeft: 'none', borderRight: 'none', padding: '4rem 2rem 2rem 2rem' }}>
            <div className="container dashboard-grid">
                <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Link to="/" className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start' }}>
                        <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Wallet size={20} color="white" />
                        </div>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.5px' }}>FinX<span className="text-gradient">Manager</span></span>
                    </Link>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                        Empowering your financial journey with dynamic insights, beautiful charts, and absolute control.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <a href="#" className="btn-icon-soft"><Twitter size={18} /></a>
                        <a href="#" className="btn-icon-soft"><Github size={18} /></a>
                        <a href="#" className="btn-icon-soft"><Linkedin size={18} /></a>
                    </div>
                </div>

                <div className="col-span-3">
                    <h4 style={{ fontWeight: 600, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Features</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li><Link to="/dashboard" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-main)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Expense Tracking</Link></li>
                        <li><a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-main)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Visual Analytics</a></li>
                        <li><a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-main)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Goal Settings</a></li>
                    </ul>
                </div>

                <div className="col-span-2">
                    <h4 style={{ fontWeight: 600, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Company</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li><Link to="/about" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-main)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>About Us</Link></li>
                        <li><a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-main)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Careers</a></li>
                        <li><Link to="/contact" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-main)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Contact</Link></li>
                    </ul>
                </div>

                <div className="col-span-3">
                    <h4 style={{ fontWeight: 600, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Legal</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li><a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-main)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Privacy Policy</a></li>
                        <li><a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-main)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Terms of Service</a></li>
                    </ul>
                </div>
            </div>

            <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', marginTop: '3rem', paddingTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <p>&copy; {new Date().getFullYear()} FinX Manager. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
