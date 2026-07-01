import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiHeart } from 'react-icons/hi'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-gray-950 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-8 h-8" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footerLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
                <rect width="100" height="100" rx="20" fill="url(#footerLogo)" />
                <text x="50" y="68" fontFamily="Arial, sans-serif" fontSize="52" fontWeight="bold" fill="white" textAnchor="middle">H</text>
              </svg>
              <span className="text-xl font-bold text-white">HappyServ</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              {t('hero.subtitle')}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">{t('nav.accueil')}</Link></li>
              <li><Link to="/telechargement" className="text-gray-400 hover:text-white text-sm transition-colors">{t('nav.telechargement')}</Link></li>
              <li><Link to="/documentation" className="text-gray-400 hover:text-white text-sm transition-colors">{t('nav.documentation')}</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">{t('nav.blog')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Informations</h3>
            <ul className="space-y-2">
              <li><Link to="/a-propos" className="text-gray-400 hover:text-white text-sm transition-colors">{t('nav.aPropos')}</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">{t('nav.contact')}</Link></li>
              <li><Link to="/mentions-legales" className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.legal')}</Link></li>
              <li><Link to="/confidentialite" className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/conditions-utilisation" className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.terms')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/50 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} HappyServ. {t('footer.rights')}
          </p>
          <p className="text-gray-500 text-sm flex items-center mt-4 sm:mt-0">
            Made with <HiHeart className="text-red-500 mx-1" /> by HappyServ Team
          </p>
        </div>
      </div>
    </footer>
  )
}
