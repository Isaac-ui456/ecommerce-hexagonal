import { Navigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/services/authContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/catalog" replace />;

  return children;
}
