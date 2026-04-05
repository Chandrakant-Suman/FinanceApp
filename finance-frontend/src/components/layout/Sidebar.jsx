import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Users, LogOut, TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-medium transition-all duration-150 ${
        isActive
          ? 'bg-brand/10 text-brand border border-brand/20'
          : 'text-ink-muted hover:text-ink hover:bg-surface-elevated'
      }`
    }
  >
    <Icon size={18} strokeWidth={isActive => isActive ? 2.5 : 1.75} />
    {label}
  </NavLink>
);

const Sidebar = () => {
  const { user, logout, isAdmin, isAnalyst } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out.');
    navigate('/login');
  };

  const roleColor = {
    admin: 'text-brand',
    analyst: 'text-yellow-400',
    viewer: 'text-ink-muted',
  };

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-surface-card border-r border-surface-border">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand/20 border border-brand/30 flex items-center justify-center">
            <TrendingUp size={18} className="text-brand" />
          </div>
          <div>
            <p className="font-display font-bold text-ink text-lg leading-none">FinanceApp</p>
            <p className="font-mono text-xs text-ink-muted mt-0.5">v1.0</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <p className="px-4 mb-2 text-xs font-display font-semibold text-ink-faint uppercase tracking-widest">
          Main
        </p>
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        {isAnalyst && <NavItem to="/records" icon={FileText} label="Records" />}
        {isAdmin && <NavItem to="/users" icon={Users} label="Users" />}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-surface-border">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-elevated mb-2">
          <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-brand text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-body font-medium text-ink text-sm truncate">{user?.name}</p>
            <p className={`font-display text-xs font-semibold uppercase tracking-wide ${roleColor[user?.role]}`}>
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-body text-ink-muted hover:text-danger hover:bg-danger/5 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
