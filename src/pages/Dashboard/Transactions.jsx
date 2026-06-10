import { useState, useEffect } from 'react';
import { Search, Filter, IndianRupee, CreditCard, Banknote, Smartphone, Paperclip, X } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMethod, setFilterMethod] = useState('All');
    const [viewingBillImage, setViewingBillImage] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const userObj = JSON.parse(localStorage.getItem('user'));
                if (userObj && userObj.id) {
                    const response = await fetch(`/api/transactions?userId=${userObj.id}`);
                    const data = await response.json();
                    if (response.ok) {
                        setTransactions(data);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch transactions", err);
            }
        };
        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter(tx => {
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
                <div className="input-group" style={{ flex: 1, minWidth: '300px', flexDirection: 'row', alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '0 1rem' }}>
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

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.04)', padding: '0.5rem', borderRadius: '12px' }}>
                    <Filter size={18} color="var(--text-muted)" style={{ margin: '0 0.5rem' }} />
                    {['All', 'UPI', 'Cash', 'Bank'].map(method => (
                        <button
                            key={method}
                            className={`btn-icon-soft ${filterMethod === method ? 'btn-primary' : ''}`}
                            style={{ width: 'auto', height: 'auto', padding: '0.4rem 1rem', borderRadius: '8px', ...(filterMethod === method ? { background: 'var(--primary)', color: 'white' } : {}) }}
                            onClick={() => setFilterMethod(method)}
                        >
                            {method}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transactions Table for Desktop */}
            <div className="glass-panel hidden-mobile" style={{ padding: '0', overflow: 'hidden' }}>
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
                            <tr key={tx._id} style={{ borderBottom: idx === filteredTransactions.length - 1 ? 'none' : '1px solid var(--border)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                <td style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{tx._id.substring(tx._id.length - 6).toUpperCase()}</td>
                                <td style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {tx.recipient.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <div style={{ fontWeight: 600 }}>{tx.recipient}</div>
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
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{tx.category}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{new Date(tx.date).toLocaleDateString()}</td>
                                <td style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem', fontWeight: 500 }}>
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

            {/* Transactions Card List for Mobile */}
            <div className="hidden-desktop" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                        <div key={tx._id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <div className="flex-between">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                        {tx.recipient.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{tx.recipient}</div>
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
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tx.category}</div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                                    -₹{tx.amount.toLocaleString()}
                                </div>
                            </div>
                            <div className="flex-between" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.8rem', fontSize: '0.8rem' }}>
                                <div style={{ color: 'var(--text-muted)' }}>
                                    {new Date(tx.date).toLocaleDateString()}
                                </div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', fontWeight: 500, fontSize: '0.75rem' }}>
                                    {getMethodIcon(tx.method)}
                                    {tx.method}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="glass-panel flex-center" style={{ padding: '3rem', color: 'var(--text-muted)' }}>
                        No transactions logged yet.
                    </div>
                )}
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
        </div>
    );
};

export default Transactions;
