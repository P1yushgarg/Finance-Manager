import { User, Mail, Phone, MapPin, Calendar, Clock, Shield } from 'lucide-react';

const UserDetails = () => {
    // Mock user details
    const user = {
        name: 'Piyush',
        email: 'piyush@example.com',
        phone: '+91 98765 43210',
        location: 'Mumbai, India',
        memberSince: 'January 2026',
        lastLogin: 'March 09, 2026, 19:20 IST',
        accountStatus: 'Active',
        plan: 'Premium'
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <header className="flex-between" style={{ marginBottom: '3rem' }}>
                <div>
                    <h1 className="text-hero" style={{ fontSize: '2.5rem' }}>User Details</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Manage your profile and account activity.</p>
                </div>
            </header>

            <div className="dashboard-grid">
                <div className="col-span-8 glass-panel animate-slide-up" style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <User size={48} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{user.name}</h2>
                            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>{user.plan} Member</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <DetailRow icon={<Mail />} label="Email Address" value={user.email} />
                        <DetailRow icon={<Phone />} label="Phone Number" value={user.phone} />
                        <DetailRow icon={<MapPin />} label="Location" value={user.location} />
                        <DetailRow icon={<Calendar />} label="Member Since" value={user.memberSince} />
                    </div>
                </div>

                <div className="col-span-4 animate-slide-up delay-100" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>Security & Activity</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-muted)' }}>
                                <Clock size={20} />
                                <span style={{ fontWeight: 500 }}>Last Login</span>
                            </div>
                            <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>{user.lastLogin}</p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-muted)' }}>
                                <Shield size={20} />
                                <span style={{ fontWeight: 500 }}>Account Status</span>
                            </div>
                            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--success)' }}>{user.accountStatus}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailRow = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            {icon}
        </div>
        <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{label}</p>
            <p style={{ fontWeight: 500, color: 'var(--text-main)' }}>{value}</p>
        </div>
    </div>
);

export default UserDetails;
