import { Search, X } from 'lucide-react';

const CATEGORIES = [
  '', 'Salary', 'Freelance', 'Investment', 'Rent', 'Groceries',
  'Utilities', 'Healthcare', 'Marketing', 'Travel', 'Other',
];

const RecordFilters = ({ filters, onChange, onReset }) => {
  const hasActive = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
          placeholder="Search notes, category…"
          className="input-field pl-9 w-56 text-sm"
        />
      </div>

      {/* Type */}
      <select
        value={filters.type}
        onChange={(e) => onChange('type', e.target.value)}
        className="input-field w-36 text-sm"
      >
        <option value="">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Category */}
      <select
        value={filters.category}
        onChange={(e) => onChange('category', e.target.value)}
        className="input-field w-40 text-sm"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c || 'All categories'}</option>
        ))}
      </select>

      {/* Date range */}
      <input
        type="date"
        value={filters.startDate}
        onChange={(e) => onChange('startDate', e.target.value)}
        className="input-field w-40 text-sm"
        title="From date"
      />
      <input
        type="date"
        value={filters.endDate}
        onChange={(e) => onChange('endDate', e.target.value)}
        className="input-field w-40 text-sm"
        title="To date"
      />

      {hasActive && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-danger hover:bg-danger/5 border border-danger/20 transition-colors font-body"
        >
          <X size={14} /> Reset
        </button>
      )}
    </div>
  );
};

export default RecordFilters;
