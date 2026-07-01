import { useState } from 'react'

interface Notification {
  id: number
  type: 'update' | 'alert' | 'info'
  title: string
  message: string
  date: string
  read: boolean
}

const mockNotifications: Notification[] = [
  { id: 1, type: 'update', title: 'Nouvelle version disponible', message: 'La version 2.0.0 de HappyServ est disponible. Mettez à jour votre client pour bénéficier des dernières fonctionnalités.', date: '2026-06-30T10:00:00Z', read: false },
  { id: 2, type: 'alert', title: 'Licence bientôt expirée', message: 'Votre licence Premium (HS-ABC-123-XYZ) expire dans 7 jours.', date: '2026-06-29T08:30:00Z', read: false },
  { id: 3, type: 'info', title: 'Maintenance planifiée', message: 'Une maintenance du serveur est prévue le 15 juillet de 02h00 à 04h00 UTC.', date: '2026-06-28T14:00:00Z', read: true },
  { id: 4, type: 'update', title: 'Mise à jour de sécurité', message: 'Correctif de sécurité appliqué à l\'API. Redémarrage recommandé.', date: '2026-06-27T16:45:00Z', read: true },
  { id: 5, type: 'alert', title: 'Limite d\'appareils atteinte', message: 'Vous avez atteint la limite maximale d\'appareils pour votre licence Standard.', date: '2026-06-25T11:20:00Z', read: true },
]

const ITEMS_PER_PAGE = 3

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => !n.read)
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function markAsRead(id: number) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const typeIcon = (type: string) => {
    switch (type) {
      case 'update': return 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
      case 'alert': return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
      case 'info': return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      default: return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  }

  const typeColor = (type: string) => {
    switch (type) {
      case 'update': return 'bg-blue-50 text-blue-600'
      case 'alert': return 'bg-yellow-50 text-yellow-600'
      case 'info': return 'bg-slate-50 text-slate-600'
      default: return 'bg-slate-50 text-slate-600'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="text-slate-500">Notifications système et alertes</p>
        </div>
        <button onClick={markAllRead} className="btn-secondary text-sm">Tout marquer comme lu</button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => { setFilter('all'); setPage(1) }}
          className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${filter === 'all' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Toutes ({notifications.length})
        </button>
        <button
          onClick={() => { setFilter('unread'); setPage(1) }}
          className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${filter === 'unread' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Non lues ({notifications.filter((n) => !n.read).length})
        </button>
      </div>

      <div className="space-y-3">
        {paginated.map((notif) => (
          <div
            key={notif.id}
            className={`card cursor-pointer transition-colors ${!notif.read ? 'border-primary-200 bg-primary-50/30' : ''}`}
            onClick={() => markAsRead(notif.id)}
          >
            <div className="flex gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeColor(notif.type)}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={typeIcon(notif.type)} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-sm ${!notif.read ? 'font-semibold' : 'font-medium'} text-slate-800`}>{notif.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{notif.message}</p>
                  </div>
                  {!notif.read && <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0 ml-2 mt-1.5" />}
                </div>
                <p className="text-xs text-slate-400 mt-2">{new Date(notif.date).toLocaleString('fr-FR')}</p>
              </div>
            </div>
          </div>
        ))}

        {paginated.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Aucune notification
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary text-sm disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="text-sm text-slate-500">
            Page {page} sur {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary text-sm disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}
