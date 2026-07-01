export interface Platform {
  id: string
  name: string
  icon: string
}

export interface ChangelogEntry {
  version: string
  date: string
  items: string[]
}

export interface Version {
  id: string
  version: string
  platform: string
  filename: string
  size: string
  sha256: string
  releaseDate: string
  type: 'stable' | 'beta'
  changelog: ChangelogEntry
}

export interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'down'
  uptime: number
  lastIncident: string | null
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  image: string
  category: string
  readTime: number
}

export interface DocSection {
  id: string
  slug: string
  title: string
  category: string
  content: string
  order: number
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

export interface Tutorial {
  id: string
  slug: string
  title: string
  description: string
  difficulty: 'débutant' | 'intermédiaire' | 'avancé'
  duration: string
  steps: TutorialStep[]
  image: string
}

export interface TutorialStep {
  title: string
  content: string
  image?: string
}
