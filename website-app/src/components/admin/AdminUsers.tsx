import { useState } from 'react'

interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
}

const mockUsers: AdminUser[] = [
  { id: 1, name: 'Alice Martin', email: 'alice@example.com', role: 'admin', status: 'active', createdAt: '2026-01-15' },
  { id: 2, name: 'Bob Dupont', email: 'bob@example.com', role: 'user', status: 'active', createdAt: '2026-02-20' },
  { id: 3, name: 'Charlie Dubois', email: 'charlie@example.com', role: 'user', status: 'inactive', createdAt: '2026-03-10' },
  { id: 4, name: 'Diana Petit', email: 'diana@example.com', role: 'user', status: 'active', createdAt: '2026-04-05' },
  { id: 5, name: 'Eve Moreau', email: 'eve@example.com', role: 'admin', status: 'active', createdAt: '2026-05-01' },
]

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers)
  const [search, setSearch] = useState('')

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestion des utilisateurs</h1>
          <p className="text-slate-500">Administration des comptes</p>
        </div>
        <button className="btn-primary">+ Ajouter</button>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <input
            className="input-field max-w-xs"
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input-field max-w-[160px]">
            <option value="">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="user">Utilisateur</option>
          </select>
          <select className="input-field max-w-[160px]">
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500 font-medium">
                <th className="pb-3 pr-4">Nom</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Rôle</th>
                <th className="pb-3 pr-4">Statut</th>
                <th className="pb-3 pr-4">Créé le</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 pr-4 font-medium">{u.name}</td>
                  <td className="py-3 pr-4 text-slate-500">{u.email}</td>
                  <td className="py-3 pr-4">
                    <span className={`badge ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'}`}>
                      {u.role === 'admin' ? 'Admin' : 'Utilisateur'}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={u.status === 'active' ? 'badge-active' : 'badge-inactive'}>
                      {u.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium mr-3">Modifier</button>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">Suspendre</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-slate-400">Aucun utilisateur trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
