import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { useAuth } from './context/AuthContext';
import Login from './Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import RegisterCase from './pages/RegisterCase.jsx';
import Reports from './pages/Reports.jsx';
import AdminSettings from './pages/AdminSettings.jsx';
import RulesWeights from './pages/admin/RulesWeights.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import SystemConfig from './pages/admin/SystemConfig.jsx';

/**
 * Redirect unauthenticated users to the login page.
 * Shows nothing while Firebase resolves auth state.
 */
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  return currentUser ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Protected pages */}
        <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/register-case" element={<ProtectedRoute><RegisterCase /></ProtectedRoute>} />
        <Route path="/reports"       element={<ProtectedRoute><Reports /></ProtectedRoute>} />

        {/* Admin Settings — nested */}
        <Route path="/admin-settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>}>
          <Route index element={<Navigate to="rules-weights" replace />} />
          <Route path="rules-weights" element={<RulesWeights />} />
          <Route path="users"         element={<UserManagement />} />
          <Route path="system"        element={<SystemConfig />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
