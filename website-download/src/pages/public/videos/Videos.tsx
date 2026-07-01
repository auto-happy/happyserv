import { useTranslation } from 'react-i18next'
import SEOMeta from '@/components/seo/SEOMeta'

const videos = [
  { title: 'Présentation de HappyServ', desc: 'Découvrez l\'application en 2 minutes', id: 'dQw4w9WgXcQ' },
  { title: 'Tutoriel : Premiers pas', desc: 'Configurez votre compte et démarrez', id: 'dQw4w9WgXcQ' },
  { title: 'Fonctionnalités avancées', desc: 'Maîtrisez toutes les options', id: 'dQw4w9WgXcQ' },
]

export default function Videos() {
  const { t } = useTranslation()

  return (
    <>
      <SEOMeta title={t('nav.videos')} description={t('videos.subtitle')} path="videos" />

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">{t('videos.title')}</h1>
            <p className="section-subtitle">{t('videos.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <div key={v.title} className="card-hover">
                <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-gray-800">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h3 className="text-white font-semibold mb-1">{v.title}</h3>
                <p className="text-gray-400 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
