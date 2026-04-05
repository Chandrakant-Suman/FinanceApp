import { useState, useEffect } from 'react';
import { createRecord, updateRecord } from '../../services/records';
import { getErrorMessage } from '../../utils/formatters';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Salary', 'Freelance', 'Investment', 'Rent', 'Groceries',
  'Utilities', 'Healthcare', 'Marketing', 'Travel', 'Other',
];

const defaultForm = {
  amount: '',
  type: 'income',
  category: 'Salary',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
};

const RecordForm = ({ record, onSuccess, onCancel }) => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const isEdit = !!record;

  useEffect(() => {
    if (record) {
      setForm({
        amount: record.amount,
        type: record.type,
        category: record.category,
        date: record.date?.slice(0, 10) || defaultForm.date,
        notes: record.notes || '',
      });
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (isEdit) {
        await updateRecord(record._id, payload);
        toast.success('Record updated.');
      } else {
        await createRecord(payload);
        toast.success('Record created.');
      }
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-display font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
            Amount (₹)
          </label>
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-display font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
            Type
          </label>
          <div className="flex gap-2">
            {['income', 'expense'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((p) => ({ ...p, type: t }))}
                className={`flex-1 py-2.5 rounded-xl text-sm font-display font-semibold capitalize transition-all ${
                  form.type === t
                    ? t === 'income'
                      ? 'bg-accent/15 text-accent border border-accent/30'
                      : 'bg-danger/15 text-danger border border-danger/30'
                    : 'bg-surface-elevated border border-surface-border text-ink-muted hover:border-ink-faint'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-display font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select name="category" value={form.category} onChange={handleChange} className="input-field">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-display font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
            Date
          </label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-display font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
          Notes <span className="text-ink-faint font-normal normal-case">(optional)</span>
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Add a note…"
          className="input-field resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost flex-1">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Saving…' : isEdit ? 'Update Record' : 'Create Record'}
        </button>
      </div>
    </form>
  );
};

export default RecordForm;
