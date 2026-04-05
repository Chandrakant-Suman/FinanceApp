import { useState, useCallback } from 'react';
import { Plus, FileText, Pencil, Trash2 } from 'lucide-react';
import { getRecords, deleteRecord } from '../services/records';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import RecordForm from '../components/records/RecordForm';
import RecordFilters from '../components/records/RecordFilters';
import Spinner from '../components/ui/Spinner';
import { formatCurrency, formatDate, getErrorMessage } from '../utils/formatters';
import toast from 'react-hot-toast';

const emptyFilters = { search: '', type: '', category: '', startDate: '', endDate: '' };

const RecordsPage = () => {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(emptyFilters);
  const [showCreate, setShowCreate] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchFn = useCallback(
    () => getRecords({ page, limit: 10, ...filters }),
    [page, filters]
  );

  const { data, loading, refetch } = useFetch(fetchFn, [page, filters]);
  const records = data?.data?.records || [];
  const pagination = data?.data?.pagination;

  const handleFilterChange = (key, value) => {
    setFilters((p) => ({ ...p, [key]: value }));
    setPage(1);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteRecord(deleteTarget._id);
      toast.success('Record deleted.');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowCreate(false);
    setEditRecord(null);
    refetch();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-ink mb-1">Records</h1>
          <p className="text-ink-muted font-body text-sm">Browse and manage financial transactions.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> New Record
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 animate-fade-up" style={{ animationDelay: '60ms' }}>
        <RecordFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={() => { setFilters(emptyFilters); setPage(1); }}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden animate-fade-up" style={{ animationDelay: '120ms' }}>
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : records.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No records found"
            description="Try adjusting your filters or create a new record."
            action={isAdmin && (
              <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
                <Plus size={15} /> Create Record
              </button>
            )}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-border">
                    {['Date', 'Category', 'Type', 'Amount', 'Notes', 'Created By', ...(isAdmin ? ['Actions'] : [])].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-display font-semibold text-ink-muted uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, idx) => (
                    <tr
                      key={rec._id}
                      className="border-b border-surface-border/50 hover:bg-surface-elevated/50 transition-colors animate-fade-up"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <td className="px-5 py-4 text-sm font-mono text-ink-muted whitespace-nowrap">
                        {formatDate(rec.date)}
                      </td>
                      <td className="px-5 py-4 text-sm font-body font-medium text-ink">
                        {rec.category}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={rec.type}>{rec.type}</Badge>
                      </td>
                      <td className={`px-5 py-4 text-sm font-mono font-semibold whitespace-nowrap ${
                        rec.type === 'income' ? 'text-accent' : 'text-danger'
                      }`}>
                        {rec.type === 'income' ? '+' : '-'}{formatCurrency(rec.amount)}
                      </td>
                      <td className="px-5 py-4 text-sm font-body text-ink-muted max-w-xs truncate">
                        {rec.notes || <span className="text-ink-faint">—</span>}
                      </td>
                      <td className="px-5 py-4 text-sm font-body text-ink-muted">
                        {rec.createdBy?.name || '—'}
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditRecord(rec)}
                              className="p-1.5 rounded-lg text-ink-muted hover:text-brand hover:bg-brand/10 transition-colors"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(rec)}
                              className="p-1.5 rounded-lg text-ink-muted hover:text-danger hover:bg-danger/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-4">
              <Pagination pagination={pagination} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Financial Record">
        <RecordForm onSuccess={handleSuccess} onCancel={() => setShowCreate(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editRecord} onClose={() => setEditRecord(null)} title="Edit Record">
        <RecordForm record={editRecord} onSuccess={handleSuccess} onCancel={() => setEditRecord(null)} />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Record"
        message={`Are you sure you want to delete this ${deleteTarget?.type} record of ${deleteTarget ? formatCurrency(deleteTarget.amount) : ''}? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
};

export default RecordsPage;
