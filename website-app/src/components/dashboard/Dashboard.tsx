import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const statsCards = [
  { label: 'Licences actives', value: '24', change: '+3', changeType: 'up', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { label: 'Appareils connectés', value: '47', change: '+8', changeType: 'up', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { label: 'Notifications', value: '5', change: '-2', changeType: 'down', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { label: 'Utilisateurs', value: '12', change: '0', changeType: 'neutral', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
]

const activityData = [
  { name: 'Lun', connexions: 12, licences: 8 },
  { name: 'Mar', connexions: 19, licences: 15 },
  { name: 'Mer', connexions: 3, licences: 10 },
  { name: 'Jeu', connexions: 5, licences: 7 },
  { name: 'Ven', connexions: 2, licences: 6 },
  { name: 'Sam', connexions: 3, licences: 4 },
  { name: 'Dim', connexions: 7, licences: 9 },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
        <p className="text-slate-500">Bienvenue sur votre portail HappyServ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div key={card.label} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
              </div>
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <span className={`text-sm font-medium ${
                card.changeType === 'up' ? 'text-green-600' : card.changeType === 'down' ? 'text-red-600' : 'text-slate-400'
              }`}>
                {card.change} cette semaine
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Activité récente</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip />
            <Bar dataKey="connexions" name="Connexions" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="licences" name="Licences" fill="#0d9488" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
