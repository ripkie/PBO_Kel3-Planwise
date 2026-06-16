import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import TasksListPage from '../pages/TasksListPage';
import BoardPage from '../pages/BoardPage';
import CalendarPage from '../pages/CalendarPage';
import LabelsPage from '../pages/LabelsPage';
import HistoryPage from '../pages/HistoryPage';
import GroupsPage from '../pages/GroupsPage';
import { getCurrentUser } from '../services/authService';

function ProtectedRoute({ children }) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const user = getCurrentUser();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><TasksListPage /></ProtectedRoute>} />
        <Route path="/board" element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/labels" element={<ProtectedRoute><LabelsPage /></ProtectedRoute>} />
        <Route path="/groups" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
