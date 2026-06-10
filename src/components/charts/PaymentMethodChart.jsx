import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PaymentMethodChart = ({ data }) => {
    // Aggregate transactions by payment method
    const methodMap = { UPI: 0, Cash: 0, Bank: 0 };
    
    data.forEach(tx => {
        if (!tx.method) return;
        const methodKey = tx.method.toUpperCase();
        if (methodKey.includes('UPI')) {
            methodMap.UPI += tx.amount;
        } else if (methodKey.includes('CASH')) {
            methodMap.Cash += tx.amount;
        } else if (methodKey.includes('BANK') || methodKey.includes('CARD')) {
            methodMap.Bank += tx.amount;
        }
    });

    const hasData = Object.values(methodMap).some(val => val > 0);
    const chartData = hasData 
        ? Object.keys(methodMap).map(key => ({ name: key, value: methodMap[key] }))
        : [
            { name: 'UPI', value: 2400 },
            { name: 'Cash', value: 1200 },
            { name: 'Bank', value: 3800 }
        ];

    // Colors mapping for each payment method
    const COLORS = {
        UPI: '#f97316',   // Orange
        Cash: '#10b981',  // Green
        Bank: '#6366f1'   // Purple-Blue
    };

    return (
        <div className="glass-panel animate-slide-up delay-100" style={{ padding: '2rem', minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Payment Method Breakdown</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--success)', background: 'rgba(16, 185, 129, 0.15)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontWeight: 500 }}>Active Methods</span>
            </div>

            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barSize={50}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} width={60} />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}
                        itemStyle={{ fontWeight: 600 }}
                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Spent']}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || 'var(--primary)'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PaymentMethodChart;
