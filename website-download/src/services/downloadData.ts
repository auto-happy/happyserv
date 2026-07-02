import type { Version, ChangelogEntry, Platform } from '@/types'
import { CONFIG } from '@/config/constants'

export const platforms: Platform[] = [
  { id: 'windows', name: 'Windows', icon: '💻' },
  { id: 'linux', name: 'Linux', icon: '🐧' },
  { id: 'android', name: 'Android', icon: '📱' },
]

const changelogs: Record<string, ChangelogEntry> = {
  '2.1.0': {
    version: '2.1.0',
    date: '2026-07-01',
    items: [
      'Nouveau tableau de bord personnalisé',
      'Amélioration des performances de l\'interface',
      'Correction de bugs mineurs',
      'Ajout du support des thèmes personnalisés',
      'Optimisation de la consommation mémoire',
      'Rebranding complet Happy Conduite',
      'Nettoyage données de test',
      'Mise à jour configuration serveur',
    ],
  },
}

const versionData: Version[] = [
  // Version 2.1.0 stable (seule version disponible)
  ...platforms.map((p) => ({
    id: `2.1.0-${p.id}`,
    version: '2.1.0',
    platform: p.id,
    filename: `HappyServ-2.1.0-${p.id}.${p.id === 'windows' ? 'zip' : p.id === 'linux' ? 'AppImage' : 'apk'}`,
    size: p.id === 'windows' ? '138 MB' : p.id === 'linux' ? '119 MB' : '15 MB',
    sha256: p.id === 'windows' ? '8e87cc768a6169aeb6ae578f2f04b11c59e0066dabae01478079e40ad0725c98' : p.id === 'linux' ? '08064325d73a6f9566bf7b16b89b78f9e9002424b9dfd15b34f3cff5dd4b1214' : '05d57804ca3f37a4d5366e4a44726a251e7f9e360fd804e40ffbdb4967b9dc00',
    releaseDate: '2026-07-01',
    type: 'stable' as const,
    changelog: changelogs['2.1.0'],
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
  if (ua.includes('linux')) return 'linux'
  if (ua.includes('android')) return 'android'
  return 'windows'
}

export function getDownloadUrl(version: Version): string {
  return `${CONFIG.DOWNLOAD_BASE_URL}/v${version.version}/${version.filename}`
}
