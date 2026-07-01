import { useTranslation } from 'react-i18next'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts'

const downloadData = [
  { month: 'Jan', downloads: 1200 },
  { month: 'Fév', downloads: 1900 },
  { month: 'Mar', downloads: 2800 },
  { month: 'Avr', downloads: 3200 },
  { month: 'Mai', downloads: 4100 },
  { month: 'Juin', downloads: 4800 },
]

const platformData = [
  { name: 'Windows', value: 45 },
  { name: 'macOS', value: 20 },
  { name: 'Linux', value: 15 },
  { name: 'Android', value: 12 },
  { name: 'iOS', value: 8 },
]

const COLORS = ['#6366f1', '#d946ef', '#06b6d4', '#22c55e', '#eab308']

export default function AdminStats() {
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">{t('admin.stats')}</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Téléchargements mensuels</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={downloadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="downloads" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Par plateforme</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={platformData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {platformData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card md:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Téléchargements par plateforme</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }} />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
