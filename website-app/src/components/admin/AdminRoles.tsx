import { useState } from 'react'

interface Role {
  id: number
  name: string
  description: string
  permissions: string[]
  userCount: number
}

const mockRoles: Role[] = [
  { id: 1, name: 'Administrateur', description: 'Accès complet à toutes les fonctionnalités', permissions: ['all'], userCount: 2 },
  { id: 2, name: 'Utilisateur', description: 'Accès aux fonctionnalités de base', permissions: ['view_dashboard', 'view_licenses', 'view_devices'], userCount: 8 },
  { id: 3, name: 'Technicien', description: 'Accès au support technique et aux logs', permissions: ['view_dashboard', 'view_licenses', 'view_devices', 'view_logs'], userCount: 3 },
]

const allPermissions = [
  'view_dashboard', 'view_licenses', 'manage_licenses', 'view_devices', 'manage_devices',
  'view_stats', 'view_notifications', 'manage_users', 'manage_roles', 'view_logs', 'manage_settings',
  'manage_versions', 'all',
]

export default function AdminRoles() {
  const [roles] = useState<Role[]>(mockRoles)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestion des rôles</h1>
          <p className="text-slate-500">Définissez les permissions par rôle</p>
        </div>
        <button className="btn-primary">+ Nouveau rôle</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {roles.map((role) => (
          <div key={role.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800">{role.name}</h3>
                <p className="text-sm text-slate-500">{role.description}</p>
              </div>
              <span className="badge bg-slate-100 text-slate-600">{role.userCount} utilisateur(s)</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {role.permissions.map((perm) => (
                <span key={perm} className="badge bg-primary-50 text-primary-700">
                  {perm === 'all' ? 'Toutes les permissions' : perm.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Modifier</button>
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
