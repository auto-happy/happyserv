import { useState } from 'react'

interface LogEntry {
  id: number
  date: string
  type: 'info' | 'warning' | 'error'
  user: string
  action: string
  details: string
  ip: string
}

const mockLogs: LogEntry[] = [
  { id: 1, date: '2026-06-30T18:00:00Z', type: 'info', user: 'Alice Martin', action: 'Connexion', details: 'Connexion réussie depuis le portail', ip: '192.168.1.10' },
  { id: 2, date: '2026-06-30T17:45:00Z', type: 'info', user: 'Bob Dupont', action: 'Mise à jour licence', details: 'Licence HS-DEF-456-UVW mise à jour', ip: '192.168.1.20' },
  { id: 3, date: '2026-06-30T16:30:00Z', type: 'warning', user: 'Charlie Dubois', action: 'Tentative connexion', details: 'Échec de connexion - mot de passe incorrect', ip: '10.0.0.55' },
  { id: 4, date: '2026-06-30T15:00:00Z', type: 'info', user: 'Système', action: 'Sauvegarde', details: 'Sauvegarde automatique terminée', ip: '-' },
  { id: 5, date: '2026-06-30T14:20:00Z', type: 'error', user: 'Système', action: 'Erreur API', details: 'Timeout sur endpoint /api/licenses/validate', ip: '-' },
  { id: 6, date: '2026-06-30T12:00:00Z', type: 'info', user: 'Admin', action: 'Publication version', details: 'Version 2.0.0 publiée', ip: '192.168.1.5' },
  { id: 7, date: '2026-06-30T08:15:00Z', type: 'warning', user: 'Système', action: 'Espace disque', details: 'Espace disque à 85% sur /var/lib/postgresql', ip: '-' },
]

const ITEMS_PER_PAGE = 5

export default function AdminLogs() {
  const [page, setPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState<string>('')

  const filtered = typeFilter ? mockLogs.filter((l) => l.type === typeFilter) : mockLogs
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const typeBadge = (type: string) => {
    switch (type) {
      case 'info': return <span className="badge bg-blue-100 text-blue-800">Info</span>
      case 'warning': return <span className="badge-warning">Avertissement</span>
      case 'error': return <span className="badge bg-red-100 text-red-800">Erreur</span>
      default: return <span className="badge-inactive">{type}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Journaux système</h1>
        <p className="text-slate-500">Historique des actions et événements</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <input className="input-field max-w-xs" placeholder="Rechercher..." />
          <select className="input-field max-w-[160px]" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}>
            <option value="">Tous les types</option>
            <option value="info">Info</option>
            <option value="warning">Avertissement</option>
            <option value="error">Erreur</option>
          </select>
          <input type="date" className="input-field max-w-[180px]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500 font-medium">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Utilisateur</th>
                <th className="pb-3 pr-4">Action</th>
                <th className="pb-3 pr-4">Détails</th>
                <th className="pb-3">IP</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((log) => (
                <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 pr-4 text-xs text-slate-500">{new Date(log.date).toLocaleString('fr-FR')}</td>
                  <td className="py-3 pr-4">{typeBadge(log.type)}</td>
                  <td className="py-3 pr-4 font-medium">{log.user}</td>
                  <td className="py-3 pr-4">{log.action}</td>
                  <td className="py-3 pr-4 text-slate-500 max-w-[250px] truncate">{log.details}</td>
                  <td className="py-3 text-xs font-mono text-slate-400">{log.ip}</td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-slate-400">Aucun journal trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-100">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-sm disabled:opacity-50">Précédent</button>
            <span className="text-sm text-slate-500">Page {page} sur {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary text-sm disabled:opacity-50">Suivant</button>
          </div>
        )}
      </div>
    </div>
  )
}
