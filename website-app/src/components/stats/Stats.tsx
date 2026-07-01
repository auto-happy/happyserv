import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts'

const downloadsData = [
  { name: 'Jan', downloads: 400, updates: 240 },
  { name: 'Fév', downloads: 300, updates: 139 },
  { name: 'Mar', downloads: 200, updates: 980 },
  { name: 'Avr', downloads: 278, updates: 390 },
  { name: 'Mai', downloads: 189, updates: 480 },
  { name: 'Juin', downloads: 239, updates: 380 },
  { name: 'Juil', downloads: 349, updates: 430 },
]

const usersData = [
  { name: 'Lun', actifs: 12 },
  { name: 'Mar', actifs: 19 },
  { name: 'Mer', actifs: 15 },
  { name: 'Jeu', actifs: 17 },
  { name: 'Ven', actifs: 14 },
  { name: 'Sam', actifs: 8 },
  { name: 'Dim', actifs: 10 },
]

const versionsData = [
  { name: 'v1.0', value: 35 },
  { name: 'v1.1', value: 25 },
  { name: 'v1.2', value: 20 },
  { name: 'v2.0', value: 15 },
  { name: 'v2.1', value: 5 },
]

const COLORS = ['#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a']

export default function Stats() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Statistiques</h1>
        <p className="text-slate-500">Analyse d'utilisation détaillée</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Téléchargements par mois</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={downloadsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="downloads" name="Téléchargements" stroke="#14b8a6" strokeWidth={2} dot={{ fill: '#14b8a6' }} />
              <Line type="monotone" dataKey="updates" name="Mises à jour" stroke="#0d9488" strokeWidth={2} dot={{ fill: '#0d9488' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Utilisateurs actifs / jour</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Bar dataKey="actifs" name="Utilisateurs actifs" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Répartition par version</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={versionsData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" nameKey="name" label>
                {versionsData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
