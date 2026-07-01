import { useTranslation } from 'react-i18next'
import { HiTrash, HiShieldCheck } from 'react-icons/hi2'

const mockUsers = [
  { name: 'Jean Dupont', email: 'jean@example.com', role: 'Admin', status: 'Actif' },
  { name: 'Marie Dubois', email: 'marie@example.com', role: 'Utilisateur', status: 'Actif' },
  { name: 'Thomas Martin', email: 'thomas@example.com', role: 'Utilisateur', status: 'Actif' },
  { name: 'Sophie Bernard', email: 'sophie@example.com', role: 'Utilisateur', status: 'Inactif' },
  { name: 'Lucas Petit', email: 'lucas@example.com', role: 'Utilisateur', status: 'Actif' },
]

export default function AdminUtilisateurs() {
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">{t('admin.users')}</h1>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-sm text-gray-400 pb-3 font-medium">Nom</th>
              <th className="text-left text-sm text-gray-400 pb-3 font-medium">Email</th>
              <th className="text-left text-sm text-gray-400 pb-3 font-medium">Rôle</th>
              <th className="text-left text-sm text-gray-400 pb-3 font-medium">Statut</th>
              <th className="text-right text-sm text-gray-400 pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((u) => (
              <tr key={u.email} className="border-b border-gray-800/50">
                <td className="py-3 text-sm text-white">{u.name}</td>
                <td className="py-3 text-sm text-gray-400">{u.email}</td>
                <td className="py-3 text-sm text-gray-400">{u.role}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${u.status === 'Actif' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{u.status}</span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-primary-400 hover:text-primary-300 transition-colors">
                      <HiShieldCheck className="w-4 h-4" />
                    </button>
                    <button className="text-red-400 hover:text-red-300 transition-colors">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
