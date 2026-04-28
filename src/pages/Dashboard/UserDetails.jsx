import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, Clock, Shield, Edit2, Check, X, User } from 'lucide-react';

const UserDetails = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', phone: '', location: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const userObj = JSON.parse(localStorage.getItem('user'));
            if (userObj && userObj.id) {
                const response = await fetch(`/api/auth/user/${userObj.id}`);
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    setEditData({
                        name: userData.name,
                        phone: userData.phone || '',
                        location: userData.location || ''
                    });
                } else {
                    setError('Failed to fetch user details');
                }
            }
        } catch (err) {
            console.error('Failed to fetch user details', err);
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const userObj = JSON.parse(localStorage.getItem('user'));
            if (!userObj || !userObj.id) return;

            const response = await fetch(`/api/auth/user/${userObj.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser.user);
                localStorage.setItem('user', JSON.stringify(updatedUser.user));
                setIsEditing(false);
                window.dispatchEvent(new Event('auth-change'));
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to update user details');
            }
        } catch (err) {
            console.error('Failed to update user details', err);
            setError('Network error');
        }
    };

    const handleCancel = () => {
        if (user) {
            setEditData({
                name: user.name,
                phone: user.phone || '',
                location: user.location || ''
            });
        }
        setIsEditing(false);
        setError('');
    };

    if (loading) {
        return (
            <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
                <header className="flex-between" style={{ marginBottom: '3rem' }}>
                    <div>
                        <h1 className="text-hero" style={{ fontSize: '2.5rem' }}>User Details</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Manage your profile and account activity.</p>
                    </div>
                </header>
                <div className="glass-panel" style={{ padding: '2.5rem' }}>
                    <div className="flex-center" style={{ height: '200px' }}>
                        <p style={{ color: 'var(--text-muted)' }}>Loading user details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
                <header className="flex-between" style={{ marginBottom: '3rem' }}>
                    <div>
                        <h1 className="text-hero" style={{ fontSize: '2.5rem' }}>User Details</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Manage your profile and account activity.</p>
                    </div>
                </header>
                <div className="glass-panel" style={{ padding: '2.5rem' }}>
                    <div className="flex-center" style={{ height: '200px' }}>
                        <p style={{ color: 'var(--text-muted)' }}>Please log in to view your details</p>
                    </div>
                </div>
            </div>
        );
    }

    const displayUser = {
        name: user.name || 'Anonymous User',
        email: user.email || 'Not Provided',
        phone: user.phone || 'Not set',
        location: user.location || 'Not set',
        memberSince: new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
        lastLogin: new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }),
        accountStatus: 'Active',
        plan: 'Basic'
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <header className="flex-between" style={{ marginBottom: '3rem' }}>
                <div>
                    <h1 className="text-hero" style={{ fontSize: '2.5rem' }}>User Details</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Manage your profile and account activity.</p>
                </div>
                {!isEditing ? (
                    <button
                        className="btn-primary"
                        style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit2 size={18} /> Edit Profile
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className="btn-icon-soft"
                            style={{ padding: '0.6rem 1.2rem', borderRadius: '8px' }}
                            onClick={handleCancel}
                        >
                            <X size={18} style={{ marginRight: '0.3rem' }} /> Cancel
                        </button>
                        <button
                            className="btn-primary"
                            style={{ padding: '0.6rem 1.2rem', borderRadius: '8px' }}
                            onClick={handleSave}
                        >
                            <Check size={18} style={{ marginRight: '0.3rem' }} /> Save
                        </button>
                    </div>
                )}
            </header>

            {error && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    borderRadius: '0.5rem',
                    marginBottom: '1.5rem',
                    fontSize: '0.95rem',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                    {error}
                </div>
            )}

            <div className="dashboard-grid">
                <div className="col-span-8 glass-panel animate-slide-up" style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 700, boxShadow: '0 8px 24px rgba(139, 92, 246, 0.35)', flexShrink: 0 }}>
                            {displayUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                            {isEditing ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        className="input-field"
                                        style={{ padding: '0.5rem 1rem', fontSize: '1.8rem', fontWeight: 700, width: '100%' }}
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    />
                                </div>
                            ) : (
                                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{displayUser.name}</h2>
                            )}
                            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>{displayUser.plan} Member</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <DetailRow icon={<Mail />} label="Email Address" value={displayUser.email} editable={false} />
                        <DetailRow
                            icon={<Phone />}
                            label="Phone Number"
                            value={displayUser.phone}
                            editable={isEditing}
                            editValue={editData.phone}
                            onEditChange={(value) => setEditData({ ...editData, phone: value })}
                        />
                        <DetailRow
                            icon={<MapPin />}
                            label="Location"
                            value={displayUser.location}
                            editable={isEditing}
                            editValue={editData.location}
                            onEditChange={(value) => setEditData({ ...editData, location: value })}
                        />
                        <DetailRow icon={<Calendar />} label="Member Since" value={displayUser.memberSince} editable={false} />
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
                            <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>{displayUser.lastLogin}</p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-muted)' }}>
                                <Shield size={20} />
                                <span style={{ fontWeight: 500 }}>Account Status</span>
                            </div>
                            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--success)' }}>{displayUser.accountStatus}</p>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>Profile Tips</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                <User size={16} style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                                <span>Keep your profile updated for better personalization</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                <Phone size={16} style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                                <span>Add your phone number for account recovery</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                <MapPin size={16} style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                                <span>Set your location for regional insights</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailRow = ({ icon, label, value, editable, editValue, onEditChange }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            {icon}
        </div>
        <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{label}</p>
            {editable ? (
                <input
                    type="text"
                    className="input-field"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '1rem', width: '100%' }}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    value={editValue}
                    onChange={(e) => onEditChange(e.target.value)}
                />
            ) : (
                <p style={{ fontWeight: 500, color: 'var(--text-main)' }}>{value}</p>
            )}
        </div>
    </div>
);

export default UserDetails;
