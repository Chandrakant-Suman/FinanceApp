import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RecordsPage from './pages/RecordsPage';
import UsersPage from './pages/UsersPage';
import NotFoundPage from './pages/NotFoundPage';

// Route guard: allow only if user has the required role
import { useAuth } from './context/AuthContext';
import { Navigate as Nav } from 'react-router-dom';

const RequireRole = ({ check, children }) => {
  const auth = useAuth();
  if (!auth[check]) return <Nav to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<AppLayout />}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route
        path="/records"
        element={
          <RequireRole check="isAnalyst">
            <RecordsPage />
          </RequireRole>
        }
      />
      <Route
        path="/users"
        element={
          <RequireRole check="isAdmin">
            <UsersPage />
          </RequireRole>
        }
      />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
