import { useTranslation } from 'react-i18next'
import { HiVariable, HiUsers, HiArrowTrendingUp } from 'react-icons/hi2'
import { HiDownload } from 'react-icons/hi'

export default function AdminDashboard() {
  const { t } = useTranslation()

  const stats = [
    { icon: HiDownload, label: 'admin.totalDownloads', value: '52,847' },
    { icon: HiVariable, label: 'admin.totalVersions', value: '15' },
    { icon: HiUsers, label: 'admin.activeUsers', value: '3,421' },
    { icon: HiArrowTrendingUp, label: 'admin.newToday', value: '127' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">{t('admin.dashboard')}</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <s.icon className="w-8 h-8 text-primary-400 mb-3" />
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-gray-400">{t(s.label)}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Activité récente</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
              <div>
                <p className="text-sm text-white">Téléchargement v2.1.0 - Windows</p>
                <p className="text-xs text-gray-500">Il y a {i * 12} min</p>
              </div>
              <span className="text-xs text-green-400">Succès</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
