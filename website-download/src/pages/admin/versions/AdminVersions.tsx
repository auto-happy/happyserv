import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiPlus, HiTrash, HiCheckCircle } from 'react-icons/hi2'
import { getVersions, platforms } from '@/services/downloadData'

export default function AdminVersions() {
  const { t } = useTranslation()
  const [showAdd, setShowAdd] = useState(false)
  const versions = getVersions()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">{t('admin.versions')}</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-sm py-2 px-4 flex items-center">
          <HiPlus className="mr-1" /> {t('admin.addVersion')}
        </button>
      </div>

      {showAdd && (
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">{t('admin.addVersion')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t('admin.versionName')}</label>
              <input type="text" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500" placeholder="2.3.0" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t('admin.platform')}</label>
              <select className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500">
                {platforms.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t('admin.file')}</label>
              <input type="file" className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-800 file:text-white" />
            </div>
          </div>
          <button className="btn-primary text-sm py-2 px-4">
            <HiCheckCircle className="inline mr-1" /> {t('admin.publish')}
          </button>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-sm text-gray-400 pb-3 font-medium">{t('admin.versionName')}</th>
              <th className="text-left text-sm text-gray-400 pb-3 font-medium">{t('admin.platform')}</th>
              <th className="text-left text-sm text-gray-400 pb-3 font-medium">{t('admin.file')}</th>
              <th className="text-right text-sm text-gray-400 pb-3 font-medium">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {versions.map((v) => (
              <tr key={v.id} className="border-b border-gray-800/50">
                <td className="py-3 text-sm text-white">v{v.version}</td>
                <td className="py-3 text-sm text-gray-400">{v.platform}</td>
                <td className="py-3 text-sm text-gray-400">{v.filename}</td>
                <td className="py-3 text-right">
                  <button className="text-red-400 hover:text-red-300 transition-colors">
                    <HiTrash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
