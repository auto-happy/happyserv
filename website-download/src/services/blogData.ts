import { BlogPost } from '@/types'

const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'conseils-conduite-hiver',
    title: '5 conseils pour bien conduire en hiver',
    excerpt: 'L\'hiver arrive et les conditions de conduite se dégradent. Découvrez nos conseils pour rouler en toute sécurité.',
    content: `# 5 conseils pour bien conduire en hiver

L'hiver est une période délicate pour les conducteurs. Entre le verglas, la neige et le brouillard, il est essentiel de prendre quelques précautions.

## 1. Vérifiez vos pneus

Assurez-vous que vos pneus sont en bon état et que leur pression est adaptée. Les pneus neige sont fortement recommandés.

## 2. Adaptez votre vitesse

Réduisez votre vitesse et augmentez les distances de sécurité. Sur sol glissant, les distances de freinage sont multipliées par 10.

## 3. Anticipez

Regardez loin devant et anticipez les freinages. Évitez les accélérations et les freinages brusques.

## 4. Équipez votre véhicule

Ayez toujours un grattoir, un dégivrant et une couverture dans votre véhicule. Un kit de premiers secours est également recommandé.

## 5. Restez informé

Consultez les prévisions météo et les conditions de circulation avant de prendre la route.`,
    author: 'Marie Dubois',
    date: '2024-06-20',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
    category: 'Conseils',
    readTime: 4,
  },
  {
    id: '2',
    slug: 'nouveautes-v2-1',
    title: 'Découvrez les nouveautés de la version 2.1',
    excerpt: 'Nouveau tableau de bord, thèmes personnalisés et bien plus encore. Voici tout ce qui change dans HappyServ 2.1.',
    content: `# Nouveautés HappyServ 2.1

La version 2.1 de HappyServ est arrivée avec son lot de nouveautés ! Découvrez tout ce qui change.

## Nouveau tableau de bord

Un tableau de bord entièrement repensé pour vous offrir une vue d'ensemble de votre progression.

## Thèmes personnalisés

Personnalisez l'apparence de l'application avec nos nouveaux thèmes.

## Performances améliorées

L'application est désormais plus rapide et plus fluide que jamais.

## Corrections de bugs

De nombreux bugs ont été corrigés pour une expérience plus agréable.`,
    author: 'Thomas Martin',
    date: '2024-06-15',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    category: 'Mise à jour',
    readTime: 3,
  },
  {
    id: '3',
    slug: 'reussir-permis-conduire',
    title: 'Comment réussir son permis de conduire du premier coup',
    excerpt: 'Préparation, pratique, gestion du stress : nos astuces pour maximiser vos chances de réussite.',
    content: `# Réussir son permis de conduire du premier coup

Le permis de conduire est une étape importante. Voici nos conseils pour maximiser vos chances de réussite.

## Une préparation sérieuse

Révisez régulièrement le code de la route et entraînez-vous avec des tests en ligne.

## La pratique régulière

Plus vous conduisez, plus vous gagnez en confiance. Essayez de varier les situations de conduite.

## La gestion du stress

Le jour de l'examen, respirez profondément et restez concentré. Vous avez les compétences nécessaires.

## Le jour J

Arrivez en avance, écoutez attentivement les instructions de l'examinateur et restez calme.`,
    author: 'Sophie Bernard',
    date: '2024-06-10',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800',
    category: 'Conseils',
    readTime: 5,
  },
  {
    id: '4',
    slug: 'conduite-ecologique',
    title: 'Les bons gestes pour une conduite plus écologique',
    excerpt: 'Adoptez une conduite responsable pour réduire votre empreinte carbone et faire des économies.',
    content: `# Conduite écologique : les bons gestes

Adopter une conduite écologique est bon pour la planète et pour votre portefeuille. Voici comment faire.

## Anticipez les ralentissements

En regardant loin devant, vous pouvez anticiper les ralentissements et éviter les freinages inutiles.

## Utilisez le régulateur de vitesse

Sur autoroute, le régulateur de vitesse permet de maintenir une vitesse constante et de réduire la consommation.

## Entretenez votre véhicule

Un véhicule bien entretenu consomme moins. Vérifiez régulièrement la pression des pneus et faites les révisions.

## Évitez les charges inutiles

Allégez votre véhicule en retirant les objets inutiles du coffre et de l'habitacle.`,
    author: 'Lucas Petit',
    date: '2024-06-05',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800',
    category: 'Environnement',
    readTime: 3,
  },
]

export function getBlogPosts(): BlogPost[] {
  return blogPosts
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}
