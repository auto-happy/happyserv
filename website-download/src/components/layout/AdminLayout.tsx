import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  HiHome, HiVariable, HiUsers, HiChartBar, HiPencil, HiDocumentText, HiMenu, HiX, HiLogout,
} from 'react-icons/hi'

const adminLinks = [
  { path: '/admin', labelKey: 'admin.dashboard', icon: HiHome },
  { path: '/admin/versions', labelKey: 'admin.versions', icon: HiVariable },
  { path: '/admin/utilisateurs', labelKey: 'admin.users', icon: HiUsers },
  { path: '/admin/statistiques', labelKey: 'admin.stats', icon: HiChartBar },
  { path: '/admin/blog', labelKey: 'admin.blog', icon: HiPencil },
  { path: '/admin/logs', labelKey: 'admin.logs', icon: HiDocumentText },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-200 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <Link to="/admin" className="flex items-center space-x-2">
            <span className="text-lg font-bold text-white">HappyServ</span>
            <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded">{t('admin.title')}</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
            <HiX className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {adminLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path ? 'bg-primary-500/10 text-primary-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span>{t(link.labelKey)}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 w-full transition-colors">
            <HiLogout className="w-5 h-5" />
            <span>{t('admin.logout')}</span>
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-gray-900/50 border-b border-gray-800 flex items-center justify-between px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400">
            <HiMenu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">← {t('nav.accueil')}</Link>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
