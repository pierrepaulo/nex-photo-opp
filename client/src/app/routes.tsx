import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ActivationPage } from '@/features/activation/pages/ActivationPage';
import { AdminDashboard } from '@/features/admin/pages/AdminDashboard';
import { DownloadPage } from '@/features/download/pages/DownloadPage';
import { Role } from '@/types';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={[Role.PROMOTER]}>
            <ActivationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/download/:token" element={<DownloadPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
