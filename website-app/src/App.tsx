import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Layout from './components/layout/Layout'
import Login from './components/auth/Login'
import Dashboard from './components/dashboard/Dashboard'
import Profile from './components/dashboard/Profile'
import Licenses from './components/licenses/Licenses'
import Devices from './components/devices/Devices'
import Stats from './components/stats/Stats'
import Notifications from './components/notifications/Notifications'
import AdminUsers from './components/admin/AdminUsers'
import AdminRoles from './components/admin/AdminRoles'
import AdminLogs from './components/admin/AdminLogs'
import AdminVersions from './components/admin/AdminVersions'
import AdminSettings from './components/admin/AdminSettings'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="licenses" element={<Licenses />} />
        <Route path="devices" element={<Devices />} />
        <Route path="stats" element={<Stats />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/roles" element={<AdminRoles />} />
        <Route path="admin/logs" element={<AdminLogs />} />
        <Route path="admin/versions" element={<AdminVersions />} />
        <Route path="admin/settings" element={<AdminSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
