import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-center p-8">
      <p className="font-mono text-8xl font-bold text-surface-border mb-4">404</p>
      <h1 className="font-display font-extrabold text-3xl text-ink mb-2">Page not found</h1>
      <p className="text-ink-muted font-body mb-8">The route you're looking for doesn't exist.</p>
      <button onClick={() => navigate('/dashboard')} className="btn-primary">
        Back to Dashboard
      </button>
    </div>
  );
};

export default NotFoundPage;
