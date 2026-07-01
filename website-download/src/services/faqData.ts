import { FAQItem } from '@/types'

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'HappyServ est-il gratuit ?',
    answer: 'Oui, HappyServ est complètement gratuit. Aucun abonnement ni achat intégré n\'est requis pour utiliser toutes les fonctionnalités de l\'application.',
    category: 'general',
  },
  {
    id: '2',
    question: 'Sur quelles plateformes HappyServ est-il disponible ?',
    answer: 'HappyServ est disponible sur Windows, macOS, Linux, Android et iOS. Vous pouvez télécharger la version correspondant à votre appareil depuis notre page de téléchargement.',
    category: 'general',
  },
  {
    id: '3',
    question: 'Comment créer un compte HappyServ ?',
    answer: 'Lancez l\'application et cliquez sur "Créer un compte". Remplissez vos informations (nom, email, mot de passe) et validez votre adresse email via le lien que nous vous envoyons.',
    category: 'account',
  },
  {
    id: '4',
    question: 'Mes données sont-elles synchronisées entre mes appareils ?',
    answer: 'Oui, HappyServ synchronise automatiquement vos données sur tous vos appareils lorsque vous êtes connecté à votre compte. Assurez-vous d\'avoir une connexion Internet active.',
    category: 'account',
  },
  {
    id: '5',
    question: 'HappyServ fonctionne-t-il sans connexion Internet ?',
    answer: 'Oui, HappyServ dispose d\'un mode hors-ligne qui vous permet d\'accéder à vos cours et à votre contenu téléchargé sans connexion Internet. La synchronisation se fera automatiquement lorsque vous serez reconnecté.',
    category: 'technical',
  },
  {
    id: '6',
    question: 'Comment réinitialiser mon mot de passe ?',
    answer: 'Sur l\'écran de connexion, cliquez sur "Mot de passe oublié". Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.',
    category: 'account',
  },
  {
    id: '7',
    question: 'Puis-je exporter mes données HappyServ ?',
    answer: 'Oui, vous pouvez exporter vos données depuis les paramètres de l\'application. HappyServ génère un fichier contenant toutes vos informations que vous pouvez télécharger.',
    category: 'technical',
  },
  {
    id: '8',
    question: 'Comment contacter le support HappyServ ?',
    answer: 'Vous pouvez nous contacter via le formulaire de contact sur notre site, par email à support@happyserv.app, ou par téléphone au +33 1 23 45 67 89 du lundi au vendredi de 9h à 18h.',
    category: 'general',
  },
]

export function getFAQs(): FAQItem[] {
  return faqItems
}
