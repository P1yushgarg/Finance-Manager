import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, Target, Wallet, Smartphone, CreditCard, Trash2, ShieldCheck, ChevronRight } from 'lucide-react';

const Alerts = () => {
    const [fetchedAlerts, setFetchedAlerts] = useState({
        monthly: null,
        daily: null,
        upi: null,
        cash: null,
        bank: null
    });

    const [inputs, setInputs] = useState({
        monthly: '',
        daily: '',
        upi: '',
        cash: '',
        bank: ''
    });

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const userObj = JSON.parse(localStorage.getItem('user'));
                if (userObj && userObj.id) {
                    const response = await fetch(`/api/alerts?userId=${userObj.id}`);
                    const data = await response.json();
                    if (response.ok && data.length > 0) {
                        const fetched = { monthly: null, daily: null, upi: null, cash: null, bank: null };
                        const initInputs = { monthly: '', daily: '', upi: '', cash: '', bank: '' };
                        
                        data.forEach(alert => {
                            if (alert.category in fetched) {
                                fetched[alert.category] = alert.thresholdAmount.toString();
                                initInputs[alert.category] = alert.thresholdAmount.toString();
                            }
                        });
                        setFetchedAlerts(fetched);
                        setInputs(initInputs);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch alerts", err);
            }
        };
        fetchAlerts();
    }, []);

    const handleSaveAlert = async (category) => {
        const amount = inputs[category];
        if (!amount) return;
        
        try {
            const userObj = JSON.parse(localStorage.getItem('user'));
            if (!userObj || !userObj.id) return;

            await fetch('/api/alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: userObj.id,
                    category: category,
                    thresholdAmount: Number(amount)
                })
            });

            setFetchedAlerts(prev => ({ ...prev, [category]: amount }));
        } catch (error) {
            console.error("Failed to save alert", error);
        }
    };

    const handleRemoveAlert = async (category) => {
        try {
            const userObj = JSON.parse(localStorage.getItem('user'));
            if (!userObj || !userObj.id) return;

            await fetch('/api/alerts', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: userObj.id, category })
            });

            setFetchedAlerts(prev => ({ ...prev, [category]: null }));
            setInputs(prev => ({ ...prev, [category]: '' }));
        } catch (error) {
            console.error("Failed to delete alert", error);
        }
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <header className="flex-between" style={{ marginBottom: '3rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.6rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '10px', color: 'var(--primary)' }}>
                            <Target size={24} />
                        </div>
                        <h1 className="text-hero" style={{ fontSize: '2.5rem' }}>Spending Limits</h1>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Configure interactive boundaries to receive pop-ups and prevent overspending.</p>
                </div>
            </header>

            <div className="dashboard-grid">
                
                {/* Information Card occupying 2 columns in a large setup or 1 row */}
                <div className="col-span-12 animate-slide-up">
                    <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '1.5rem 2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <AlertTriangle size={32} color="var(--primary)" />
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>Real-time Transaction Protection</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Any logged expenses exceeding these boundaries will immediately trigger a system warning alert.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 500 }}>
                            Configuration Active <ChevronRight size={18} />
                        </div>
                    </div>
                </div>

                <div className="col-span-12" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 600 }}>Global Constraints</h2>
                </div>

                <div className="col-span-6">
                    <AlertCard 
                        category="monthly"
                        title="Monthly Ceiling"
                        icon={<Calendar size={20} />}
                        color="var(--primary)"
                        placeholder="50,000"
                        info="Maximum overall budget permitted across all categories and methods within a single month."
                        fetchedAlerts={fetchedAlerts}
                        inputs={inputs}
                        setInputs={setInputs}
                        handleSaveAlert={handleSaveAlert}
                        handleRemoveAlert={handleRemoveAlert}
                    />
                </div>
                
                <div className="col-span-6">
                    <AlertCard 
                        category="daily"
                        title="Daily Trigger"
                        icon={<Clock size={20} />}
                        color="var(--secondary)"
                        placeholder="2,000"
                        info="Strict 24-hour limit on all transactions. Restricts impulse buying globally."
                        fetchedAlerts={fetchedAlerts}
                        inputs={inputs}
                        setInputs={setInputs}
                        handleSaveAlert={handleSaveAlert}
                        handleRemoveAlert={handleRemoveAlert}
                    />
                </div>

                <div className="col-span-12" style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 600 }}>Method Specific Caps</h2>
                </div>

                <div className="col-span-4 delay-100">
                    <AlertCard 
                        category="upi"
                        title="UPI Allowance"
                        icon={<Smartphone size={20} />}
                        color="#a855f7"
                        placeholder="10,000"
                        info="Limit spending explicitly made through Digital Wallet and UPI gateways."
                        fetchedAlerts={fetchedAlerts}
                        inputs={inputs}
                        setInputs={setInputs}
                        handleSaveAlert={handleSaveAlert}
                        handleRemoveAlert={handleRemoveAlert}
                    />
                </div>
                
                <div className="col-span-4 delay-200">
                    <AlertCard 
                        category="cash"
                        title="Cash Maximum"
                        icon={<Wallet size={20} />}
                        color="#10b981"
                        placeholder="5,000"
                        info="Hard cap on physical currency expenditures to increase digital tracking."
                        fetchedAlerts={fetchedAlerts}
                        inputs={inputs}
                        setInputs={setInputs}
                        handleSaveAlert={handleSaveAlert}
                        handleRemoveAlert={handleRemoveAlert}
                    />
                </div>

                <div className="col-span-4 delay-300">
                    <AlertCard 
                        category="bank"
                        title="Bank Transfer"
                        icon={<CreditCard size={20} />}
                        color="#3b82f6"
                        placeholder="30,000"
                        info="Limit high-transaction volume sent via RTGS, NEFT, or Direct Card."
                        fetchedAlerts={fetchedAlerts}
                        inputs={inputs}
                        setInputs={setInputs}
                        handleSaveAlert={handleSaveAlert}
                        handleRemoveAlert={handleRemoveAlert}
                    />
                </div>

            </div>
        </div>
    );
};

// Extracted AlertCard to prevent re-mounting focus drops
const AlertCard = ({ category, title, icon, color, placeholder, info, fetchedAlerts, inputs, setInputs, handleSaveAlert, handleRemoveAlert }) => {
    const isSet = fetchedAlerts[category] !== null;
    const hasChanged = inputs[category] !== fetchedAlerts[category];
    
    return (
        <div className={`glass-panel animate-slide-up ${isSet ? 'border-glow' : ''}`} style={{ padding: '2rem', borderTop: `4px solid ${color}`, position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', borderColor: isSet ? color : 'var(--border)' }}>
            {isSet && (
                <button onClick={() => handleRemoveAlert(category)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--card-bg)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', zIndex: 10 }} title="Remove Alert" onMouseOver={(e) => { e.currentTarget.style.color = 'var(--error)'; e.currentTarget.style.borderColor = 'var(--error)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                    <Trash2 size={16} />
                </button>
            )}
            
            <div style={{ color: isSet ? color : 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 600 }}>
                {icon} {title}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: isSet ? '0.5rem' : '1.5rem', minHeight: '40px' }}>{info}</p>

            {isSet && (
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.5rem 0.8rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <ShieldCheck size={16} color="var(--success)" /> 
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Active DB Limit: <strong>₹{parseFloat(fetchedAlerts[category]).toLocaleString()}</strong></span>
                </div>
            )}

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Alert Threshold (₹)</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-main)', borderRadius: '10px', border: hasChanged ? `2px solid ${color}` : '1px solid var(--border)', padding: '0 1rem', transition: 'all 0.3s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 600, marginRight: '0.5rem' }}>₹</span>
                    <input
                        type="number"
                        placeholder={placeholder}
                        value={inputs[category]}
                        onChange={(e) => setInputs(prev => ({ ...prev, [category]: e.target.value }))}
                        style={{ flex: 1, padding: '0.9rem 0', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '1.1rem', outline: 'none' }}
                        min="0"
                    />
                </div>
            </div>
            
            <button 
                onClick={() => handleSaveAlert(category)}
                className="btn-primary" 
                style={{ 
                    width: '100%', 
                    background: hasChanged ? color : (isSet ? 'rgba(255,255,255,0.05)' : color), 
                    color: hasChanged ? '#fff' : (isSet ? 'var(--text-muted)' : '#fff'),
                    border: isSet && !hasChanged ? '1px solid var(--border)' : 'none',
                    opacity: (!inputs[category] && !isSet) ? 0.3 : 1, 
                    pointerEvents: hasChanged ? 'auto' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s'
                }}
            >
                {isSet ? (hasChanged ? 'Update Threshold' : 'Saved & Active') : 'Initialize Limit'}
            </button>
        </div>
    )
};

export default Alerts;
