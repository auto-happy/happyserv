import { useTranslation } from 'react-i18next'
import { HiFunnel } from 'react-icons/hi2'

const logs = [
  { time: '14:32:15', level: 'info', message: 'Téléchargement v2.1.0 - Windows - Succès', user: 'system' },
  { time: '14:31:02', level: 'warn', message: 'Tentative d\'accès refusé - /admin/utilisateurs', user: '192.168.1.42' },
  { time: '14:30:00', level: 'info', message: 'Nouveau compte créé - sophie@example.com', user: 'system' },
  { time: '14:28:45', level: 'error', message: 'Échec connexion base de données - Timeout', user: 'system' },
  { time: '14:25:33', level: 'info', message: 'Version 2.2.0-beta.1 publiée', user: 'admin@happyserv.app' },
  { time: '14:20:18', level: 'info', message: 'Synchronisation terminée - 15 utilisateurs', user: 'system' },
  { time: '14:15:00', level: 'warn', message: 'Utilisation mémoire élevée - 85%', user: 'system' },
  { time: '14:10:22', level: 'info', message: 'Backup quotidien terminé - 256 MB', user: 'system' },
]

const levelColors: Record<string, string> = {
  info: 'bg-blue-500/20 text-blue-400',
  warn: 'bg-yellow-500/20 text-yellow-400',
  error: 'bg-red-500/20 text-red-400',
}

export default function AdminLogs() {
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">{t('admin.logs')}</h1>

      <div className="card overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <HiFunnel className="text-gray-400" />
            <select className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-sm text-gray-400 focus:outline-none focus:border-primary-500">
              <option>Tous les niveaux</option>
              <option>Info</option>
              <option>Warning</option>
              <option>Error</option>
            </select>
          </div>
          <input type="text" placeholder={t('admin.search')} className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary-500 w-64" />
        </div>

        <div className="space-y-1">
          {logs.map((log, i) => (
            <div key={i} className="flex items-start text-sm py-2 border-b border-gray-800/30 last:border-0">
              <span className="text-gray-500 w-20 shrink-0 font-mono">{log.time}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded mr-3 shrink-0 ${levelColors[log.level]}`}>{log.level}</span>
              <span className="text-gray-300 flex-1">{log.message}</span>
              <span className="text-gray-500 text-xs w-32 text-right truncate">{log.user}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
