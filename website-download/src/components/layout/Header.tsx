import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiMenu, HiX } from 'react-icons/hi'

const navLinks = [
  { path: '/', labelKey: 'nav.accueil' },
  { path: '/telechargement', labelKey: 'nav.telechargement' },
  { path: '/nouveautes', labelKey: 'nav.nouveautes' },
  { path: '/documentation', labelKey: 'nav.documentation' },
  { path: '/tutoriels', labelKey: 'nav.tutoriels' },
  { path: '/faq', labelKey: 'nav.faq' },
  { path: '/blog', labelKey: 'nav.blog' },
  { path: '/statut', labelKey: 'nav.statut' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const location = useLocation()

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <svg className="w-8 h-8" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
              <rect width="100" height="100" rx="20" fill="url(#logoGrad)" />
              <text x="50" y="68" fontFamily="Arial, sans-serif" fontSize="52" fontWeight="bold" fill="white" textAnchor="middle">H</text>
            </svg>
            <span className="text-xl font-bold text-white">HappyServ</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path ? 'text-primary-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button onClick={toggleLang} className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-2 py-1 border border-gray-700 rounded">
              {i18n.language === 'fr' ? 'EN' : 'FR'}
            </button>
            <Link to="/telechargement" className="hidden sm:inline-flex btn-primary text-sm py-2 px-4">
              {t('hero.cta')}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-gray-400 hover:text-white">
              {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t border-gray-800 bg-gray-900/95 backdrop-blur-lg">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-medium transition-colors ${
                  location.pathname === link.path ? 'text-primary-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
            <Link to="/telechargement" onClick={() => setIsOpen(false)} className="block btn-primary text-center text-sm py-2 px-4">
              {t('hero.cta')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
