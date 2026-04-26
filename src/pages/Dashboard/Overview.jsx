import { useState, useEffect } from 'react';
import { ArrowUpRight, IndianRupee, Edit2, Check, Trash2, X } from 'lucide-react';
import AddTransactionForm from '../../components/forms/AddTransactionForm';
import CategoryChart from '../../components/charts/CategoryChart';
import DailySpendChart from '../../components/charts/DailySpendChart';

const Overview = () => {
    const [transactions, setTransactions] = useState([]);
    const [alerts, setAlerts] = useState({});

    const [balance, setBalance] = useState(142000);
    const [isEditingBalance, setIsEditingBalance] = useState(false);
    const [tempBalance, setTempBalance] = useState('');

    const [editingTxId, setEditingTxId] = useState(null);
    const [editTxData, setEditTxData] = useState({});

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const userObj = JSON.parse(localStorage.getItem('user'));
                if (userObj && userObj.id) {
                    const [txRes, alertsRes] = await Promise.all([
                        fetch(`/api/transactions?userId=${userObj.id}`),
                        fetch(`/api/alerts?userId=${userObj.id}`)
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
                method: newTx.method
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
                setBalance(prev => prev - data.amount);

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
                if (alerts[methodKey] !== undefined && ['upi', 'cash', 'bank', 'card'].includes(methodKey)) {
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

    const handleDeleteTx = async (id, amount) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        try {
            const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setTransactions(prev => prev.filter(tx => tx._id !== id));
                setBalance(prev => prev + amount); // Restoring balance from deleted transaction
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
                const oldTx = transactions.find(t => t._id === id);
                setBalance(prev => prev + oldTx.amount - updatedTx.amount); // Adjust balance diff
                setTransactions(prev => prev.map(tx => tx._id === id ? updatedTx : tx));
                setEditingTxId(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const saveBalance = () => {
        if (tempBalance && !isNaN(tempBalance)) setBalance(parseFloat(tempBalance));
        setIsEditingBalance(false);
    };

    const totalSpent = transactions.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="animate-fade-in">
            <header className="flex-between" style={{ marginBottom: '3rem' }}>
                <div>
                    <h1 className="text-hero" style={{ fontSize: '2.5rem' }}>Overview</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Here's your comprehensive financial overview</p>
                </div>
            </header>

            {/* TOP ROW: Large Stat Cards */}
            <div className="dashboard-grid animate-slide-up" style={{ marginBottom: '3rem' }}>
                <div className="col-span-6">
                    <EditableStatCard
                        title="Total Balance"
                        amount={balance}
                        icon={<IndianRupee size={32} color="var(--primary)" />}
                        isEditing={isEditingBalance}
                        setIsEditing={setIsEditingBalance}
                        tempValue={tempBalance}
                        setTempValue={setTempBalance}
                        saveFunc={saveBalance}
                    />
                </div>
                <div className="col-span-6">
                    <StatCard
                        title="Total Spent"
                        amount={totalSpent}
                        icon={<ArrowUpRight size={32} color="var(--danger)" />}
                        isNegative
                    />
                </div>
            </div>

            {/* MIDDLE ROW: Visual Analytics */}
            <div className="dashboard-grid" style={{ marginBottom: '3rem', alignItems: 'stretch' }}>
                <div className="col-span-8">
                    <DailySpendChart data={transactions} />
                </div>
                <div className="col-span-4">
                    <CategoryChart data={transactions} />
                </div>
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
                                                        {['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Groceries', 'Healthcare', 'Others'].map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    <select className="input-field" style={{ flex: 1, minWidth: '120px', padding: '0.6rem' }} value={editTxData.method} onChange={e => setEditTxData({...editTxData, method: e.target.value})}>
                                                        {['UPI', 'Card', 'Cash', 'Bank'].map(m => <option key={m} value={m}>{m}</option>)}
                                                    </select>
                                                    <input type="number" className="input-field" style={{ flex: 1, minWidth: '100px', padding: '0.6rem' }} placeholder="Amount" value={editTxData.amount} onChange={e => setEditTxData({...editTxData, amount: Number(e.target.value)})} />
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                                    <button className="btn-icon-soft" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }} onClick={() => setEditingTxId(null)}>
                                                        <X size={16} style={{ marginRight: '0.3rem' }} /> Cancel
                                                    </button>
                                                    <button className="btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }} onClick={() => handleSaveEditTx(tx._id)}>
                                                        <Check size={16} style={{ marginRight: '0.3rem' }} /> Save
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={tx._id} className="flex-between" style={{ padding: '0.8rem 0.5rem', borderBottom: '1px solid var(--border)', transition: 'background 0.2s', borderRadius: '8px' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: 500, fontSize: '1.05rem', color: 'var(--text-main)' }}>{tx.recipient || tx.category}</span>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{tx.category} • {tx.method} • {new Date(tx.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                                <span style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>-₹{tx.amount.toLocaleString()}</span>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => { setEditingTxId(tx._id); setEditTxData(tx); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'} title="Edit Transaction">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteTx(tx._id, tx.amount)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--error)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'} title="Delete Transaction">
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
        </div>
    );
};

/* Components internal to Dashboard */

const StatCard = ({ title, amount, icon, isNegative }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isNegative ? 'var(--danger)' : 'var(--success)' }}>
            {icon}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{title}</span>
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.5rem' }}>₹{amount.toLocaleString()}</h3>
    </div>
);

const EditableStatCard = ({ title, amount, icon, isEditing, setIsEditing, tempValue, setTempValue, saveFunc }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', width: '100%' }}>
            {icon}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, flex: 1 }}>{title}</span>
            {!isEditing ? (
                <button className="btn-icon-soft" style={{ width: '24px', height: '24px' }} onClick={() => { setIsEditing(true); setTempValue(amount); }} title="Edit">
                    <Edit2 size={14} />
                </button>
            ) : (
                <button className="btn-icon-soft" style={{ width: '24px', height: '24px', background: 'var(--primary)', color: 'white' }} onClick={saveFunc} title="Save">
                    <Check size={14} />
                </button>
            )}
        </div>

        {isEditing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>₹</span>
                <input
                    type="number"
                    className="input-field input-ghost"
                    style={{ fontSize: '1.5rem', fontWeight: 600, padding: 0 }}
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
