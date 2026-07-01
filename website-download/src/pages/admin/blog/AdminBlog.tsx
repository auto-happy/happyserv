import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi2'
import { getBlogPosts } from '@/services/blogData'

export default function AdminBlog() {
  const { t } = useTranslation()
  const [showEditor, setShowEditor] = useState(false)
  const posts = getBlogPosts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">{t('admin.blog')}</h1>
        <button onClick={() => setShowEditor(!showEditor)} className="btn-primary text-sm py-2 px-4 flex items-center">
          <HiPlus className="mr-1" /> Ajouter un article
        </button>
      </div>

      {showEditor && (
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Nouvel article</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Titre</label>
              <input type="text" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Contenu (Markdown)</label>
              <textarea rows={10} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 resize-none font-mono text-sm" />
            </div>
            <div className="flex space-x-3">
              <button className="btn-primary text-sm py-2 px-4">{t('admin.publish')}</button>
              <button className="btn-secondary text-sm py-2 px-4">{t('admin.draft')}</button>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-sm text-gray-400 pb-3 font-medium">Titre</th>
              <th className="text-left text-sm text-gray-400 pb-3 font-medium">Auteur</th>
              <th className="text-left text-sm text-gray-400 pb-3 font-medium">Date</th>
              <th className="text-right text-sm text-gray-400 pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-gray-800/50">
                <td className="py-3 text-sm text-white">{p.title}</td>
                <td className="py-3 text-sm text-gray-400">{p.author}</td>
                <td className="py-3 text-sm text-gray-400">{p.date}</td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-primary-400 hover:text-primary-300 transition-colors">
                      <HiPencil className="w-4 h-4" />
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
