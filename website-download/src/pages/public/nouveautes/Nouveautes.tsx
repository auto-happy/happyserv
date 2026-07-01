import { useTranslation } from 'react-i18next'
import { HiCheckCircle } from 'react-icons/hi2'
import SEOMeta from '@/components/seo/SEOMeta'
import { getVersions } from '@/services/downloadData'

export default function Nouveautes() {
  const { t } = useTranslation()
  const versions = getVersions()
    .filter((v, i, arr) => arr.findIndex((x) => x.version === v.version) === i)
    .sort((a, b) => b.version.localeCompare(a.version))

  return (
    <>
      <SEOMeta title={t('nav.nouveautes')} description={t('news.subtitle')} path="nouveautes" />

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">{t('news.title')}</h1>
            <p className="section-subtitle">{t('news.subtitle')}</p>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800" />
            <div className="space-y-12">
              {versions.map((v) => (
                <div key={v.version} className="relative pl-12">
                  <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary-500 border-2 border-gray-950" />
                  <div className="card">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">v{v.version}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${v.type === 'stable' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {v.type === 'stable' ? t('download.stable') : t('download.beta')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{v.changelog.date}</p>
                    <ul className="space-y-2">
                      {v.changelog.items.map((item, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-400">
                          <HiCheckCircle className="text-green-400 mr-2 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
