import { useState } from 'react'

interface Device {
  id: number
  name: string
  os: string
  version: string
  lastSeen: string
  status: 'online' | 'offline'
}

const mockDevices: Device[] = [
  { id: 1, name: 'Serveur Principal', os: 'Linux Ubuntu 22.04', version: '1.2.3', lastSeen: '2026-06-30T18:00:00Z', status: 'online' },
  { id: 2, name: 'NAS Backup', os: 'Linux Debian 12', version: '1.2.1', lastSeen: '2026-06-29T14:30:00Z', status: 'offline' },
  { id: 3, name: 'VM Staging', os: 'Linux Ubuntu 24.04', version: '1.3.0', lastSeen: '2026-06-30T17:45:00Z', status: 'online' },
  { id: 4, name: 'Raspberry Pi 5', os: 'Raspbian 12', version: '1.1.0', lastSeen: '2026-06-28T09:15:00Z', status: 'offline' },
]

export default function Devices() {
  const [devices] = useState<Device[]>(mockDevices)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Appareils</h1>
          <p className="text-slate-500">Appareils connectés à votre compte</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map((device) => (
          <div key={device.id} className="card-hover">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 ${device.status === 'online' ? 'bg-green-500' : 'bg-slate-300'}`} />
                <div>
                  <h3 className="font-semibold text-slate-800">{device.name}</h3>
                  <p className="text-sm text-slate-500">{device.os}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Dernière connexion : {new Date(device.lastSeen).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium ${device.status === 'online' ? 'text-green-600' : 'text-slate-400'}`}>
                  {device.status === 'online' ? 'En ligne' : 'Hors ligne'}
                </span>
                <p className="text-xs text-slate-400 mt-1">v{device.version}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
              <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">Détails</button>
              <button className="text-xs text-red-600 hover:text-red-700 font-medium">Révoquer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
