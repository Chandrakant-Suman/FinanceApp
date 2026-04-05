import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false, loading = false }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <p className="text-ink-muted text-sm mb-6">{message}</p>
    <div className="flex gap-3 justify-end">
      <button onClick={onClose} className="btn-ghost">Cancel</button>
      <button
        onClick={onConfirm}
        disabled={loading}
        className={`px-5 py-2.5 rounded-xl font-display font-semibold text-sm transition-all active:scale-95 disabled:opacity-40 ${
          danger
            ? 'bg-danger text-white hover:bg-danger-dim'
            : 'bg-brand text-surface hover:bg-brand-dim'
        }`}
      >
        {loading ? 'Processing…' : confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
