import { useTranslation } from 'react-i18next'
import { HiLightBulb, HiGlobeAlt, HiUsers } from 'react-icons/hi2'
import SEOMeta from '@/components/seo/SEOMeta'

export default function APropos() {
  const { t } = useTranslation()

  return (
    <>
      <SEOMeta title={t('nav.aPropos')} description={t('about.subtitle')} path="a-propos" />

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">{t('about.title')}</h1>
            <p className="section-subtitle">{t('about.subtitle')}</p>
          </div>

          <div className="card mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">{t('about.story.title')}</h2>
            <p className="text-gray-400 leading-relaxed">{t('about.story.content')}</p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-8 text-center">{t('about.values.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="card-hover text-center">
              <HiLightBulb className="w-10 h-10 text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t('about.values.items.innovation.title')}</h3>
              <p className="text-gray-400 text-sm">{t('about.values.items.innovation.desc')}</p>
            </div>
            <div className="card-hover text-center">
              <HiGlobeAlt className="w-10 h-10 text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t('about.values.items.accessibility.title')}</h3>
              <p className="text-gray-400 text-sm">{t('about.values.items.accessibility.desc')}</p>
            </div>
            <div className="card-hover text-center">
              <HiUsers className="w-10 h-10 text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t('about.values.items.community.title')}</h3>
              <p className="text-gray-400 text-sm">{t('about.values.items.community.desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
