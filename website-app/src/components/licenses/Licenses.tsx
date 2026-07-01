import { useState } from 'react'

interface License {
  id: number
  key: string
  type: string
  status: 'active' | 'expired' | 'suspended'
  expiresAt: string
  deviceLimit: number
  usedDevices: number
}

const mockLicenses: License[] = [
  { id: 1, key: 'HS-ABC-123-XYZ', type: 'Premium', status: 'active', expiresAt: '2026-12-31', deviceLimit: 5, usedDevices: 3 },
  { id: 2, key: 'HS-DEF-456-UVW', type: 'Standard', status: 'active', expiresAt: '2026-10-15', deviceLimit: 3, usedDevices: 2 },
  { id: 3, key: 'HS-GHI-789-RST', type: 'Basic', status: 'expired', expiresAt: '2026-01-01', deviceLimit: 1, usedDevices: 1 },
  { id: 4, key: 'HS-JKL-012-MNO', type: 'Premium', status: 'suspended', expiresAt: '2027-03-20', deviceLimit: 10, usedDevices: 0 },
]

export default function Licenses() {
  const [licenses] = useState<License[]>(mockLicenses)
  const [search, setSearch] = useState('')

  const filtered = licenses.filter((l) =>
    l.key.toLowerCase().includes(search.toLowerCase()) ||
    l.type.toLowerCase().includes(search.toLowerCase())
  )

  const statusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="badge-active">Active</span>
      case 'expired': return <span className="badge-inactive">Expirée</span>
      case 'suspended': return <span className="badge-warning">Suspendue</span>
      default: return <span className="badge-inactive">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Licences</h1>
          <p className="text-slate-500">Gérez vos licences HappyServ</p>
        </div>
        <button className="btn-primary">+ Nouvelle licence</button>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <input
            className="input-field max-w-xs"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input-field max-w-[160px]">
            <option value="">Tous les types</option>
            <option value="Premium">Premium</option>
            <option value="Standard">Standard</option>
            <option value="Basic">Basic</option>
          </select>
          <select className="input-field max-w-[160px]">
            <option value="">Tous les statuts</option>
            <option value="active">Active</option>
            <option value="expired">Expirée</option>
            <option value="suspended">Suspendue</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500 font-medium">
                <th className="pb-3 pr-4">Clé</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Statut</th>
                <th className="pb-3 pr-4">Expire le</th>
                <th className="pb-3 pr-4">Appareils</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((license) => (
                <tr key={license.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 pr-4 font-mono text-xs">{license.key}</td>
                  <td className="py-3 pr-4">{license.type}</td>
                  <td className="py-3 pr-4">{statusBadge(license.status)}</td>
                  <td className="py-3 pr-4">{new Date(license.expiresAt).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 pr-4">{license.usedDevices}/{license.deviceLimit}</td>
                  <td className="py-3">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium mr-3">Modifier</button>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">Révoquer</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-slate-400">Aucune licence trouvée</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
