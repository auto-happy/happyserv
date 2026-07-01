import { useTranslation } from 'react-i18next'
import SEOMeta from '@/components/seo/SEOMeta'

export default function Confidentialite() {
  const { t } = useTranslation()

  return (
    <>
      <SEOMeta title={t('legal.privacy.title')} description={t('legal.privacy.content')} path="confidentialite" />
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="section-title mb-8">{t('legal.privacy.title')}</h1>
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
            <p>{t('legal.privacy.content')}</p>
            <h2>1. Données collectées</h2>
            <p>Nous collectons les données suivantes : nom, adresse email, informations de profil, données d'utilisation de l'application.</p>
            <h2>2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour : fournir et améliorer nos services, personnaliser votre expérience, vous envoyer des notifications importantes.</p>
            <h2>3. Protection des données</h2>
            <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données personnelles contre tout accès non autorisé.</p>
            <h2>4. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à privacy@happyserv.app.</p>
          </div>
        </div>
      </section>
    </>
  )
}
