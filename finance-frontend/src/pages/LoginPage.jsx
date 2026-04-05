import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { TrendingUp, Eye, EyeOff } from 'lucide-react';
import { login } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/formatters';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { user, saveSession } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      const { user: userData, token } = res.data.data;
      saveSession(userData, token);
      toast.success(`Welcome back, ${userData.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const creds = {
      admin: { email: 'admin@finance.com', password: 'password123' },
      analyst: { email: 'analyst@finance.com', password: 'password123' },
      viewer: { email: 'viewer@finance.com', password: 'password123' },
    };
    setForm(creds[role]);
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-surface-card border-r border-surface-border relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-surface-border/50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-surface-border/30" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand/20 border border-brand/30 flex items-center justify-center">
            <TrendingUp size={20} className="text-brand" />
          </div>
          <span className="font-display font-bold text-xl text-ink">FinanceApp</span>
        </div>

        <div className="relative">
          <p className="font-display font-extrabold text-5xl text-ink leading-tight mb-4">
            Track every<br />
            <span className="text-brand">rupee</span> with<br />
            precision.
          </p>
          <p className="text-ink-muted font-body text-lg max-w-sm">
            Role-based financial intelligence for teams that take data seriously.
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-4">
          {[
            { label: 'Total Records', value: '2,400+', color: 'text-brand' },
            { label: 'Categories', value: '10+', color: 'text-accent' },
            { label: 'Roles', value: '3', color: 'text-yellow-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-surface-elevated rounded-xl p-4 border border-surface-border">
              <p className={`font-display font-bold text-2xl ${color}`}>{value}</p>
              <p className="text-ink-muted text-xs font-body mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-brand/20 border border-brand/30 flex items-center justify-center">
              <TrendingUp size={18} className="text-brand" />
            </div>
            <span className="font-display font-bold text-xl text-ink">FinanceApp</span>
          </div>

          <h1 className="font-display font-bold text-3xl text-ink mb-1">Sign in</h1>
          <p className="text-ink-muted font-body mb-8">Access your financial workspace.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-display font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-4 rounded-xl bg-surface-elevated border border-surface-border">
            <p className="text-xs font-display font-semibold text-ink-muted uppercase tracking-wider mb-3">
              Demo accounts
            </p>
            <div className="flex gap-2">
              {['admin', 'analyst', 'viewer'].map((role) => (
                <button
                  key={role}
                  onClick={() => fillDemo(role)}
                  className="flex-1 py-2 rounded-lg text-xs font-display font-semibold capitalize transition-all
                    border border-surface-border text-ink-muted hover:border-brand/40 hover:text-brand hover:bg-brand/5"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
