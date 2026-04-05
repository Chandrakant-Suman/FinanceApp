import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const COLORS = ['#818cf8', '#4ade80', '#f87171', '#fb923c', '#a78bfa', '#38bdf8', '#facc15', '#34d399'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-surface-elevated border border-surface-border rounded-xl p-3 shadow-xl text-sm font-body">
      <p className="text-ink font-medium">{name}</p>
      <p className="text-ink-muted">{formatCurrency(value)}</p>
    </div>
  );
};

const CategoryChart = ({ data = [] }) => {
  const chartData = data.slice(0, 8).map((cat) => ({
    name: cat._id,
    value: cat.totalAmount,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          strokeWidth={0}
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontFamily: 'DM Sans', fontSize: 12 }}
          formatter={(value) => <span style={{ color: '#7b84a0' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryChart;
