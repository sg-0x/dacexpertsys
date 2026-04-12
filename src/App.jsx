import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './index.css';
import { useAuth } from './context/AuthContext';
import { useLenis } from './hooks/useLenis';
import Login from './Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import RegisterCase from './pages/RegisterCase.jsx';
import Reports from './pages/Reports.jsx';
import AdminSettings from './pages/AdminSettings.jsx';
import RulesWeights from './pages/admin/RulesWeights.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import SystemConfig from './pages/admin/SystemConfig.jsx';
import ManageCase from './pages/ManageCase.jsx';
import ViewCase from './pages/ViewCase.jsx';
import StudentLayout from './layouts/StudentLayout.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import StudentCases from './pages/student/StudentCases.jsx';
import StudentCaseDetails from './pages/student/StudentCaseDetails.jsx';
import StudentPlaceholder from './pages/student/StudentPlaceholder.jsx';
import WardenDashboard from './pages/warden/WardenDashboard.jsx';
import WardenRegisterCase from './pages/warden/RegisterCase.jsx';
import WardenMyCases from './pages/warden/MyCases.jsx';
import WardenManageCase from './pages/warden/ManageCase.jsx';
import WardenViewCase from './pages/warden/ViewCase.jsx';
import WardenNotifications from './pages/warden/Notifications.jsx';
import WardenProfile from './pages/warden/Profile.jsx';
import ChiefWardenDashboard from './pages/chiefwarden/ChiefWardenDashboard.jsx';
import ChiefWardenRegisterCase from './pages/chiefwarden/RegisterCase.jsx';
import ChiefWardenIncomingCases from './pages/chiefwarden/IncomingCases.jsx';
import ChiefWardenManageCase from './pages/chiefwarden/ManageCase.jsx';
import ChiefWardenViewCase from './pages/chiefwarden/ViewCase.jsx';
import ChiefWardenNotifications from './pages/chiefwarden/Notifications.jsx';
import ChiefWardenProfile from './pages/chiefwarden/Profile.jsx';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  return currentUser ? children : <Navigate to="/" replace />;
}

/** Must be inside <BrowserRouter> to use useLocation */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Protected pages */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/register-case" element={<ProtectedRoute><RegisterCase /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/cases/:token" element={<ProtectedRoute><ManageCase /></ProtectedRoute>} />
        <Route path="/view-case/:token" element={<ProtectedRoute><ViewCase /></ProtectedRoute>} />

        {/* Student area — separate layout */}
        <Route path="/student" element={<ProtectedRoute><StudentLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="cases" element={<StudentCases />} />
          <Route path="cases/:token" element={<StudentCaseDetails />} />
          <Route path="penalty-points" element={<StudentPlaceholder title="Penalty Points" />} />
          <Route path="profile" element={<StudentPlaceholder title="Profile" />} />
          <Route path="disciplinary-policy" element={<StudentPlaceholder title="Disciplinary Policy" />} />
        </Route>

        {/* Warden area */}
        <Route path="/warden/dashboard" element={<ProtectedRoute><WardenDashboard /></ProtectedRoute>} />
        <Route path="/warden/register" element={<ProtectedRoute><WardenRegisterCase /></ProtectedRoute>} />
        <Route path="/warden/cases" element={<ProtectedRoute><WardenMyCases /></ProtectedRoute>} />
        <Route path="/warden/cases/:id" element={<ProtectedRoute><WardenManageCase /></ProtectedRoute>} />
        <Route path="/warden/view/:id" element={<ProtectedRoute><WardenViewCase /></ProtectedRoute>} />
        <Route path="/warden/notifications" element={<ProtectedRoute><WardenNotifications /></ProtectedRoute>} />
        <Route path="/warden/profile" element={<ProtectedRoute><WardenProfile /></ProtectedRoute>} />

        {/* Chief Warden area */}
        <Route path="/chief-warden/dashboard" element={<ProtectedRoute><ChiefWardenDashboard /></ProtectedRoute>} />
        <Route path="/chief-warden/register" element={<ProtectedRoute><ChiefWardenRegisterCase /></ProtectedRoute>} />
        <Route path="/chief-warden/cases" element={<ProtectedRoute><ChiefWardenIncomingCases /></ProtectedRoute>} />
        <Route path="/chief-warden/cases/:id" element={<ProtectedRoute><ChiefWardenManageCase /></ProtectedRoute>} />
        <Route path="/chief-warden/view/:id" element={<ProtectedRoute><ChiefWardenViewCase /></ProtectedRoute>} />
        <Route path="/chief-warden/notifications" element={<ProtectedRoute><ChiefWardenNotifications /></ProtectedRoute>} />
        <Route path="/chief-warden/profile" element={<ProtectedRoute><ChiefWardenProfile /></ProtectedRoute>} />

        {/* Admin Settings — nested */}
        <Route path="/admin-settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>}>
          <Route index element={<Navigate to="rules-weights" replace />} />
          <Route path="rules-weights" element={<RulesWeights />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="system" element={<SystemConfig />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  useLenis(); // 🌊 boot global smooth scroll
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
