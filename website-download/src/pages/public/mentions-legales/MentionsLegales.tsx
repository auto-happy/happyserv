import { useTranslation } from 'react-i18next'
import SEOMeta from '@/components/seo/SEOMeta'

export default function MentionsLegales() {
  const { t } = useTranslation()

  return (
    <>
      <SEOMeta title={t('legal.mentions.title')} description={t('legal.mentions.content')} path="mentions-legales" />
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="section-title mb-8">{t('legal.mentions.title')}</h1>
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
            <p>{t('legal.mentions.content')}</p>
            <h2>1. Édition du site</h2>
            <p>Le site HappyServ est édité par HappyServ SAS, société par actions simplifiée au capital de 10 000 €, immatriculée au RCS de Paris sous le numéro 123 456 789.</p>
            <p>Siège social : 123 Rue de l'Innovation, 75001 Paris, France.</p>
            <p>Numéro de TVA intracommunautaire : FR12345678901.</p>
            <h2>2. Directeur de la publication</h2>
            <p>Le directeur de la publication est Jean Dupont.</p>
            <h2>3. Hébergement</h2>
            <p>Le site est hébergé par Netlify, Inc. - 44 Montgomery Street, Suite 300, San Francisco, CA 94104, États-Unis.</p>
            <h2>4. Propriété intellectuelle</h2>
            <p>L'ensemble des contenus présents sur le site HappyServ (textes, images, vidéos, logos, etc.) est protégé par le droit d'auteur et la propriété intellectuelle. Toute reproduction ou représentation est interdite sans autorisation préalable.</p>
          </div>
        </div>
      </section>
    </>
  )
}
