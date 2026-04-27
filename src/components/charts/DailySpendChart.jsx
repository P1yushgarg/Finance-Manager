import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DailySpendChart = ({ data }) => {
    // Group transactions by calendar date (YYYY-MM-DD) to avoid cross-month collisions
    const dailyMap = {};
    data.forEach(tx => {
        const d = new Date(tx.date);
        if (isNaN(d.getTime())) return; // skip invalid dates
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        dailyMap[key] = (dailyMap[key] || 0) + tx.amount;
    });

    // Sort keys chronologically and build chart data
    const aggregateDaily = Object.keys(dailyMap)
        .sort()
        .map(key => {
            const [, month, day] = key.split('-');
            return { day: `${day}/${month}`, amount: dailyMap[key] };
        });

    const chartData = aggregateDaily.length > 0 ? aggregateDaily : [
        { day: '01/01', amount: 400 },
        { day: '05/01', amount: 1200 },
        { day: '10/01', amount: 800 },
        { day: '15/01', amount: 2500 },
        { day: '20/01', amount: 450 },
        { day: '25/01', amount: 1800 },
        { day: '30/01', amount: 3200 },
    ];

    return (
        <div className="glass-panel animate-slide-up delay-100" style={{ padding: '2rem', minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Daily Spend Trend</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.15)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontWeight: 500 }}>This Month</span>
            </div>

            {/* Fixed pixel height avoids the 0px height bug with ResponsiveContainer inside flex */}
            <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="var(--primary)" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} padding={{ left: 10, right: 10 }} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} width={60} />
                    <Tooltip
                        cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1, fill: 'transparent' }}
                        contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: 'var(--primary)', fontWeight: 600 }}
                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Spent']}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Area type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'var(--bg-dark)', strokeWidth: 3 }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DailySpendChart;
