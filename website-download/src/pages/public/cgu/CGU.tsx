import { useTranslation } from 'react-i18next'
import SEOMeta from '@/components/seo/SEOMeta'

export default function CGU() {
  const { t } = useTranslation()

  return (
    <>
      <SEOMeta title={t('legal.terms.title')} description={t('legal.terms.content')} path="conditions-utilisation" />
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="section-title mb-8">{t('legal.terms.title')}</h1>
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
            <p>{t('legal.terms.content')}</p>
            <h2>1. Acceptation des conditions</h2>
            <p>En utilisant l'application HappyServ, vous acceptez les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'application.</p>
            <h2>2. Description du service</h2>
            <p>HappyServ est une application d'aide à l'apprentissage de la conduite qui propose des fonctionnalités de planification, de suivi et d'entraînement.</p>
            <h2>3. Compte utilisateur</h2>
            <p>Vous êtes responsable de la confidentialité de votre compte et de votre mot de passe. Vous vous engagez à informer HappyServ de toute utilisation non autorisée de votre compte.</p>
            <h2>4. Limitation de responsabilité</h2>
            <p>HappyServ ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation de l'application.</p>
          </div>
        </div>
      </section>
    </>
  )
}
