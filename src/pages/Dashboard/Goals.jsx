import { useState } from 'react';
import { Target, TrendingUp, Calendar, Heart, Car, Home, GraduationCap, Plane, MoreHorizontal, Edit2, Save, X, Trash2, Plus } from 'lucide-react';

const Goals = () => {
    const [goals, setGoals] = useState([
        { id: 1, title: 'Emergency Fund', icon: <Heart size={20} color="#ef4444" />, color: '#ef4444', targetAmount: 500000, currentAmount: 320000, deadline: '2027-12-31' },
        { id: 2, title: 'New Car', icon: <Car size={20} color="#3b82f6" />, color: '#3b82f6', targetAmount: 1500000, currentAmount: 450000, deadline: '2028-06-15' },
        { id: 3, title: 'Dream Home Downpayment', icon: <Home size={20} color="#10b981" />, color: '#10b981', targetAmount: 4000000, currentAmount: 1200000, deadline: '2030-01-01' },
        { id: 4, title: 'European Vacation', icon: <Plane size={20} color="#f59e0b" />, color: '#f59e0b', targetAmount: 300000, currentAmount: 120000, deadline: '2026-09-01' },
        { id: 5, title: "Child's Education", icon: <GraduationCap size={20} color="#8b5cf6" />, color: '#8b5cf6', targetAmount: 2000000, currentAmount: 500000, deadline: '2035-05-01' }
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [addForm, setAddForm] = useState({ title: '', targetAmount: '', currentAmount: '', deadline: '', color: '#3b82f6' });

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const calculateProgress = (current, target) => {
        if (!target || target <= 0) return 0;
        const percentage = (current / target) * 100;
        return percentage > 100 ? 100 : percentage;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No Date';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const totalTarget = goals.reduce((sum, goal) => sum + Number(goal.targetAmount), 0);
    const totalSaved = goals.reduce((sum, goal) => sum + Number(goal.currentAmount), 0);
    const overallProgress = totalTarget === 0 ? 0 : calculateProgress(totalSaved, totalTarget);

    const handleAddSubmit = (e) => {
        e.preventDefault();
        const newGoal = {
            id: Date.now(),
            title: addForm.title,
            targetAmount: Number(addForm.targetAmount),
            currentAmount: Number(addForm.currentAmount),
            deadline: addForm.deadline,
            color: addForm.color,
            icon: <Target size={20} color={addForm.color} />
        };
        setGoals([newGoal, ...goals]);
        setIsAdding(false);
        setAddForm({ title: '', targetAmount: '', currentAmount: '', deadline: '', color: '#3b82f6' });
    };

    const startEditing = (goal) => {
        setEditingId(goal.id);
        setEditForm({ ...goal });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setGoals(goals.map(g => g.id === editingId ? { ...editForm, targetAmount: Number(editForm.targetAmount), currentAmount: Number(editForm.currentAmount) } : g));
        setEditingId(null);
    };

    const handleDelete = (id) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-hero" style={{ fontSize: '2.5rem' }}>Financial Goals</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Track and manage your savings targets.</p>
                </div>
                {!isAdding && (
                    <button className="btn-primary" onClick={() => setIsAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target size={18} /> Add New Goal
                    </button>
                )}
            </header>

            <div className="dashboard-grid">

                {/* Summary Metrics */}
                <div className="col-span-12 animate-slide-up">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Target size={18} color="var(--primary)" /> Total Target
                                </div>
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                ₹ {totalTarget.toLocaleString()}
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <TrendingUp size={18} color="var(--secondary)" /> Total Saved
                                </div>
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                ₹ {totalSaved.toLocaleString()}
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Overall Progress
                                </div>
                                <span style={{ color: 'var(--success)', fontWeight: 600 }}>{overallProgress.toFixed(1)}%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', marginTop: '1.5rem', overflow: 'hidden' }}>
                                <div style={{ width: `${overallProgress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '4px', transition: 'width 1s ease-in-out' }}></div>
                            </div>
                        </div>

                    </div>
                </div>

                {isAdding && (
                    <div className="col-span-12 animate-slide-up" style={{ marginBottom: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--primary)' }}>
                            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Create New Goal</h3>
                                <button onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Goal Title</label>
                                    <input type="text" className="input-field" required value={addForm.title} onChange={e => setAddForm({ ...addForm, title: e.target.value })} placeholder="e.g. Vacation" style={{ width: '100%' }} />
                                </div>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Target Amount (₹)</label>
                                    <input type="number" className="input-field" required value={addForm.targetAmount} onChange={e => setAddForm({ ...addForm, targetAmount: e.target.value })} placeholder="50000" style={{ width: '100%' }} />
                                </div>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Initial Saved (₹)</label>
                                    <input type="number" className="input-field" required value={addForm.currentAmount} onChange={e => setAddForm({ ...addForm, currentAmount: e.target.value })} placeholder="10000" style={{ width: '100%' }} />
                                </div>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Deadline</label>
                                    <input type="date" className="input-field" required value={addForm.deadline} onChange={e => setAddForm({ ...addForm, deadline: e.target.value })} style={{ width: '100%' }} />
                                </div>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Theme Color</label>
                                    <select className="input-field" value={addForm.color} onChange={e => setAddForm({ ...addForm, color: e.target.value })} style={{ width: '100%' }}>
                                        <option value="#3b82f6">Blue</option>
                                        <option value="#10b981">Green</option>
                                        <option value="#ef4444">Red</option>
                                        <option value="#f59e0b">Orange</option>
                                        <option value="#8b5cf6">Purple</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <button type="submit" className="btn-primary" style={{ width: '100%', height: '42px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                        <Plus size={18} /> Create Goal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Goals Grid */}
                <div className="col-span-12 animate-slide-up delay-200">
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Your Savings Goals
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {goals.map((goal) => {
                            const isEditing = editingId === goal.id;
                            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);

                            if (isEditing) {
                                return (
                                    <div key={goal.id} className="glass-panel" style={{ padding: '1.5rem', borderTop: `4px solid ${editForm.color}`, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div className="flex-between">
                                            <h4 style={{ fontWeight: 600 }}>Edit Goal</h4>
                                            <button onClick={() => handleDelete(goal.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                        </div>
                                        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                            <input type="text" className="input-field" required value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" style={{ padding: '0.5rem' }} />
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input type="number" className="input-field" required value={editForm.currentAmount} onChange={e => setEditForm({ ...editForm, currentAmount: e.target.value })} placeholder="Current" style={{ flex: 1, padding: '0.5rem' }} />
                                                <input type="number" className="input-field" required value={editForm.targetAmount} onChange={e => setEditForm({ ...editForm, targetAmount: e.target.value })} placeholder="Target" style={{ flex: 1, padding: '0.5rem' }} />
                                            </div>
                                            <input type="date" className="input-field" required value={editForm.deadline} onChange={e => setEditForm({ ...editForm, deadline: e.target.value })} style={{ padding: '0.5rem' }} />
                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}><Save size={16} /> Save</button>
                                                <button type="button" onClick={() => setEditingId(null)} className="btn-secondary" style={{ flex: 1, padding: '0.5rem' }}>Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                )
                            }

                            return (
                                <div key={goal.id} className="glass-panel" style={{ padding: '2rem', borderTop: `4px solid ${goal.color}`, display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>

                                    <button onClick={() => startEditing(goal)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                                        <Edit2 size={18} />
                                    </button>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingRight: '1rem' }}>
                                        <div style={{ padding: '0.8rem', background: `${goal.color}20`, borderRadius: '12px' }}>
                                            {goal.icon}
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, wordBreak: 'break-word', paddingRight: '1rem' }}>{goal.title}</h4>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                                                <Calendar size={14} /> Due {formatDate(goal.deadline)}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex-between" style={{ marginBottom: '0.8rem' }}>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹ {goal.currentAmount.toLocaleString()}</span>
                                            <span style={{ color: 'var(--text-muted)' }}>of ₹ {goal.targetAmount.toLocaleString()}</span>
                                        </div>

                                        <div style={{ position: 'relative', paddingTop: '10px' }}>
                                            {/* Progress text above bar aligned to percentage */}
                                            <div style={{ position: 'absolute', top: '-10px', left: `calc(${progress}% - 15px)`, color: goal.color, fontSize: '0.8rem', fontWeight: 600, transition: 'left 1s ease-in-out' }}>
                                                {progress.toFixed(0)}%
                                            </div>
                                            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: `${progress}%`, height: '100%', background: goal.color, borderRadius: '4px', transition: 'width 1s ease-in-out' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Remaining:</span>
                                        <span style={{ fontWeight: 600 }}>₹ {(goal.targetAmount - goal.currentAmount).toLocaleString()}</span>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Goals;
