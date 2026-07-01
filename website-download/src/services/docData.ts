import { DocSection } from '@/types'

const docSections: DocSection[] = [
  {
    id: '1',
    slug: 'installation',
    title: 'Installation de HappyServ',
    category: 'gettingStarted',
    order: 1,
    content: `# Installation de HappyServ

## Configuration minimale requise

- **Windows** : Windows 10 ou ultérieur, 4 GB RAM, 500 MB d'espace disque
- **macOS** : macOS 12 Monterey ou ultérieur, 4 GB RAM, 500 MB d'espace disque
- **Linux** : Ubuntu 20.04+ ou équivalent, 4 GB RAM, 500 MB d'espace disque

## Procédure d'installation

1. Téléchargez la version correspondant à votre système d'exploitation depuis la page de téléchargement
2. Lancez le programme d'installation
3. Suivez les instructions à l'écran
4. Créez votre compte ou connectez-vous

## Vérification de l'installation

Après l'installation, HappyServ crée automatiquement un dossier de données utilisateur contenant vos paramètres et vos données de progression.`,
  },
  {
    id: '2',
    slug: 'premiers-pas',
    title: 'Premiers pas avec HappyServ',
    category: 'gettingStarted',
    order: 2,
    content: `# Premiers pas avec HappyServ

## Créer un compte

1. Ouvrez HappyServ
2. Cliquez sur "Créer un compte"
3. Remplissez vos informations
4. Validez votre adresse email

## Configuration initiale

Après votre première connexion, HappyServ vous guide à travers une configuration rapide :
- Préférences de conduite
- Objectifs d'apprentissage
- Notification et rappels

## Interface principale

Découvrez les différentes sections de l'application :
- **Tableau de bord** : Vue d'ensemble de votre progression
- **Leçons** : Accès aux cours et exercices
- **Planning** : Organisation de vos séances
- **Statistiques** : Analyse détaillée de votre progression`,
  },
  {
    id: '3',
    slug: 'planning-intelligent',
    title: 'Utiliser le planning intelligent',
    category: 'features',
    order: 3,
    content: `# Planning intelligent

Le planning intelligent de HappyServ apprend de vos habitudes pour vous proposer des séances d'entraînement adaptées à votre emploi du temps.

## Fonctionnement

Le planning analyse vos disponibilités et vos performances passées pour suggérer les meilleurs créneaux d'entraînement.

## Personnalisation

Vous pouvez ajuster manuellement vos préférences horaires et définir des objectifs hebdomadaires.

## Notifications

HappyServ vous envoie des rappels personnalisés pour ne manquer aucune séance.`,
  },
  {
    id: '4',
    slug: 'depannage',
    title: 'Dépannage et résolution des problèmes',
    category: 'troubleshooting',
    order: 4,
    content: `# Dépannage

## Problèmes courants

### L'application ne se lance pas
- Vérifiez que votre système répond à la configuration minimale
- Réinstallez l'application
- Contactez le support si le problème persiste

### La synchronisation ne fonctionne pas
- Vérifiez votre connexion Internet
- Assurez-vous d'être connecté à votre compte
- Redémarrez l'application

### Les notifications ne s'affichent pas
- Vérifiez les permissions de l'application
- Consultez les paramètres de notification du système
- Réinitialisez les paramètres de notification dans HappyServ`,
  },
]

export function getDocSections(): DocSection[] {
  return docSections
}

export function getDocSectionBySlug(slug: string): DocSection | undefined {
  return docSections.find((s) => s.slug === slug)
}

export function getDocSectionsByCategory(category: string): DocSection[] {
  return docSections.filter((s) => s.category === category)
}
