import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { formatMonthYear, formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-elevated border border-surface-border rounded-xl p-3 shadow-xl text-sm font-body">
      <p className="text-ink-muted mb-2 font-display font-semibold">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          <span className="text-ink-muted capitalize">{p.dataKey}:</span>
          <span className="text-ink font-medium">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const MonthlyTrendChart = ({ data = [] }) => {
  const chartData = [...data]
    .reverse()
    .map((month) => {
      const income = month.data?.find((d) => d.type === 'income')?.total || 0;
      const expense = month.data?.find((d) => d.type === 'expense')?.total || 0;
      return {
        name: formatMonthYear(month.year, month.month),
        income,
        expense,
      };
    });

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#252d3d" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#7b84a0', fontSize: 11, fontFamily: 'DM Sans' }}
          axisLine={{ stroke: '#252d3d' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#7b84a0', fontSize: 11, fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontFamily: 'Syne', fontSize: 12, paddingTop: 12 }}
          formatter={(value) => <span style={{ color: '#7b84a0', textTransform: 'capitalize' }}>{value}</span>}
        />
        <Area type="monotone" dataKey="income" stroke="#4ade80" strokeWidth={2} fill="url(#incomeGrad)" dot={false} />
        <Area type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={2} fill="url(#expenseGrad)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MonthlyTrendChart;
