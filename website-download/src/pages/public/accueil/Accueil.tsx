import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiChartBar, HiUsers, HiStar, HiClock, HiShieldCheck, HiAcademicCap } from 'react-icons/hi2'
import { HiDownload, HiGlobe } from 'react-icons/hi'
import SEOMeta from '@/components/seo/SEOMeta'

const features = [
  { icon: HiClock, key: 'planning' },
  { icon: HiChartBar, key: 'tracking' },
  { icon: HiUsers, key: 'community' },
  { icon: HiShieldCheck, key: 'offline' },
]

const testimonials = [
  { name: 'Sophie M.', text: 'HappyServ m\'a vraiment aidée à réussir mon permis du premier coup !', rating: 5 },
  { name: 'Thomas L.', text: 'Application géniale, le planning intelligent est super pratique.', rating: 5 },
  { name: 'Emma R.', text: 'Je recommande à tous mes amis qui préparent le permis.', rating: 5 },
]

export default function Accueil() {
  const { t } = useTranslation()

  return (
    <>
      <SEOMeta title={t('nav.accueil')} description={t('hero.subtitle')} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/telechargement" className="btn-download text-lg">
                <HiDownload className="inline-block mr-2 -mt-0.5" />
                {t('hero.cta')}
              </Link>
              <Link to="/documentation" className="btn-secondary text-lg">
                {t('hero.secondary')}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { icon: HiDownload, label: 'hero.stats.downloads', value: '50K+' },
              { icon: HiUsers, label: 'hero.stats.users', value: '10K+' },
              { icon: HiStar, label: 'hero.stats.rating', value: '4.8/5' },
              { icon: HiGlobe, label: 'hero.stats.countries', value: '45+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4">
                <stat.icon className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{t(stat.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">{t('features.title')}</h2>
            <p className="section-subtitle">{t('features.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => {
              const featData = t(`features.items.${feat.key}`, { returnObjects: true }) as { title: string; desc: string }
              return (
                <div key={feat.key} className="card-hover text-center">
                  <feat.icon className="w-10 h-10 text-primary-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{featData.title}</h3>
                  <p className="text-gray-400 text-sm">{featData.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Ce que disent nos utilisateurs</h2>
            <p className="section-subtitle">Des milliers d'apprenants nous font confiance</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card">
                <div className="flex text-yellow-400 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <HiStar key={i} className="w-5 h-5" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{t.text}"</p>
                <p className="text-white font-semibold">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title">Prêt à commencer ?</h2>
          <p className="section-subtitle mb-8">Téléchargez HappyServ gratuitement et commencez votre apprentissage dès aujourd'hui.</p>
          <Link to="/telechargement" className="btn-download text-lg inline-flex items-center">
            <HiDownload className="mr-2" />
            {t('hero.cta')}
          </Link>
        </div>
      </section>
    </>
  )
}
