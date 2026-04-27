import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CategoryChart = ({ data }) => {
    const aggregatedData = data.reduce((acc, curr) => {
        const existing = acc.find(item => item.name === curr.category);
        if (existing) {
            existing.value += curr.amount;
        } else {
            acc.push({ name: curr.category, value: curr.amount });
        }
        return acc;
    }, []);

    const chartData = aggregatedData.length > 0 ? aggregatedData : [
        { name: 'Groceries', value: 400 },
        { name: 'Dining', value: 300 },
        { name: 'Entertainment', value: 300 },
        { name: 'Shopping', value: 200 },
        { name: 'Utilities', value: 278 }
    ];

    const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

    return (
        <div className="glass-panel animate-slide-up delay-200" style={{ padding: '2rem', minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Expense Allocation</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', background: 'rgba(236, 72, 153, 0.15)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontWeight: 500 }}>All Time</span>
            </div>

            {/* Fixed pixel height avoids the 0px height bug with ResponsiveContainer inside flex */}
            <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={8}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}
                                style={{ filter: `drop-shadow(0px 4px 10px ${COLORS[index % COLORS.length]}60)` }}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: 'var(--text-main)', fontWeight: 500 }}
                        formatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Legend verticalAlign="bottom" height={60} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>

    );
};

export default CategoryChart;
