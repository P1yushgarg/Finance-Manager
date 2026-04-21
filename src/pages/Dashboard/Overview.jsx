import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, IndianRupee, Edit2, Check } from 'lucide-react';
import AddTransactionForm from '../../components/forms/AddTransactionForm';
import CategoryChart from '../../components/charts/CategoryChart';
import DailySpendChart from '../../components/charts/DailySpendChart';

const Overview = () => {
    const [transactions, setTransactions] = useState([
        { id: 1, amount: 2500, category: 'Groceries', method: 'UPI', date: '02/06/2026' },
        { id: 2, amount: 1500, category: 'Dining', method: 'Card', date: '05/06/2026' },
        { id: 3, amount: 850, category: 'Entertainment', method: 'UPI', date: '10/06/2026' },
        { id: 4, amount: 3200, category: 'Shopping', method: 'Card', date: '15/06/2026' },
    ]);

    // Editable Balances States
    const [income, setIncome] = useState(80000);
    const [isEditingIncome, setIsEditingIncome] = useState(false);
    const [tempIncome, setTempIncome] = useState('');

    const [balance, setBalance] = useState(142000);
    const [isEditingBalance, setIsEditingBalance] = useState(false);
    const [tempBalance, setTempBalance] = useState('');

    const handleAddTransaction = (newTx) => {
        setTransactions(prev => [newTx, ...prev]);
        setBalance(prev => prev - newTx.amount);
    };

    const saveIncome = () => {
        if (tempIncome && !isNaN(tempIncome)) setIncome(parseFloat(tempIncome));
        setIsEditingIncome(false);
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
                <div className="col-span-4">
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
                <div className="col-span-4">
                    <StatCard
                        title="Total Spent"
                        amount={totalSpent}
                        icon={<ArrowUpRight size={32} color="var(--danger)" />}
                        isNegative
                    />
                </div>
                <div className="col-span-4">
                    <EditableStatCard
                        title="Total Income"
                        amount={income}
                        icon={<ArrowDownRight size={32} color="var(--success)" />}
                        isEditing={isEditingIncome}
                        setIsEditing={setIsEditingIncome}
                        tempValue={tempIncome}
                        setTempValue={setTempIncome}
                        saveFunc={saveIncome}
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
                                {transactions.slice(0, 7).map(tx => (
                                    <div key={tx.id} className="flex-between" style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 500, fontSize: '1rem' }}>{tx.category}</span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{tx.method} • {tx.date}</span>
                                            </div>
                                        </div>
                                        <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>-₹{tx.amount.toLocaleString()}</span>
                                    </div>
                                ))}
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
