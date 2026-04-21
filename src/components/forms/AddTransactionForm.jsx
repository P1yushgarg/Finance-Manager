import { useState } from 'react';
import { PlusCircle, CreditCard, Banknote } from 'lucide-react';

const AddTransactionForm = ({ onAdd }) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Groceries');
    const [method, setMethod] = useState('UPI');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount) return;

        onAdd({
            id: Date.now(),
            amount: parseFloat(amount),
            category,
            method,
            date: new Date().toLocaleDateString()
        });

        setAmount('');
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PlusCircle size={20} color="var(--primary)" /> Add New Expense
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Amount (₹)</label>
                    <input
                        type="number"
                        className="input-field"
                        placeholder="e.g. 500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="1"
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Category</label>
                    <select
                        className="input-field"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="Groceries">Groceries</option>
                        <option value="Dining">Dining</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Others">Others</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Payment Method</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            className={`flex-center ${method === 'UPI' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, gap: '0.5rem', padding: '0.5rem' }}
                            onClick={() => setMethod('UPI')}
                        >
                            <Banknote size={16} /> UPI
                        </button>
                        <button
                            type="button"
                            className={`flex-center ${method === 'Card' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, gap: '0.5rem', padding: '0.5rem' }}
                            onClick={() => setMethod('Card')}
                        >
                            <CreditCard size={16} /> Card
                        </button>
                    </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                    Add Record
                </button>
            </form>
        </div>
    );
};

export default AddTransactionForm;
