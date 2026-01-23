import { Routes, Route, Navigate } from 'react-router-dom';
import { AlertList } from '../components/alerts/AlertList';
import { AlertDetail } from '../components/alerts/AlertDetail';
import { AuthForm } from '../components/auth/AuthForm';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function AppRoutes() {
  const token = localStorage.getItem('access_token');

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? '/alerts' : '/login'} replace />} />
      <Route path="/login" element={<AuthForm />} />
      <Route
        path="/alerts"
        element={
          <ProtectedRoute>
            <AlertList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alerts/:id"
        element={
          <ProtectedRoute>
            <AlertDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
