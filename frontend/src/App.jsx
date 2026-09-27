import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './modules/auth/services/authContext';
import AppLayout from './shared/components/AppLayout';
import ProtectedRoute from './shared/components/ProtectedRoute';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';
import CatalogPage from './modules/catalog/pages/CatalogPage';
import OrdersPage from './modules/orders/pages/OrdersPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/catalog" element={<ProtectedRoute><CatalogPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/catalog" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
