import { Tutorial } from '@/types'

const tutorials: Tutorial[] = [
  {
    id: '1',
    slug: 'demarrage-rapide',
    title: 'Démarrage rapide',
    description: 'Configurez HappyServ et faites vos premiers pas en moins de 10 minutes.',
    difficulty: 'débutant',
    duration: '10 minutes',
    steps: [
      { title: 'Téléchargement et installation', content: 'Rendez-vous sur notre page de téléchargement et installez HappyServ sur votre appareil. Suivez les instructions à l\'écran.' },
      { title: 'Création de compte', content: 'Lancez l\'application et créez un compte en remplissant vos informations. Validez votre adresse email.' },
      { title: 'Configuration initiale', content: 'Répondez aux questions de configuration pour personnaliser votre expérience : objectifs, niveau, préférences.' },
      { title: 'Première leçon', content: 'Accédez à votre première leçon et découvrez l\'interface. Le guide interactif vous accompagne pas à pas.' },
    ],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
  },
  {
    id: '2',
    slug: 'fonctionnalites-avancees',
    title: 'Fonctionnalités avancées',
    description: 'Maîtrisez toutes les fonctionnalités avancées de HappyServ pour optimiser votre apprentissage.',
    difficulty: 'intermédiaire',
    duration: '15 minutes',
    steps: [
      { title: 'Planning intelligent', content: 'Découvrez comment le planning intelligent analyse vos disponibilités et suggère les meilleurs créneaux d\'entraînement.' },
      { title: 'Statistiques détaillées', content: 'Explorez vos statistiques de progression : graphiques, tendances, points forts et axes d\'amélioration.' },
      { title: 'Synchronisation multi-appareils', content: 'Configurez la synchronisation entre vos différents appareils pour retrouver votre progression partout.' },
      { title: 'Personnalisation de l\'interface', content: 'Personnalisez l\'apparence de l\'application avec les thèmes et les options d\'affichage.' },
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
  },
  {
    id: '3',
    slug: 'parametres-securite',
    title: 'Configurer les paramètres de sécurité',
    description: 'Protégez vos données et votre compte HappyServ avec les paramètres de sécurité avancés.',
    difficulty: 'avancé',
    duration: '8 minutes',
    steps: [
      { title: 'Mot de passe fort', content: 'Choisissez un mot de passe sécurisé contenant au moins 12 caractères avec des lettres, chiffres et symboles.' },
      { title: 'Authentification à deux facteurs', content: 'Activez l\'authentification à deux facteurs pour renforcer la sécurité de votre compte.' },
      { title: 'Gestion des sessions', content: 'Consultez et gérez les sessions actives sur vos différents appareils. Déconnectez les sessions inactives.' },
      { title: 'Confidentialité des données', content: 'Configurez vos préférences de confidentialité : partage de données, collecte télémétrique, export de données.' },
    ],
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
  },
]

export function getTutorials(): Tutorial[] {
  return tutorials
}

export function getTutorialBySlug(slug: string): Tutorial | undefined {
  return tutorials.find((t) => t.slug === slug)
}
