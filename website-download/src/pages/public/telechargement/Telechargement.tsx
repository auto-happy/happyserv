import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { HiCheckCircle, HiShieldCheck } from 'react-icons/hi2'
import { HiDownload, HiCode } from 'react-icons/hi'
import SEOMeta from '@/components/seo/SEOMeta'
import { platforms, getVersionsByPlatform, getLatestVersion, getPlatformFromUserAgent, getDownloadUrl } from '@/services/downloadData'

export default function Telechargement() {
  const { t } = useTranslation()
  const [selectedPlatform, setSelectedPlatform] = useState(getPlatformFromUserAgent())
  const [selectedType, setSelectedType] = useState<'stable' | 'beta'>('stable')

  useEffect(() => {
    setSelectedPlatform(getPlatformFromUserAgent())
  }, [])

  const versions = getVersionsByPlatform(selectedPlatform).filter((v) => v.type === selectedType)
  const latest = getLatestVersion(selectedPlatform, selectedType)

  const copySha256 = (sha: string) => {
    navigator.clipboard.writeText(sha)
  }

  return (
    <>
      <SEOMeta title={t('nav.telechargement')} description={t('download.subtitle')} path="telechargement" />

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="section-title">{t('download.title')}</h1>
            <p className="section-subtitle">{t('download.subtitle')}</p>
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-400 mb-3 font-medium">{t('download.choosePlatform')}</p>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    selectedPlatform === p.id ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 mb-8">
            {(['stable', 'beta'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedType === type ? 'bg-secondary-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {type === 'stable' ? t('download.stable') : t('download.beta')}
              </button>
            ))}
          </div>

          {latest && (
            <div className="card mb-8 border-primary-500/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">HappyServ v{latest.version}</h3>
                  <p className="text-sm text-gray-400">{t('download.size')} : {latest.size}</p>
                </div>
                {latest.size !== 'N/A' ? (
                  <a
                    href={getDownloadUrl(latest)}
                    className="btn-download inline-flex items-center"
                  >
                    <HiDownload className="mr-2" />
                    {t('download.download')}
                  </a>
                ) : (
                  <span className="bg-gray-800 text-gray-500 rounded-lg px-4 py-2.5 text-sm font-medium">
                    {t('download.comingSoon')}
                  </span>
                )}
              </div>

              {latest.sha256 !== 'N/A' && (
              <div className="bg-gray-950 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400 flex items-center">
                    <HiShieldCheck className="mr-1 text-green-400" />
                    {t('download.sha256')}
                  </span>
                  <button onClick={() => copySha256(latest.sha256)} className="text-xs text-primary-400 hover:text-primary-300">
                    <HiCode className="inline-block mr-1" />
                    Copy
                  </button>
                </div>
                <code className="text-xs text-gray-500 break-all">{latest.sha256}</code>
              </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-white mb-2">{t('download.releaseNotes')} - v{latest.changelog.version}</h4>
                <p className="text-xs text-gray-500 mb-2">{latest.changelog.date}</p>
                <ul className="space-y-1">
                  {latest.changelog.items.map((item, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-400">
                      <HiCheckCircle className="text-green-400 mr-2 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {versions.filter((v) => v.version !== latest?.version).map((v) => (
            <div key={v.id} className="card mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">v{v.version}</h4>
                  <p className="text-xs text-gray-500">{v.releaseDate} - {v.size}</p>
                </div>
                {v.size !== 'N/A' ? (
                  <a href={getDownloadUrl(v)} className="btn-secondary text-sm py-2 px-4">
                    {t('download.download')}
                  </a>
                ) : (
                  <span className="text-xs text-gray-500">{t('download.comingSoon')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
