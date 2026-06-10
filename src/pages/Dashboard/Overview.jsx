import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDownRight, IndianRupee, Edit2, Check, Trash2, X, AlertCircle, Paperclip, Camera } from 'lucide-react';
import AddTransactionForm from '../../components/forms/AddTransactionForm';
import CategoryChart from '../../components/charts/CategoryChart';
import DailySpendChart from '../../components/charts/DailySpendChart';
import PaymentMethodChart from '../../components/charts/PaymentMethodChart';
import WeeklyActivityChart from '../../components/charts/WeeklyActivityChart';

const Overview = () => {
    const [transactions, setTransactions] = useState([]);
    const [alerts, setAlerts] = useState({});

    // Load income from MongoDB per user (defaults to 0 for new users)
    const [income, setIncome] = useState(0);
    const [isEditingIncome, setIsEditingIncome] = useState(false);
    const [tempIncome, setTempIncome] = useState('');

    const [editingTxId, setEditingTxId] = useState(null);
    const [editTxData, setEditTxData] = useState({});
    const [selectedChart, setSelectedChart] = useState('daily');
    const [viewingBillImage, setViewingBillImage] = useState(null);
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);
    const [fabScannedFile, setFabScannedFile] = useState(null);
    const [autoStartCamera, setAutoStartCamera] = useState(false);
    const fabCameraInputRef = useRef(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const userObj = JSON.parse(localStorage.getItem('user'));
                if (userObj && userObj.id) {
                    // Set income from localStorage first (from login response)
                    if (userObj.totalIncome !== undefined) {
                        setIncome(userObj.totalIncome);
                    }

                    const [txRes, alertsRes, userRes] = await Promise.all([
                        fetch(`/api/transactions?userId=${userObj.id}`),
                        fetch(`/api/alerts?userId=${userObj.id}`),
                        fetch(`/api/auth/user/${userObj.id}`)
                    ]);

                    if (txRes.ok) {
                        const txData = await txRes.json();
                        setTransactions(txData);
                    }
                    if (alertsRes.ok) {
                        const alertsData = await alertsRes.json();
                        const activeAlerts = {};
                        alertsData.forEach(alert => {
                            activeAlerts[alert.category] = alert.thresholdAmount;
                        });
                        setAlerts(activeAlerts);
                    }
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        setIncome(userData.totalIncome || 0);
                        // Update localStorage with latest data
                        localStorage.setItem('user', JSON.stringify({
                            ...userObj,
                            totalIncome: userData.totalIncome || 0
                        }));
                    }
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };
        fetchAllData();
    }, []);

    const handleAddTransaction = async (newTx) => {
        try {
            const userObj = JSON.parse(localStorage.getItem('user'));
            if (!userObj || !userObj.id) return;

            const txPayload = {
                user: userObj.id,
                recipient: newTx.recipient,
                amount: newTx.amount,
                category: newTx.category,
                method: newTx.method,
                billImage: newTx.billImage || ''
            };

            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(txPayload)
            });
            const data = await response.json();
            
            if (response.ok) {
                const newAllTx = [data, ...transactions];
                setTransactions(newAllTx);
                // income itself doesn't change when a transaction is added

                const methodKey = data.method.toLowerCase();
                const newTotalSpent = newAllTx.reduce((a, b) => a + b.amount, 0);
                const todayStr = new Date().toLocaleDateString();
                const dailyTotal = newAllTx.filter(t => new Date(t.date).toLocaleDateString() === todayStr).reduce((a, b) => a + b.amount, 0);
                const currentMethodTotal = newAllTx.filter(t => t.method.toLowerCase() === methodKey).reduce((a, b) => a + b.amount, 0);

                let messages = [];
                if (alerts.monthly !== undefined && newTotalSpent > Number(alerts.monthly)) {
                    messages.push(`Monthly Overspend: Total is ₹${newTotalSpent} (Limit: ₹${alerts.monthly})`);
                }
                if (alerts.daily !== undefined && dailyTotal > Number(alerts.daily)) {
                    messages.push(`Daily Overspend: Today's total is ₹${dailyTotal} (Limit: ₹${alerts.daily})`);
                }
                if (alerts[methodKey] !== undefined && ['upi', 'cash', 'bank'].includes(methodKey)) {
                    if (currentMethodTotal > Number(alerts[methodKey])) {
                        messages.push(`${data.method} Overspend: Total is ₹${currentMethodTotal} (Limit: ₹${alerts[methodKey]})`);
                    }
                }
                if (messages.length > 0) {
                    window.alert("⚠️ ALERT LIMITS EXCEEDED ⚠️\n\n" + messages.join('\n'));
                }
            }
        } catch (err) {
            console.error("Failed to add transaction", err);
        }
    };

    const handleDeleteTx = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        try {
            const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setTransactions(prev => prev.filter(tx => tx._id !== id));
                // income is unchanged when a transaction is deleted
            } else {
                window.alert("Failed to delete transaction securely.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveEditTx = async (id) => {
        try {
            const res = await fetch(`/api/transactions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editTxData)
            });
            const updatedTx = await res.json();
            if (res.ok) {
                setTransactions(prev => prev.map(tx => tx._id === id ? updatedTx : tx));
                setEditingTxId(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const saveIncome = async () => {
        const val = parseFloat(tempIncome);
        if (!isNaN(val) && val >= 0) {
            try {
                const userObj = JSON.parse(localStorage.getItem('user'));
                if (!userObj || !userObj.id) return;

                const response = await fetch(`/api/auth/user/${userObj.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ totalIncome: val })
                });

                if (response.ok) {
                    setIncome(val);
                } else {
                    console.error('Failed to save income to database');
                }
            } catch (err) {
                console.error('Failed to save income', err);
            }
        }
        setIsEditingIncome(false);
    };

    const handleFabFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAutoStartCamera(false);
            setFabScannedFile(file);
            setIsScanModalOpen(true);
        }
        e.target.value = '';
    };

    const handleFabCameraClick = () => {
        const isSecure = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        if (isSecure) {
            setAutoStartCamera(true);
            setIsScanModalOpen(true);
        } else {
            if (fabCameraInputRef.current) {
                fabCameraInputRef.current.click();
            }
        }
    };

    const closeScanModal = () => {
        setIsScanModalOpen(false);
        setFabScannedFile(null);
        setAutoStartCamera(false);
    };

    const totalSpent = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const netBalance = income - totalSpent;
    const isOverspent = netBalance < 0;

    return (
        <div className="animate-fade-in">
            <header className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="text-display">Overview</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.3rem' }}>Here's your comprehensive financial overview</p>
                </div>
            </header>

            {/* Income = 0 banner: prompt user to set income */}
            {income === 0 && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.5rem', marginBottom: '2rem',
                    borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                }}>
                    <AlertCircle size={22} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <p style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                        Your income is not set yet. Click the <strong>✏️ edit</strong> button on the <strong>Total Income</strong> card to add your income.
                    </p>
                </div>
            )}

            {/* TOP ROW: Large Stat Cards */}
            <div className="overview-stats-grid animate-slide-up">
                <div className="stat-card-income">
                    <EditableStatCard
                        title="Total Income"
                        amount={income}
                        icon={<IndianRupee size={32} color="var(--primary)" />}
                        isEditing={isEditingIncome}
                        setIsEditing={setIsEditingIncome}
                        tempValue={tempIncome}
                        setTempValue={setTempIncome}
                        saveFunc={saveIncome}
                    />
                </div>
                <div className="stat-card-spent">
                    <StatCard
                        title="Total Spent"
                        amount={totalSpent}
                        icon={<ArrowUpRight size={32} color="var(--danger)" />}
                        isNegative
                    />
                </div>
                <div className="stat-card-balance">
                    <NetBalanceCard
                        netBalance={netBalance}
                        isOverspent={isOverspent}
                    />
                </div>
            </div>


            {/* MIDDLE ROW: Visual Analytics */}
            <div className="flex-between" style={{ marginBottom: '1.2rem', marginTop: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-main)' }}>Analytics</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Select Chart:</span>
                    <select
                        className="input-field"
                        style={{
                            width: '200px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '0.5rem 1rem',
                            color: 'var(--text-main)',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                        value={selectedChart}
                        onChange={e => setSelectedChart(e.target.value)}
                    >
                        <option value="daily" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Daily Spend</option>
                        <option value="category" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Category Spend</option>
                        <option value="method" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Payment Method</option>
                        <option value="weekly" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Weekly Activity</option>
                    </select>
                </div>
            </div>

            <div className="dashboard-grid" style={{ marginBottom: '1.5rem', alignItems: 'stretch' }}>
                {selectedChart === 'daily' && (
                    <div className="col-span-12">
                        <DailySpendChart data={transactions} />
                    </div>
                )}
                {selectedChart === 'category' && (
                    <div className="col-span-12">
                        <CategoryChart data={transactions} />
                    </div>
                )}
                {selectedChart === 'method' && (
                    <div className="col-span-12">
                        <PaymentMethodChart data={transactions} />
                    </div>
                )}
                {selectedChart === 'weekly' && (
                    <div className="col-span-12">
                        <WeeklyActivityChart data={transactions} />
                    </div>
                )}
            </div>

            {/* BOTTOM ROW: Transactions & Management */}
            <div className="dashboard-grid">
                <div className="col-span-4 animate-slide-up delay-200">
                    <AddTransactionForm onAdd={handleAddTransaction} />
                </div>

                <div className="col-span-8 animate-slide-up delay-300">
                    <div className="glass-panel" style={{ padding: '2.5rem', height: '100%' }}>
                        <div className="flex-between" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 600 }}>Recent Transactions</h3>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{transactions.length} Records</span>
                        </div>

                        {transactions.length === 0 ? (
                            <div className="flex-center" style={{ height: '200px', width: '100%', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                                <p style={{ color: 'var(--text-muted)' }}>No transactions logged yet.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                {transactions.slice(0, 7).map(tx => {
                                    const isEditing = editingTxId === tx._id;

                                    if (isEditing) {
                                        return (
                                            <div key={tx._id} style={{ padding: '1rem', border: '1px solid var(--primary)', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.05)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    <input type="text" className="input-field" style={{ flex: 1, minWidth: '120px', padding: '0.6rem' }} placeholder="Recipient" value={editTxData.recipient} onChange={e => setEditTxData({...editTxData, recipient: e.target.value})} />
                                                    <select className="input-field" style={{ flex: 1, minWidth: '120px', padding: '0.6rem' }} value={editTxData.category} onChange={e => setEditTxData({...editTxData, category: e.target.value})}>
                                                        {(() => {
                                                            const baseCategories = ['Groceries', 'Food & Dining', 'Rent & Housing', 'Bills & Utilities', 'Transportation', 'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Travel', 'Others'];
                                                            const uniqueCategories = baseCategories.includes(editTxData.category)
                                                                ? baseCategories
                                                                : [editTxData.category, ...baseCategories];
                                                            return uniqueCategories.map(c => <option key={c} value={c}>{c}</option>);
                                                        })()}
                                                    </select>

                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    <select className="input-field" style={{ flex: 1, minWidth: '120px', padding: '0.6rem' }} value={editTxData.method} onChange={e => setEditTxData({...editTxData, method: e.target.value})}>
                                                        {['UPI', 'Cash', 'Bank'].map(m => <option key={m} value={m}>{m}</option>)}
                                                    </select>
                                                    <input type="number" className="input-field" style={{ flex: 1, minWidth: '100px', padding: '0.6rem' }} placeholder="Amount" value={editTxData.amount} onChange={e => setEditTxData({...editTxData, amount: Number(e.target.value)})} />
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                                    <button className="btn-icon-soft" style={{ padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto', height: 'auto' }} onClick={() => setEditingTxId(null)}>
                                                        <X size={16} /> Cancel
                                                    </button>
                                                    <button className="btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => handleSaveEditTx(tx._id)}>
                                                        <Check size={16} /> Save
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={tx._id} className="flex-between" style={{ padding: '0.8rem 0.5rem', borderBottom: '1px solid var(--border)', transition: 'background 0.2s', borderRadius: '8px' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontWeight: 500, fontSize: '1.05rem', color: 'var(--text-main)' }}>{tx.recipient || tx.category}</span>
                                                        {tx.billImage && (
                                                            <button 
                                                                onClick={() => setViewingBillImage(tx.billImage)}
                                                                style={{ background: 'rgba(249, 115, 22, 0.08)', border: '1px solid rgba(249, 115, 22, 0.2)', color: 'var(--primary)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', transition: 'all 0.2s' }}
                                                                title="View Receipt"
                                                                onMouseOver={e => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.15)'; }}
                                                                onMouseOut={e => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.08)'; }}
                                                            >
                                                                <Paperclip size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{tx.category} • {tx.method} • {new Date(tx.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                                <span style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>-₹{tx.amount.toLocaleString()}</span>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => { setEditingTxId(tx._id); setEditTxData(tx); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'} title="Edit Transaction">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteTx(tx._id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--error)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'} title="Delete Transaction">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Receipt Viewer Modal */}
            {viewingBillImage && (
                <div 
                    className="flex-center animate-fade-in" 
                    style={{ 
                        position: 'fixed', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        background: 'rgba(0,0,0,0.7)', 
                        zIndex: 9999, 
                        backdropFilter: 'blur(8px)',
                        padding: '1.5rem'
                    }}
                    onClick={() => setViewingBillImage(null)}
                >
                    <div 
                        className="glass-panel animate-slide-up" 
                        style={{ 
                            maxWidth: '500px', 
                            width: '100%', 
                            padding: '1.5rem', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '1rem',
                            position: 'relative' 
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Attached Receipt</h3>
                            <button 
                                className="btn-icon-soft" 
                                onClick={() => setViewingBillImage(null)}
                                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', background: '#000', borderRadius: '12px', overflow: 'hidden', maxHeight: '400px', border: '1px solid var(--border)' }}>
                            <img 
                                src={viewingBillImage} 
                                alt="Scanned Bill" 
                                style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '400px' }} 
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden Input for direct camera capture under user gesture context */}
            <input 
                type="file" 
                ref={fabCameraInputRef} 
                onChange={handleFabFileChange} 
                accept="image/*" 
                capture="environment" 
                style={{ display: 'none' }} 
            />

            {/* Floating Camera Scan FAB Button */}
            <button 
                onClick={handleFabCameraClick}
                style={{ 
                    position: 'fixed', 
                    bottom: '5.5rem', 
                    right: '1.5rem', 
                    background: 'linear-gradient(135deg, var(--primary) 0%, #ec4899 100%)', 
                    color: '#fff', 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4), 0 0 0 1px rgba(255,255,255,0.1)', 
                    border: 'none',
                    cursor: 'pointer', 
                    zIndex: 999, 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                }}
                title="Scan Receipt & Add Expense"
                className="fab-camera-button animate-slide-up"
                onMouseOver={e => {
                    e.currentTarget.style.transform = 'scale(1.1) translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(249, 115, 22, 0.5), 0 0 0 2px rgba(255,255,255,0.2)';
                }}
                onMouseOut={e => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(249, 115, 22, 0.4), 0 0 0 1px rgba(255,255,255,0.1)';
                }}
            >
                <Camera size={26} />
            </button>

            {/* Add Transaction Modal Overlay */}
            {isScanModalOpen && (
                <div 
                    className="flex-center animate-fade-in" 
                    style={{ 
                        position: 'fixed', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        background: 'rgba(0,0,0,0.7)', 
                        zIndex: 1000, 
                        backdropFilter: 'blur(8px)',
                        padding: '1.5rem'
                    }}
                    onClick={closeScanModal}
                >
                    <div 
                        className="animate-slide-up" 
                        style={{ 
                            maxWidth: '480px', 
                            width: '100%', 
                            zIndex: 1001 
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <AddTransactionForm 
                            onAdd={(newTx) => {
                                handleAddTransaction(newTx);
                                closeScanModal();
                            }} 
                            isModal={true} 
                            onClose={closeScanModal} 
                            initialFile={fabScannedFile} 
                            autoStartCamera={autoStartCamera} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

/* Components internal to Dashboard */

const StatCard = ({ title, amount, icon, isNegative }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '0.5rem', height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: isNegative ? 'var(--danger)' : 'var(--success)' }}>
            {icon}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{title}</span>
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.5rem', color: isNegative ? 'var(--danger)' : 'var(--text-main)' }}>-₹{amount.toLocaleString()}</h3>
    </div>
);

const NetBalanceCard = ({ netBalance, isOverspent }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '0.5rem', height: '100%', border: isOverspent ? '1px solid rgba(239,68,68,0.35)' : '1px solid rgba(16,185,129,0.25)', transition: 'border 0.3s' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: isOverspent ? 'var(--danger)' : 'var(--success)' }}>
            {isOverspent
                ? <ArrowDownRight size={32} color="var(--danger)" />
                : <ArrowUpRight size={32} color="var(--success)" />}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Net Balance</span>
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.5rem', color: isOverspent ? 'var(--danger)' : 'var(--success)' }}>
            {isOverspent ? `-₹${Math.abs(netBalance).toLocaleString()}` : `₹${netBalance.toLocaleString()}`}
        </h3>
        {isOverspent && (
            <span style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '0.2rem', fontWeight: 500 }}>⚠️ Expenses exceed income</span>
        )}
    </div>
);

const EditableStatCard = ({ title, amount, icon, isEditing, setIsEditing, tempValue, setTempValue, saveFunc }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '0.5rem', height: '100%', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', width: '100%' }}>
            {icon}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{title}</span>
            {!isEditing ? (
                <button className="btn-icon-soft" style={{ width: '24px', height: '24px', position: 'absolute', top: '1rem', right: '1rem' }} onClick={() => { setIsEditing(true); setTempValue(amount); }} title="Edit">
                    <Edit2 size={14} />
                </button>
            ) : (
                <button className="btn-icon-soft" style={{ width: '24px', height: '24px', background: 'var(--primary)', color: 'white', position: 'absolute', top: '1rem', right: '1rem' }} onClick={saveFunc} title="Save">
                    <Check size={14} />
                </button>
            )}
        </div>

        {isEditing ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', marginTop: '0.5rem', width: '100%' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>₹</span>
                <input
                    type="number"
                    className="input-field input-ghost"
                    style={{ fontSize: '1.5rem', fontWeight: 600, padding: 0, textAlign: 'center' }}
                    value={tempValue}
                    onChange={e => setTempValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveFunc()}
                    autoFocus
                />
            </div>
        ) : (
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.5rem' }}>₹{amount.toLocaleString()}</h3>
        )}
    </div>
);

export default Overview;
