import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiArrowLeft, HiBookOpen } from 'react-icons/hi2'
import SEOMeta from '@/components/seo/SEOMeta'
import { getDocSections, getDocSectionBySlug, getDocSectionsByCategory } from '@/services/docData'

const categoryLabels: Record<string, string> = {
  gettingStarted: 'doc.categories.gettingStarted',
  features: 'doc.categories.features',
  advanced: 'doc.categories.advanced',
  troubleshooting: 'doc.categories.troubleshooting',
}

export default function Documentation() {
  const { t } = useTranslation()
  const { slug } = useParams()

  if (slug) {
    const section = getDocSectionBySlug(slug)
    if (!section) {
      return (
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="section-title">{t('common.error')}</h1>
            <p className="text-gray-400 mb-6">Section non trouvée</p>
            <Link to="/documentation" className="btn-primary">{t('common.back')}</Link>
          </div>
        </section>
      )
    }

    return (
      <>
        <SEOMeta title={section.title} description={section.content.slice(0, 150)} path={`documentation/${slug}`} />
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/documentation" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors">
              <HiArrowLeft className="mr-2" /> {t('common.back')}
            </Link>
            <div className="prose prose-invert max-w-none">
              <h1 className="text-3xl font-bold text-white mb-4">{section.title}</h1>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">{section.content}</div>
            </div>
          </div>
        </section>
      </>
    )
  }

  const categories = [...new Set(getDocSections().map((s) => s.category))]

  return (
    <>
      <SEOMeta title={t('nav.documentation')} description={t('doc.subtitle')} path="documentation" />
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">{t('doc.title')}</h1>
            <p className="section-subtitle">{t('doc.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((cat) => {
              const sections = getDocSectionsByCategory(cat)
              return (
                <div key={cat} className="card">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <HiBookOpen className="mr-2 text-primary-400" />
                    {t(categoryLabels[cat] || cat)}
                  </h3>
                  <ul className="space-y-2">
                    {sections.sort((a, b) => a.order - b.order).map((s) => (
                      <li key={s.id}>
                        <Link to={`/documentation/${s.slug}`} className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
