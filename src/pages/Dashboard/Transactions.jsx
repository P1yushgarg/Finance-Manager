import { useState } from 'react';
import { Search, Filter, ArrowDownRight, IndianRupee, CreditCard, Banknote, Smartphone } from 'lucide-react';

const mockTransactions = [
    { id: 'TXN-001', recipient: 'Amazon India', category: 'Shopping', method: 'UPI', date: '06/03/2026', amount: 3200, status: 'Completed' },
    { id: 'TXN-002', recipient: 'Reliance Smart', category: 'Groceries', method: 'Card', date: '04/03/2026', amount: 4500, status: 'Completed' },
    { id: 'TXN-003', recipient: 'Netflix', category: 'Entertainment', method: 'Bank', date: '01/03/2026', amount: 649, status: 'Completed' },
    { id: 'TXN-004', recipient: 'Local Vendor', category: 'Food & Dining', method: 'Cash', date: '28/02/2026', amount: 350, status: 'Completed' },
    { id: 'TXN-005', recipient: 'Jio Broadband', category: 'Utilities', method: 'UPI', date: '25/02/2026', amount: 899, status: 'Completed' },
    { id: 'TXN-006', recipient: 'Uber Rides', category: 'Transport', method: 'UPI', date: '24/02/2026', amount: 450, status: 'Completed' },
    { id: 'TXN-007', recipient: 'House Rent', category: 'Housing', method: 'Bank', date: '01/02/2026', amount: 25000, status: 'Completed' },
    { id: 'TXN-008', recipient: 'Zomato', category: 'Food & Dining', method: 'UPI', date: '30/01/2026', amount: 650, status: 'Completed' },
];

const Transactions = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMethod, setFilterMethod] = useState('All');

    const filteredTransactions = mockTransactions.filter(tx => {
        const matchesSearch = tx.recipient.toLowerCase().includes(searchTerm.toLowerCase()) || tx.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMethod = filterMethod === 'All' || tx.method === filterMethod;
        return matchesSearch && matchesMethod;
    });

    const getMethodIcon = (method) => {
        switch (method) {
            case 'UPI': return <Smartphone size={16} color="var(--primary)" />;
            case 'Cash': return <Banknote size={16} color="var(--success)" />;
            case 'Bank': return <CreditCard size={16} color="var(--secondary)" />;
            default: return <CreditCard size={16} />;
        }
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-hero" style={{ fontSize: '2.5rem' }}>Transactions</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>A detailed log of all your payments and transfers.</p>
                </div>
            </header>

            {/* Filtering and Search Controls */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="input-group" style={{ flex: 1, minWidth: '300px', flexDirection: 'row', alignItems: 'center', background: 'rgba(0,0,0,0.03)', borderRadius: '12px', padding: '0 1rem' }}>
                    <Search size={20} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search by recipient or category..."
                        className="input-field input-ghost"
                        style={{ border: 'none', background: 'transparent' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(0,0,0,0.03)', padding: '0.5rem', borderRadius: '12px' }}>
                    <Filter size={18} color="var(--text-muted)" style={{ margin: '0 0.5rem' }} />
                    {['All', 'UPI', 'Bank', 'Cash', 'Card'].map(method => (
                        <button
                            key={method}
                            className={`btn-icon-soft ${filterMethod === method ? 'btn-primary' : ''}`}
                            style={filterMethod === method ? { background: 'var(--primary)', color: 'white' } : {}}
                            onClick={() => setFilterMethod(method)}
                        >
                            {method}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transactions Table */}
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Transaction ID</th>
                            <th style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Paid To</th>
                            <th style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
                            <th style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Method</th>
                            <th style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length > 0 ? filteredTransactions.map((tx, idx) => (
                            <tr key={tx.id} style={{ borderBottom: idx === filteredTransactions.length - 1 ? 'none' : '1px solid var(--border)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                <td style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{tx.id}</td>
                                <td style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {tx.recipient.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{tx.recipient}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{tx.category}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{tx.date}</td>
                                <td style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: '20px', background: 'rgba(0,0,0,0.05)', fontSize: '0.85rem', fontWeight: 500 }}>
                                        {getMethodIcon(tx.method)}
                                        {tx.method}
                                    </div>
                                </td>
                                <td style={{ padding: '1.5rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-main)' }}>
                                    -₹{tx.amount.toLocaleString()}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No transactions found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;
