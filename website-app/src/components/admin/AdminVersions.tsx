import { useState, type FormEvent } from 'react'

interface Version {
  id: number
  version: string
  channel: 'stable' | 'beta' | 'alpha'
  releaseDate: string
  size: string
  changelog: string
  downloads: number
}

const mockVersions: Version[] = [
  { id: 1, version: '2.1.0', channel: 'beta', releaseDate: '2026-06-28', size: '24.5 MB', changelog: 'Ajout du support IPv6, correction bugs de synchronisation', downloads: 156 },
  { id: 2, version: '2.0.0', channel: 'stable', releaseDate: '2026-06-15', size: '24.2 MB', changelog: 'Nouvelle interface, optimisation performances, sécurité renforcée', downloads: 1250 },
  { id: 3, version: '1.2.3', channel: 'stable', releaseDate: '2026-05-20', size: '23.8 MB', changelog: 'Corrections de sécurité, amélioration stabilité', downloads: 3400 },
  { id: 4, version: '1.2.2', channel: 'stable', releaseDate: '2026-04-10', size: '23.7 MB', changelog: 'Correction bug connexion, mise à jour dépendances', downloads: 5200 },
  { id: 5, version: '1.3.0', channel: 'alpha', releaseDate: '2026-06-01', size: '24.0 MB', changelog: 'Nouveau moteur de synchronisation, refactoring API', downloads: 45 },
]

export default function AdminVersions() {
  const [versions, setVersions] = useState<Version[]>(mockVersions)
  const [showForm, setShowForm] = useState(false)
  const [newVersion, setNewVersion] = useState({ version: '', channel: 'stable' as const, changelog: '' })
  const [file, setFile] = useState<File | null>(null)

  async function handlePublish(e: FormEvent) {
    e.preventDefault()
    const entry: Version = {
      id: versions.length + 1,
      version: newVersion.version,
      channel: newVersion.channel,
      releaseDate: new Date().toISOString().split('T')[0],
      size: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : '0 MB',
      changelog: newVersion.changelog,
      downloads: 0,
    }
    setVersions([entry, ...versions])
    setShowForm(false)
    setNewVersion({ version: '', channel: 'stable', changelog: '' })
    setFile(null)
  }

  const channelBadge = (channel: string) => {
    switch (channel) {
      case 'stable': return <span className="badge-active">Stable</span>
      case 'beta': return <span className="badge-warning">Beta</span>
      case 'alpha': return <span className="badge bg-purple-100 text-purple-800">Alpha</span>
      default: return <span className="badge-inactive">{channel}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestion des versions</h1>
          <p className="text-slate-500">Publier et gérer les versions de l'application</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Annuler' : '+ Publier une version'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Publier une nouvelle version</h2>
          <form onSubmit={handlePublish} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Version</label>
              <input className="input-field" placeholder="2.1.0" value={newVersion.version} onChange={(e) => setNewVersion({ ...newVersion, version: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Canal</label>
              <select className="input-field" value={newVersion.channel} onChange={(e) => setNewVersion({ ...newVersion, channel: e.target.value as any })}>
                <option value="stable">Stable</option>
                <option value="beta">Beta</option>
                <option value="alpha">Alpha</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fichier ( .tar.gz / .zip )</label>
              <input type="file" className="input-field" onChange={(e) => setFile(e.target.files?.[0] || null)} accept=".tar.gz,.zip" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes de version</label>
              <textarea className="input-field h-24" placeholder="Corrections, nouvelles fonctionnalités..." value={newVersion.changelog} onChange={(e) => setNewVersion({ ...newVersion, changelog: e.target.value })} required />
            </div>
            <button type="submit" className="btn-primary">Publier</button>
          </form>
        </div>
      )}

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500 font-medium">
                <th className="pb-3 pr-4">Version</th>
                <th className="pb-3 pr-4">Canal</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Taille</th>
                <th className="pb-3 pr-4">Téléchargements</th>
                <th className="pb-3 pr-4">Notes</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((v) => (
                <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 pr-4 font-mono font-medium">v{v.version}</td>
                  <td className="py-3 pr-4">{channelBadge(v.channel)}</td>
                  <td className="py-3 pr-4 text-slate-500">{new Date(v.releaseDate).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 pr-4 text-slate-500">{v.size}</td>
                  <td className="py-3 pr-4">{v.downloads.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-slate-500 max-w-[250px] truncate">{v.changelog}</td>
                  <td className="py-3">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium mr-3">Modifier</button>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">Archiver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
