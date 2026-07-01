import { useTranslation } from 'react-i18next'
import SEOMeta from '@/components/seo/SEOMeta'

const screenshots = [
  { title: 'Tableau de bord', desc: 'Vue d\'ensemble de votre progression', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600' },
  { title: 'Planning intelligent', desc: 'Organisez vos séances', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600' },
  { title: 'Statistiques', desc: 'Analysez votre progression', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600' },
  { title: 'Leçons interactives', desc: 'Apprenez à votre rythme', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600' },
  { title: 'Mode hors-ligne', desc: 'Continuez sans connexion', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600' },
  { title: 'Communauté', desc: 'Échangez avec d\'autres apprenants', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600' },
]

export default function Captures() {
  const { t } = useTranslation()

  return (
    <>
      <SEOMeta title={t('nav.captures')} description={t('screenshots.subtitle')} path="captures" />

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">{t('screenshots.title')}</h1>
            <p className="section-subtitle">{t('screenshots.subtitle')}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {screenshots.map((s) => (
              <div key={s.title} className="card-hover group">
                <div className="rounded-lg overflow-hidden mb-4 aspect-video bg-gray-800">
                  <img src={s.url} alt={s.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-white font-semibold mb-1">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
