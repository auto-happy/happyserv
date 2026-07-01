import { useState, type FormEvent } from 'react'
import { useAuth } from '../../AuthContext'

export default function Profile() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleUpdateInfo(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ name, email }),
      })
      if (!res.ok) throw new Error('Erreur lors de la mise à jour')
      setSaved(true)
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (!res.ok) throw new Error('Erreur lors du changement de mot de passe')
      setSaved(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profil</h1>
        <p className="text-slate-500">Gérez vos informations personnelles</p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">
          Modifications enregistrées avec succès.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Informations</h2>
        <form onSubmit={handleUpdateInfo} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
            <input className="input-field bg-slate-50" value={user?.role || ''} disabled />
          </div>
          <button type="submit" className="btn-primary">Enregistrer</button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Changer le mot de passe</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe actuel</label>
            <input type="password" className="input-field" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe</label>
            <input type="password" className="input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirmer le mot de passe</label>
            <input type="password" className="input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary">Changer le mot de passe</button>
        </form>
      </div>
    </div>
  )
}
