import { useState, type FormEvent } from 'react'

interface Setting {
  key: string
  label: string
  type: 'text' | 'email' | 'toggle' | 'number'
  value: string | boolean | number
  description: string
}

const initialSettings: Setting[] = [
  { key: 'app_name', label: 'Nom de l\'application', type: 'text', value: 'HappyServ', description: 'Nom affiché dans l\'interface' },
  { key: 'support_email', label: 'Email de support', type: 'email', value: 'support@happyserv.com', description: 'Adresse email pour le support technique' },
  { key: 'maintenance_mode', label: 'Mode maintenance', type: 'toggle', value: false, description: 'Activer le mode maintenance (bloque les connexions)' },
  { key: 'max_devices_per_license', label: 'Appareils max par licence', type: 'number', value: 10, description: 'Nombre maximum d\'appareils autorisés par licence' },
  { key: 'session_timeout', label: 'Expiration de session (minutes)', type: 'number', value: 60, description: 'Durée avant expiration automatique de la session' },
  { key: 'allow_registration', label: 'Inscription libre', type: 'toggle', value: true, description: 'Permettre aux nouveaux utilisateurs de s\'inscrire librement' },
]

export default function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>(initialSettings)
  const [saved, setSaved] = useState(false)

  function handleChange(key: string, value: string | boolean | number) {
    setSettings((prev) => prev.map((s) => s.key === key ? { ...s, value } : s))
    setSaved(false)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    await new Promise((r) => setTimeout(r, 500))
    setSaved(true)
  }

  function handleReset(key: string) {
    const original = initialSettings.find((s) => s.key === key)
    if (original) handleChange(key, original.value)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Paramètres</h1>
        <p className="text-slate-500">Configuration globale de l'application</p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">
          Paramètres enregistrés avec succès.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {settings.map((setting) => (
          <div key={setting.key} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-800 mb-1">{setting.label}</label>
                <p className="text-xs text-slate-400 mb-2">{setting.description}</p>

                {setting.type === 'toggle' ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={setting.value as boolean}
                      onChange={(e) => handleChange(setting.key, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                  </label>
                ) : (
                  <input
                    type={setting.type}
                    className="input-field max-w-md"
                    value={setting.value as string | number}
                    onChange={(e) => handleChange(setting.key, setting.type === 'number' ? Number(e.target.value) : e.target.value)}
                  />
                )}
              </div>
              <button type="button" onClick={() => handleReset(setting.key)} className="text-xs text-slate-400 hover:text-slate-600 ml-3 shrink-0">
                Réinitialiser
              </button>
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Enregistrer</button>
          <button type="button" onClick={() => setSettings([...initialSettings])} className="btn-secondary">Réinitialiser tout</button>
        </div>
      </form>
    </div>
  )
}
