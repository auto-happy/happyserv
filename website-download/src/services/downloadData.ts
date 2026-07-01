import type { Version, ChangelogEntry, Platform } from '@/types'
import { CONFIG } from '@/config/constants'

export const platforms: Platform[] = [
  { id: 'windows', name: 'Windows', icon: '💻' },
  { id: 'linux', name: 'Linux', icon: '🐧' },
  { id: 'macos', name: 'macOS', icon: '🍎' },
  { id: 'android', name: 'Android', icon: '📱' },
  { id: 'ios', name: 'iOS', icon: '📲' },
]

const changelogs: Record<string, ChangelogEntry> = {
  '2.1.0': {
    version: '2.1.0',
    date: '2024-06-15',
    items: [
      'Nouveau tableau de bord personnalisé',
      'Amélioration des performances de l\'interface',
      'Correction de bugs mineurs',
      'Ajout du support des thèmes personnalisés',
      'Optimisation de la consommation mémoire',
    ],
  },
  '2.0.0': {
    version: '2.0.0',
    date: '2024-05-01',
    items: [
      'Refonte complète de l\'interface utilisateur',
      'Nouveau moteur de synchronisation',
      'Support multi-comptes',
      'Mode hors-ligne amélioré',
      'Nouvelles statistiques de progression',
    ],
  },
  '1.9.0': {
    version: '1.9.0',
    date: '2024-03-20',
    items: [
      'Ajout du planning intelligent',
      'Synchronisation cloud en temps réel',
      'Nouveaux exercices de conduite',
      'Amélioration de l\'accessibilité',
    ],
  },
  '2.2.0-beta.1': {
    version: '2.2.0-beta.1',
    date: '2024-07-01',
    items: [
      'Préparation de l\'interface mobile adaptative',
      'Nouveau système de notifications',
      'API publique en test',
      'Améliorations de la sécurité',
    ],
  },
}

const versionData: Version[] = [
  ...platforms.map((p) => ({
    id: `2.1.0-${p.id}`,
    version: '2.1.0',
    platform: p.id,
    filename: `HappyServ-2.1.0-${p.id}.${p.id === 'windows' ? 'zip' : p.id === 'macos' ? 'dmg' : p.id === 'linux' ? 'AppImage' : p.id === 'android' ? 'apk' : 'ipa'}`,
    size: p.id === 'windows' ? '140 MB' : p.id === 'linux' ? '58.7 MB' : p.id === 'macos' ? '72.1 MB' : p.id === 'android' ? '32.5 MB' : '45.8 MB',
    sha256: '5911a6b74fd4332f10c3c59655d84583f101fa4bb627f1a10ac48a93ebd70743',
    releaseDate: '2026-07-01',
    type: 'stable' as const,
    changelog: changelogs['2.1.0'],
  })),
  ...platforms.map((p) => ({
    id: `2.0.0-${p.id}`,
    version: '2.0.0',
    platform: p.id,
    filename: `HappyServ-2.0.0-${p.id}.${p.id === 'windows' ? 'exe' : p.id === 'macos' ? 'dmg' : p.id === 'linux' ? 'AppImage' : p.id === 'android' ? 'apk' : 'ipa'}`,
    size: p.id === 'windows' ? '97.3 MB' : p.id === 'linux' ? '56.2 MB' : p.id === 'macos' ? '70.5 MB' : p.id === 'android' ? '30.8 MB' : '44.1 MB',
    sha256: 'b4c9d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
    releaseDate: '2024-05-01',
    type: 'stable' as const,
    changelog: changelogs['2.0.0'],
  })),
  ...platforms.map((p) => ({
    id: `2.2.0-beta.1-${p.id}`,
    version: '2.2.0-beta.1',
    platform: p.id,
    filename: `HappyServ-2.2.0-beta.1-${p.id}.${p.id === 'windows' ? 'exe' : p.id === 'macos' ? 'dmg' : p.id === 'linux' ? 'AppImage' : p.id === 'android' ? 'apk' : 'ipa'}`,
    size: p.id === 'windows' ? '65.0 MB' : p.id === 'linux' ? '59.5 MB' : p.id === 'macos' ? '73.2 MB' : p.id === 'android' ? '33.1 MB' : '46.4 MB',
    sha256: 'c5d0e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
    releaseDate: '2024-07-01',
    type: 'beta' as const,
    changelog: changelogs['2.2.0-beta.1'],
  })),
]

export function getVersions(): Version[] {
  return versionData
}

export function getVersionsByPlatform(platform: string): Version[] {
  return versionData.filter((v) => v.platform === platform)
}

export function getLatestVersion(platform: string, type: 'stable' | 'beta' = 'stable'): Version | undefined {
  return versionData
    .filter((v) => v.platform === platform && v.type === type)
    .sort((a, b) => b.version.localeCompare(a.version))[0]
}

export function getPlatformFromUserAgent(): string {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('win')) return 'windows'
  if (ua.includes('mac')) return 'macos'
  if (ua.includes('linux')) return 'linux'
  if (ua.includes('android')) return 'android'
  if (ua.includes('iphone') || ua.includes('ipad')) return 'ios'
  return 'windows'
}

export function getDownloadUrl(version: Version): string {
  return `${CONFIG.DOWNLOAD_BASE_URL}/v${version.version}/${version.filename}`
}
