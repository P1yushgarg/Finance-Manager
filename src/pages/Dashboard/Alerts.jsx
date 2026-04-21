import { useState } from 'react';
import { Bell, Calendar, IndianRupee, Clock, CheckCircle, AlertTriangle, Target, Wallet, Smartphone, CreditCard, Trash2 } from 'lucide-react';

const Alerts = () => {
    const [monthlyAlert, setMonthlyAlert] = useState('50000');
    const [dailyAlert, setDailyAlert] = useState('2000');
    const [upiAlert, setUpiAlert] = useState('10000');
    const [cashAlert, setCashAlert] = useState('5000');
    const [bankAlert, setBankAlert] = useState('30000');
    const [isSaved, setIsSaved] = useState(false);

    const [activeThresholds, setActiveThresholds] = useState({
        monthly: '50000',
        daily: '2000',
        upi: '10000',
        cash: '5000',
        bank: '30000'
    });

    const handleSavePrimary = (e) => {
        e.preventDefault();
        setActiveThresholds({
            monthly: monthlyAlert,
            daily: dailyAlert,
            upi: upiAlert,
            cash: cashAlert,
            bank: bankAlert
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handleRemoveAlert = (type) => {
        setActiveThresholds(prev => ({ ...prev, [type]: '' }));
        if (type === 'monthly') setMonthlyAlert('');
        if (type === 'daily') setDailyAlert('');
        if (type === 'upi') setUpiAlert('');
        if (type === 'cash') setCashAlert('');
        if (type === 'bank') setBankAlert('');
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-hero" style={{ fontSize: '2.5rem' }}>Alert System</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Set budget thresholds to receive notifications when you overspend.</p>
                </div>
            </header>

            <div className="dashboard-grid">

                {/* Active Alerts Configuration */}
                <div className="col-span-8 animate-slide-up">
                    <form className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }} onSubmit={handleSavePrimary}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                            <div style={{ padding: '0.8rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                                <Bell size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 600 }}>Spending Thresholds</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Define your hard limits for the given timeframe.</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                            {/* Monthly Alert Limit */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="flex-between">
                                    <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={18} color="var(--primary)" />
                                        Monthly Limit
                                    </label>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>90% utilization</span>
                                </div>
                                <div className="input-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '0 0.8rem', border: '1px solid var(--border)' }}>
                                    <IndianRupee size={18} color="var(--text-muted)" />
                                    <input type="number" className="input-field input-ghost" style={{ border: 'none', background: 'transparent', flex: 1, padding: '0.6rem 0.5rem', maxWidth: 'none' }} value={monthlyAlert} onChange={(e) => setMonthlyAlert(e.target.value)} placeholder="e.g. 50000" />
                                </div>
                            </div>

                            {/* Daily Alert Limit */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="flex-between">
                                    <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={18} color="var(--secondary)" />
                                        Daily Trigger
                                    </label>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>immediate</span>
                                </div>
                                <div className="input-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '0 0.8rem', border: '1px solid var(--border)' }}>
                                    <IndianRupee size={18} color="var(--text-muted)" />
                                    <input type="number" className="input-field input-ghost" style={{ border: 'none', background: 'transparent', flex: 1, padding: '0.6rem 0.5rem', maxWidth: 'none' }} value={dailyAlert} onChange={(e) => setDailyAlert(e.target.value)} placeholder="e.g. 2000" />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Limits */}
                        <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', marginTop: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Payment Method Limits</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Set specific alerts for different payment types.</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            {/* UPI */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Smartphone size={16} color="#a855f7" /> UPI Limit
                                </label>
                                <div className="input-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '0 0.8rem', border: '1px solid var(--border)' }}>
                                    <IndianRupee size={16} color="var(--text-muted)" />
                                    <input type="number" className="input-field input-ghost" style={{ border: 'none', background: 'transparent', flex: 1, padding: '0.6rem 0.5rem', maxWidth: 'none' }} value={upiAlert} onChange={(e) => setUpiAlert(e.target.value)} />
                                </div>
                            </div>
                            {/* Cash */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Wallet size={16} color="#10b981" /> Cash Limit
                                </label>
                                <div className="input-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '0 0.8rem', border: '1px solid var(--border)' }}>
                                    <IndianRupee size={16} color="var(--text-muted)" />
                                    <input type="number" className="input-field input-ghost" style={{ border: 'none', background: 'transparent', flex: 1, padding: '0.6rem 0.5rem', maxWidth: 'none' }} value={cashAlert} onChange={(e) => setCashAlert(e.target.value)} />
                                </div>
                            </div>
                            {/* Bank */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CreditCard size={16} color="#3b82f6" /> Bank Transfer
                                </label>
                                <div className="input-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '0 0.8rem', border: '1px solid var(--border)' }}>
                                    <IndianRupee size={16} color="var(--text-muted)" />
                                    <input type="number" className="input-field input-ghost" style={{ border: 'none', background: 'transparent', flex: 1, padding: '0.6rem 0.5rem', maxWidth: 'none' }} value={bankAlert} onChange={(e) => setBankAlert(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {isSaved ? <><CheckCircle size={18} /> Saved Successfully</> : 'Save Thresholds'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Panel Only */}
                <div className="col-span-4 animate-slide-up delay-200">
                    <div className="glass-panel" style={{ padding: '2rem', height: '100%' }}>
                        <div style={{ display: 'inline-flex', padding: '0.8rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', color: 'var(--secondary)', marginBottom: '1.5rem' }}>
                            <AlertTriangle size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem' }}>How Alerts Work</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                            We automatically monitor your transactions in real-time. If an expense pushes your total over the configured limit, finXmanager will immediately notify you via email and push notification.
                        </p>

                        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                <strong>Tip:</strong> Setting a strict daily limit helps curb impulse purchasing habits effectively over time.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Active Alerts Row (Cards at the bottom) */}
                <div className="col-span-12 animate-slide-up delay-300" style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.6rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', color: 'var(--success)' }}>
                            <Target size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Active Thresholds</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {/* Monthly Card */}
                        <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--primary)', position: 'relative' }}>
                            <button onClick={() => handleRemoveAlert('monthly')} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} title="Remove Alert" onMouseOver={(e) => e.currentTarget.style.color = 'var(--error)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}><Trash2 size={20} /></button>
                            <div style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Calendar size={18} /> Monthly Limit</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 700 }}>{activeThresholds.monthly ? `₹ ${parseFloat(activeThresholds.monthly).toLocaleString()}` : <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 400 }}>Not Set</span>}</div>
                        </div>
                        {/* Daily Card */}
                        <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--secondary)', position: 'relative' }}>
                            <button onClick={() => handleRemoveAlert('daily')} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} title="Remove Alert" onMouseOver={(e) => e.currentTarget.style.color = 'var(--error)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}><Trash2 size={20} /></button>
                            <div style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Clock size={18} /> Daily Trigger</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 700 }}>{activeThresholds.daily ? `₹ ${parseFloat(activeThresholds.daily).toLocaleString()}` : <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 400 }}>Not Set</span>}</div>
                        </div>
                        {/* UPI Card */}
                        <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #a855f7', position: 'relative' }}>
                            <button onClick={() => handleRemoveAlert('upi')} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} title="Remove Alert" onMouseOver={(e) => e.currentTarget.style.color = 'var(--error)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}><Trash2 size={20} /></button>
                            <div style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Smartphone size={18} /> UPI Limit</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 700 }}>{activeThresholds.upi ? `₹ ${parseFloat(activeThresholds.upi).toLocaleString()}` : <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 400 }}>Not Set</span>}</div>
                        </div>
                        {/* Cash Card */}
                        <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #10b981', position: 'relative' }}>
                            <button onClick={() => handleRemoveAlert('cash')} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} title="Remove Alert" onMouseOver={(e) => e.currentTarget.style.color = 'var(--error)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}><Trash2 size={20} /></button>
                            <div style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Wallet size={18} /> Cash Limit</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 700 }}>{activeThresholds.cash ? `₹ ${parseFloat(activeThresholds.cash).toLocaleString()}` : <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 400 }}>Not Set</span>}</div>
                        </div>
                        {/* Bank Card */}
                        <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #3b82f6', position: 'relative' }}>
                            <button onClick={() => handleRemoveAlert('bank')} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} title="Remove Alert" onMouseOver={(e) => e.currentTarget.style.color = 'var(--error)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}><Trash2 size={20} /></button>
                            <div style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><CreditCard size={18} /> Bank Transfer</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 700 }}>{activeThresholds.bank ? `₹ ${parseFloat(activeThresholds.bank).toLocaleString()}` : <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 400 }}>Not Set</span>}</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Alerts;
