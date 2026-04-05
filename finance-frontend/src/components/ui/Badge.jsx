const variants = {
  income: 'bg-accent/10 text-accent border border-accent/20',
  expense: 'bg-danger/10 text-danger border border-danger/20',
  admin: 'bg-brand/10 text-brand border border-brand/20',
  analyst: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20',
  viewer: 'bg-ink-muted/10 text-ink-muted border border-ink-faint/30',
  active: 'bg-accent/10 text-accent border border-accent/20',
  inactive: 'bg-danger/10 text-danger border border-danger/20',
};

const Badge = ({ variant = 'viewer', children, className = '' }) => (
  <span className={`badge ${variants[variant] || variants.viewer} ${className}`}>
    {children}
  </span>
);

export default Badge;
