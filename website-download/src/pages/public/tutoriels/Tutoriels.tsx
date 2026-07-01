import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiArrowLeft, HiClock, HiAcademicCap, HiLightBulb } from 'react-icons/hi2'
import SEOMeta from '@/components/seo/SEOMeta'
import { getTutorials, getTutorialBySlug } from '@/services/tutorialData'

const difficultyColors: Record<string, string> = {
  débutant: 'bg-green-500/20 text-green-400',
  intermédiaire: 'bg-yellow-500/20 text-yellow-400',
  avancé: 'bg-red-500/20 text-red-400',
}

export default function Tutoriels() {
  const { t } = useTranslation()
  const { slug } = useParams()

  if (slug) {
    const tutorial = getTutorialBySlug(slug)
    if (!tutorial) {
      return (
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="section-title">{t('common.error')}</h1>
            <Link to="/tutoriels" className="btn-primary">{t('common.back')}</Link>
          </div>
        </section>
      )
    }

    return (
      <>
        <SEOMeta title={tutorial.title} description={tutorial.description} path={`tutoriels/${slug}`} />
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/tutoriels" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors">
              <HiArrowLeft className="mr-2" /> {t('common.back')}
            </Link>
            <div className="card mb-8">
              <h1 className="text-2xl font-bold text-white mb-4">{tutorial.title}</h1>
              <p className="text-gray-400 mb-6">{tutorial.description}</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <span className={`text-xs px-2 py-1 rounded ${difficultyColors[tutorial.difficulty]}`}>
                  {tutorial.difficulty}
                </span>
                <span className="text-xs text-gray-400 flex items-center">
                  <HiClock className="mr-1" /> {tutorial.duration}
                </span>
              </div>
            </div>
            <div className="space-y-6">
              {tutorial.steps.map((step, i) => (
                <div key={i} className="card">
                  <div className="flex items-start">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 text-sm font-bold mr-4 shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-400 text-sm">{step.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    )
  }

  const tutorials = getTutorials()

  return (
    <>
      <SEOMeta title={t('nav.tutoriels')} description={t('tutorials.subtitle')} path="tutoriels" />
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">{t('tutorials.title')}</h1>
            <p className="section-subtitle">{t('tutorials.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tutorials.map((tut) => (
              <Link key={tut.id} to={`/tutoriels/${tut.slug}`} className="card-hover group">
                <div className="h-40 rounded-lg mb-4 overflow-hidden bg-gray-800">
                  <img src={tut.image} alt={tut.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${difficultyColors[tut.difficulty]}`}>
                    {tut.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <HiClock className="mr-1" /> {tut.duration}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">{tut.title}</h3>
                <p className="text-gray-400 text-sm">{tut.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
