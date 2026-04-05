import { ArrowUpRight, ArrowDownRight, Wallet, Clock, RefreshCw } from 'lucide-react';
import { getDashboardSummary } from '../services/dashboard';
import useFetch from '../hooks/useFetch';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import CategoryChart from '../components/charts/CategoryChart';
import { formatCurrency, formatDate } from '../utils/formatters';

const StatCard = ({ label, value, icon: Icon, color, sub, delay = 0 }) => (
  <div className="card p-6 animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
    <div className="flex items-start justify-between mb-4">
      <p className="text-ink-muted text-sm font-body">{label}</p>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={17} />
      </div>
    </div>
    <p className="font-display font-bold text-2xl text-ink mb-1">{value}</p>
    {sub && <p className="text-ink-muted text-xs font-body">{sub}</p>}
  </div>
);

const SkeletonCard = () => (
  <div className="card p-6">
    <div className="skeleton h-4 w-24 mb-4 rounded" />
    <div className="skeleton h-8 w-36 mb-1 rounded" />
    <div className="skeleton h-3 w-20 rounded" />
  </div>
);

const DashboardPage = () => {
  const { data, loading, error, refetch } = useFetch(getDashboardSummary);
  const summary = data?.data?.summary;

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="skeleton h-8 w-40 rounded mb-2" />
            <div className="skeleton h-4 w-56 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-danger mb-4">{error}</p>
        <button onClick={refetch} className="btn-ghost flex items-center gap-2">
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  const netPositive = (summary?.netBalance || 0) >= 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-ink mb-1">Dashboard</h1>
          <p className="text-ink-muted font-body text-sm">Your financial overview at a glance.</p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 btn-ghost text-sm"
          title="Refresh"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Income"
          value={formatCurrency(summary?.totalIncome || 0)}
          icon={ArrowUpRight}
          color="bg-accent/10 text-accent"
          sub="All time"
          delay={0}
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency(summary?.totalExpenses || 0)}
          icon={ArrowDownRight}
          color="bg-danger/10 text-danger"
          sub="All time"
          delay={60}
        />
        <StatCard
          label="Net Balance"
          value={formatCurrency(Math.abs(summary?.netBalance || 0))}
          icon={Wallet}
          color={netPositive ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger'}
          sub={netPositive ? '▲ Surplus' : '▼ Deficit'}
          delay={120}
        />
        <StatCard
          label="Recent Transactions"
          value={summary?.recentTransactions?.length || 0}
          icon={Clock}
          color="bg-brand/10 text-brand"
          sub="Last 5 entries"
          delay={180}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 xl:col-span-2 animate-fade-up" style={{ animationDelay: '240ms' }}>
          <h2 className="font-display font-bold text-lg text-ink mb-1">Monthly Trends</h2>
          <p className="text-ink-muted text-xs font-body mb-5">Income vs expense over the last 12 months</p>
          <MonthlyTrendChart data={summary?.monthlyTrends || []} />
        </div>

        <div className="card p-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
          <h2 className="font-display font-bold text-lg text-ink mb-1">By Category</h2>
          <p className="text-ink-muted text-xs font-body mb-5">Distribution across top categories</p>
          <CategoryChart data={summary?.categoryTotals || []} />
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card p-6 animate-fade-up" style={{ animationDelay: '360ms' }}>
        <h2 className="font-display font-bold text-lg text-ink mb-5">Recent Transactions</h2>
        {!summary?.recentTransactions?.length ? (
          <p className="text-ink-muted text-sm text-center py-8">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {summary.recentTransactions.map((tx) => (
              <div
                key={tx._id}
                className="flex items-center justify-between p-4 rounded-xl bg-surface-elevated border border-surface-border hover:border-ink-faint/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    tx.type === 'income' ? 'bg-accent/10' : 'bg-danger/10'
                  }`}>
                    {tx.type === 'income' ? '↑' : '↓'}
                  </div>
                  <div>
                    <p className="font-body font-medium text-ink text-sm">{tx.category}</p>
                    <p className="text-ink-muted text-xs mt-0.5">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={tx.type}>{tx.type}</Badge>
                  <p className={`font-mono font-semibold text-sm ${
                    tx.type === 'income' ? 'text-accent' : 'text-danger'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
